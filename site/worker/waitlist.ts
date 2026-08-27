/**
 * POST /api/waitlist — accept an email address for the pre-launch cohort.
 *
 * Split out of worker/index.ts so it can be unit-tested without constructing a
 * full Worker environment: every dependency arrives as an argument.
 *
 * RESPONSE CONTRACT
 * Every response is JSON (the /api/* rule from index.ts) and every non-2xx is
 * treated identically by the frontend, which falls back to a mailto link. So
 * status codes here are for operators reading logs, not for the UI:
 *   202  stored (or already present — see the note on idempotency below)
 *   400  malformed body or an address that is not plausibly an email
 *   405  wrong method
 *   503  the KV namespace is not bound yet (see wrangler.jsonc)
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

export interface WaitlistDeps {
	/** KV namespace, or undefined when the binding has not been provisioned. */
	store: KVNamespace | undefined;
	/** Injected so tests get a deterministic timestamp. */
	now: () => Date;
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
 *  what makes the KV key idempotent across resubmissions. */
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

	// The binding is intentionally absent until the namespace is provisioned —
	// see the commented kv_namespaces block in wrangler.jsonc. Failing loudly
	// with 503 beats silently accepting an address we then drop on the floor.
	if (!deps.store) {
		console.error("waitlist: WAITLIST KV binding is not configured; address not stored");
		return json({ error: "unavailable", message: "Waitlist is not accepting signups yet." }, 503);
	}

	// Key on the address so a resubmission overwrites rather than duplicating.
	// `first_seen` is preserved on rewrite so we keep the original signup time.
	const key = `email:${email}`;
	const nowIso = deps.now().toISOString();
	const existing = await deps.store.get(key);
	const firstSeen = existing
		? ((JSON.parse(existing) as { first_seen?: string }).first_seen ?? nowIso)
		: nowIso;

	await deps.store.put(
		key,
		JSON.stringify({
			email,
			first_seen: firstSeen,
			last_seen: nowIso,
			// Cloudflare adds this on the incoming request; useful for cohort
			// planning and costs nothing. Absent in `wrangler dev` and in tests.
			country: request.headers.get("cf-ipcountry") ?? null,
		}),
	);

	// 202, not 201: we have accepted the address, but "on the waitlist" is a
	// process that completes later (a human sends the invite). Also identical
	// for a first submission and a repeat, so the response never discloses
	// whether a given address is already registered.
	return json({ status: "accepted" }, 202);
}
