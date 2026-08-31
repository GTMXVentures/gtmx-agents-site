/**
 * POST /api/waitlist — accept an email address for the pre-launch cohort.
 *
 * Split out of worker/index.ts so it can be unit-tested without constructing a
 * full Worker environment: every dependency arrives as an argument.
 *
 * STORAGE
 * Rows go to Supabase (`public.waitlist_signups`) over PostgREST, using the
 * PUBLISHABLE key rather than the service key. That key is granted INSERT and
 * nothing else, and the table's RLS has no SELECT policy — so the worst case
 * for a leaked key is junk rows, never an exfiltrated signup list. Supabase was
 * chosen over KV because the team already operates it and its dashboard is the
 * read path; nobody wants to run `wrangler kv key list` to see who signed up.
 *
 * RESPONSE CONTRACT
 * Every response is JSON (the /api/* rule from index.ts) and every non-2xx is
 * treated identically by the frontend, which falls back to a mailto link. So
 * status codes here are for operators reading logs, not for the UI:
 *   202  stored, or already present — deliberately indistinguishable
 *   400  malformed body or an address that is not plausibly an email
 *   405  wrong method
 *   500  the upstream refused for a reason we did not anticipate
 *   503  the Supabase credentials are not configured on this Worker
 */

/** Cap on the request body. An email is well under 1 KB; anything larger is
 *  either a bug or someone probing. Reading a bounded string keeps a hostile
 *  client from making us buffer megabytes before we reject it. */
const MAX_BODY_BYTES = 1024;

/** RFC 5321 caps a path at 256 octets; 254 is the practical maximum for a
 *  full address. Rejecting longer input before the regex avoids handing a
 *  pathological string to the matcher. */
const MAX_EMAIL_LENGTH = 254;

/**
 * Deliberately permissive: one @, something either side, a dot in the domain,
 * no whitespace. Stricter patterns reject valid addresses (plus-tags, new
 * gTLDs, unicode locals) and the only thing that truly validates an address is
 * sending mail to it. The goal here is to catch typos and junk, not to be an
 * RFC parser.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/** Postgres unique-violation. PostgREST surfaces it as a 409 with this code. */
const PG_UNIQUE_VIOLATION = "23505";

const TABLE = "waitlist_signups";

export interface WaitlistDeps {
	/** Supabase project URL, e.g. https://<ref>.supabase.co */
	supabaseUrl: string | undefined;
	/** Publishable/anon key. Must NOT be the service key. */
	supabaseKey: string | undefined;
	/** Injected so tests can stub the network. */
	fetch: typeof globalThis.fetch;
}

const json = (body: unknown, status: number, headers: HeadersInit = {}): Response =>
	Response.json(body, {
		status,
		// Never cache: a 202 is a side effect, and a 400 must not be replayed from
		// a CDN edge after the client fixes their input.
		headers: { "cache-control": "no-store", ...headers },
	});

export function isValidEmail(candidate: string): boolean {
	return (
		candidate.length > 0 && candidate.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(candidate)
	);
}

/** Lowercase + trim. Case is not significant for the domain and effectively
 *  never significant for the local part in practice, so normalising here is
 *  what makes the unique index do its job across resubmissions. */
export function normaliseEmail(raw: string): string {
	return raw.trim().toLowerCase();
}

export async function handleWaitlist(request: Request, deps: WaitlistDeps): Promise<Response> {
	if (request.method !== "POST") {
		return json({ error: "method_not_allowed", message: "Use POST." }, 405, { allow: "POST" });
	}

	const raw = await request.text();
	if (raw.length > MAX_BODY_BYTES) {
		return json({ error: "payload_too_large", message: "Body too large." }, 413);
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return json({ error: "bad_request", message: "Body must be JSON." }, 400);
	}

	const candidate =
		typeof parsed === "object" && parsed !== null && "email" in parsed
			? (parsed as { email: unknown }).email
			: undefined;

	if (typeof candidate !== "string") {
		return json({ error: "bad_request", message: "Field 'email' is required." }, 400);
	}

	const email = normaliseEmail(candidate);
	if (!isValidEmail(email)) {
		return json(
			{ error: "invalid_email", message: "That does not look like an email address." },
			400,
		);
	}

	// Credentials are set with `wrangler secret put`, so a fresh environment has
	// none. Failing loudly beats accepting an address we then drop on the floor.
	if (!deps.supabaseUrl || !deps.supabaseKey) {
		console.error("waitlist: SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY not configured");
		return json({ error: "unavailable", message: "Waitlist is not accepting signups yet." }, 503);
	}

	let upstream: Response;
	try {
		upstream = await deps.fetch(`${deps.supabaseUrl}/rest/v1/${TABLE}`, {
			method: "POST",
			headers: {
				apikey: deps.supabaseKey,
				authorization: `Bearer ${deps.supabaseKey}`,
				"content-type": "application/json",
				// return=minimal: we have no SELECT privilege and do not want the row
				// back. Note we deliberately do NOT send
				// `resolution=ignore-duplicates` — PostgREST implements that as ON
				// CONFLICT, which requires SELECT on the table, and granting SELECT
				// would make the signup list enumerable with the same key. The
				// duplicate is handled below instead.
				prefer: "return=minimal",
			},
			body: JSON.stringify({
				email,
				// Cloudflare adds this to the incoming request; useful for cohort
				// planning and costs nothing. Absent locally and in tests.
				country: request.headers.get("cf-ipcountry") ?? null,
				user_agent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
			}),
		});
	} catch (cause) {
		console.error("waitlist: upstream request failed", cause);
		return json({ error: "upstream_unreachable", message: "Could not record the signup." }, 502);
	}

	if (upstream.ok) {
		// 202, not 201: the address is accepted, but "on the waitlist" completes
		// later when a human sends the invite.
		return json({ status: "accepted" }, 202);
	}

	// A repeat signup is a 409 unique violation. Answer exactly as for a first
	// signup — partly because it is true from the visitor's side, and partly so
	// the endpoint never discloses whether a given address is already on the list.
	if (upstream.status === 409) {
		const body = (await upstream.json().catch(() => null)) as { code?: string } | null;
		if (body?.code === PG_UNIQUE_VIOLATION) {
			return json({ status: "accepted" }, 202);
		}
	}

	console.error(`waitlist: upstream ${upstream.status}`, await upstream.text().catch(() => ""));
	return json({ error: "upstream_error", message: "Could not record the signup." }, 500);
}
