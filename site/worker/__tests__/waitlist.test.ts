import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleWaitlist, isValidEmail, normaliseEmail } from "../waitlist";

/**
 * The upstream is stubbed rather than hit. The contract these tests pin down was
 * verified against the live PostgREST endpoint first:
 *   new address        -> 201
 *   repeat address     -> 409 with body.code "23505"
 *   any read attempt   -> 42501, because the key has INSERT and no SELECT
 * If that ever changes, these stubs are the thing that will quietly stop
 * matching production, so they carry the real status codes rather than a mock's
 * idea of them.
 */

const SUPABASE_URL = "https://project.supabase.co";
const SUPABASE_KEY = "sb_publishable_test";

function deps(fetchImpl: typeof globalThis.fetch) {
	return { supabaseUrl: SUPABASE_URL, supabaseKey: SUPABASE_KEY, fetch: fetchImpl };
}

const ok = () => new Response(null, { status: 201 });
const duplicate = () =>
	new Response(JSON.stringify({ code: "23505", message: "duplicate key value" }), {
		status: 409,
		headers: { "content-type": "application/json" },
	});

const post = (body: unknown, init: RequestInit = {}) =>
	new Request("https://gtmxagents.com/api/waitlist", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: typeof body === "string" ? body : JSON.stringify(body),
		...init,
	});

describe("email validation", () => {
	it.each(["a@b.co", "kumar@gtmxagents.com", "first.last+tag@sub.domain.io"])(
		"accepts %s",
		(email) => {
			expect(isValidEmail(email)).toBe(true);
		},
	);

	it.each(["", "no-at-sign", "two@@at.com", "trailing@dot.", "spaces in@mail.com", "missing@tld"])(
		"rejects %s",
		(email) => {
			expect(isValidEmail(email)).toBe(false);
		},
	);

	it("rejects an address beyond the RFC practical maximum", () => {
		expect(isValidEmail(`${"a".repeat(250)}@example.com`)).toBe(false);
	});

	it("normalises case and surrounding whitespace", () => {
		expect(normaliseEmail("  Kumar@GTMXAgents.com \n")).toBe("kumar@gtmxagents.com");
	});
});

describe("handleWaitlist", () => {
	let calls: { url: string; init: RequestInit }[];
	let stub: typeof globalThis.fetch;

	beforeEach(() => {
		calls = [];
		stub = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
			calls.push({ url: String(url), init: init ?? {} });
			return ok();
		}) as unknown as typeof globalThis.fetch;
	});

	it("posts a valid address to the waitlist table and returns 202", async () => {
		const res = await handleWaitlist(post({ email: "founder@example.com" }), deps(stub));

		expect(res.status).toBe(202);
		expect(await res.json()).toEqual({ status: "accepted" });
		expect(calls).toHaveLength(1);
		expect(calls[0].url).toBe(`${SUPABASE_URL}/rest/v1/waitlist_signups`);
		expect(JSON.parse(calls[0].init.body as string).email).toBe("founder@example.com");
	});

	it("uses the publishable key and asks for no row back", async () => {
		await handleWaitlist(post({ email: "founder@example.com" }), deps(stub));
		const headers = calls[0].init.headers as Record<string, string>;
		expect(headers.apikey).toBe(SUPABASE_KEY);
		expect(headers.prefer).toBe("return=minimal");
	});

	it("never sends resolution=ignore-duplicates", async () => {
		// ON CONFLICT requires SELECT on the table, and granting SELECT would make
		// the signup list enumerable with the same key. Guarded here because it is
		// the obvious "simplification" someone would reach for.
		await handleWaitlist(post({ email: "founder@example.com" }), deps(stub));
		const headers = calls[0].init.headers as Record<string, string>;
		expect(headers.prefer).not.toContain("ignore-duplicates");
	});

	it("normalises before sending, so the unique index sees one address", async () => {
		await handleWaitlist(post({ email: "  Founder@Example.COM " }), deps(stub));
		expect(JSON.parse(calls[0].init.body as string).email).toBe("founder@example.com");
	});

	it("treats a duplicate as success, disclosing nothing", async () => {
		const res = await handleWaitlist(
			post({ email: "founder@example.com" }),
			deps(vi.fn(async () => duplicate()) as unknown as typeof globalThis.fetch),
		);
		expect(res.status).toBe(202);
		expect(await res.json()).toEqual({ status: "accepted" });
	});

	it("forwards the Cloudflare country and a truncated user agent", async () => {
		await handleWaitlist(
			post(
				{ email: "founder@example.com" },
				{ headers: { "cf-ipcountry": "IN", "user-agent": "x".repeat(400) } },
			),
			deps(stub),
		);
		const sent = JSON.parse(calls[0].init.body as string);
		expect(sent.country).toBe("IN");
		expect(sent.user_agent).toHaveLength(300);
	});

	it("never caches a response", async () => {
		const res = await handleWaitlist(post({ email: "founder@example.com" }), deps(stub));
		expect(res.headers.get("cache-control")).toBe("no-store");
	});

	it("rejects a non-POST method with 405 and an Allow header", async () => {
		const res = await handleWaitlist(
			new Request("https://gtmxagents.com/api/waitlist", { method: "GET" }),
			deps(stub),
		);
		expect(res.status).toBe(405);
		expect(res.headers.get("allow")).toBe("POST");
	});

	it.each([
		["malformed JSON", "{not json", 400],
		["a missing email field", JSON.stringify({ nope: 1 }), 400],
		["a non-string email", JSON.stringify({ email: 42 }), 400],
		["an invalid address", JSON.stringify({ email: "nope" }), 400],
	])("rejects %s with %i and never calls upstream", async (_label, body, status) => {
		const res = await handleWaitlist(post(body), deps(stub));
		expect(res.status).toBe(status);
		expect(calls).toHaveLength(0);
	});

	it("returns 503 rather than silently dropping when credentials are absent", async () => {
		const res = await handleWaitlist(post({ email: "founder@example.com" }), {
			supabaseUrl: undefined,
			supabaseKey: undefined,
			fetch: stub,
		});
		expect(res.status).toBe(503);
		expect(await res.json()).toMatchObject({ error: "unavailable" });
		expect(calls).toHaveLength(0);
	});

	it("returns 502 when the upstream cannot be reached", async () => {
		const res = await handleWaitlist(
			post({ email: "founder@example.com" }),
			deps(
				vi.fn(async () => {
					throw new TypeError("network");
				}) as unknown as typeof globalThis.fetch,
			),
		);
		expect(res.status).toBe(502);
	});

	it("returns 500 on an unexpected upstream refusal", async () => {
		// 42501 is what a key without INSERT gets. It must surface as a server
		// error, not be mistaken for a duplicate and reported as success.
		const res = await handleWaitlist(
			post({ email: "founder@example.com" }),
			deps(
				vi.fn(
					async () =>
						new Response(JSON.stringify({ code: "42501", message: "permission denied" }), {
							status: 401,
						}),
				) as unknown as typeof globalThis.fetch,
			),
		);
		expect(res.status).toBe(500);
	});
});
