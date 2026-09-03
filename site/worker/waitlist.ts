/**
 * POST /api/waitlist — accept an email address for the pre-launch cohort.
 *
 * Split out of worker/index.ts so it can be unit-tested without constructing a
 * full Worker environment: every dependency arrives as an argument.
 *
 * STORAGE
 * Rows go to D1 (`waitlist_signups`), bound natively as `env.WAITLIST_DB`.
 *
 * D1 rather than the product's Postgres for two reasons. Marketing data and
 * application data have no reason to share a database, and CLAUDE.md already
 * draws that line. And a native binding means this Worker holds no credential
 * at all — nothing to set with `wrangler secret put`, nothing to rotate,
 * nothing to leak, and a compromised marketing site cannot reach the product
 * database even in principle.
 *
 * RESPONSE CONTRACT
 * Every response is JSON (the /api/* rule from index.ts) and every non-2xx is
 * treated identically by the frontend, which falls back to a mailto link. So
 * status codes here are for operators reading logs, not for the UI:
 *   202  stored, or already present — deliberately indistinguishable
 *   400  malformed body or an address that is not plausibly an email
 *   405  wrong method
 *   500  the insert failed for a reason we did not anticipate
 *   503  the D1 binding is not configured on this Worker
 */

/** Cap on the request body. An email is well under 1 KB; anything larger is
 *  either a bug or someone probing. Reading a bounded string keeps a hostile
 *  client from making us buffer megabytes before we reject it. */
const MAX_BODY_BYTES = 1024;

/** RFC 5321 caps a path at 256 octets; 254 is the practical maximum for a
 *  full address. Rejecting longer input before the regex avoids handing a
 *  pathological string to the matcher. */
const MAX_EMAIL_LENGTH = 254;

/** Kept for spotting bot floods, not for analytics — so a bound is fine. */
const MAX_USER_AGENT_LENGTH = 300;

/**
 * Deliberately permissive: one @, something either side, a dot in the domain,
 * no whitespace. Stricter patterns reject valid addresses (plus-tags, new
 * gTLDs, unicode locals) and the only thing that truly validates an address is
 * sending mail to it. The goal here is to catch typos and junk, not to be an
 * RFC parser.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/**
 * ON CONFLICT DO NOTHING makes a resubmission a silent no-op, so the handler
 * never has to read the table to find out whether an address is already known
 * — which is also why this endpoint cannot be used to test whether someone is
 * on the list.
 */
const INSERT_SQL = `
	INSERT INTO waitlist_signups (email, country, user_agent)
	VALUES (?, ?, ?)
	ON CONFLICT(email) DO NOTHING
`;

export interface WaitlistDeps {
	/** D1 binding, or undefined when the database has not been provisioned. */
	db: D1Database | undefined;
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
 *  what makes the UNIQUE constraint do its job across resubmissions. */
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

	// The binding is absent until the database is created and its id is filled
	// into wrangler.jsonc. Failing loudly beats accepting an address we then
	// drop on the floor.
	if (!deps.db) {
		console.error("waitlist: WAITLIST_DB binding is not configured; address not stored");
		return json({ error: "unavailable", message: "Waitlist is not accepting signups yet." }, 503);
	}

	try {
		await deps.db
			.prepare(INSERT_SQL)
			.bind(
				email,
				// Cloudflare adds this to the incoming request; absent locally.
				request.headers.get("cf-ipcountry") ?? null,
				request.headers.get("user-agent")?.slice(0, MAX_USER_AGENT_LENGTH) ?? null,
			)
			.run();
	} catch (cause) {
		// A duplicate does not land here — ON CONFLICT DO NOTHING handles it — so
		// anything thrown is a real failure worth a 500 and a log line.
		console.error("waitlist: insert failed", cause);
		return json({ error: "insert_failed", message: "Could not record the signup." }, 500);
	}

	// 202, not 201: the address is accepted, but "on the waitlist" completes
	// later when a human sends the invite. Identical for a first submission and
	// a repeat, so the response never discloses whether an address is already
	// registered.
	return json({ status: "accepted" }, 202);
}
