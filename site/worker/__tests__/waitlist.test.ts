import { beforeEach, describe, expect, it } from "vitest";
import { handleWaitlist, isValidEmail, normaliseEmail } from "../waitlist";

/**
 * A minimal stand-in for the D1 prepared-statement chain. Only prepare/bind/run
 * are exercised, so implementing the full interface would be noise — the cast
 * is scoped to this fake and nothing else relies on it.
 *
 * It records the SQL and bound parameters rather than executing them, because
 * what these tests are pinning down is the contract with D1: which statement is
 * sent, with which values, and how a failure is translated into a response.
 */
function fakeDb(onRun?: () => void) {
	const runs: { sql: string; params: unknown[] }[] = [];
	const db = {
		prepare(sql: string) {
			return {
				bind(...params: unknown[]) {
					return {
						async run() {
							runs.push({ sql, params });
							onRun?.();
							return { success: true, meta: {} };
						},
					};
				},
			};
		},
	} as unknown as D1Database;
	return { db, runs };
}

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
	let fake: ReturnType<typeof fakeDb>;

	beforeEach(() => {
		fake = fakeDb();
	});

	it("inserts a valid address and returns 202", async () => {
		const res = await handleWaitlist(post({ email: "founder@example.com" }), { db: fake.db });

		expect(res.status).toBe(202);
		expect(await res.json()).toEqual({ status: "accepted" });
		expect(fake.runs).toHaveLength(1);
		expect(fake.runs[0].params[0]).toBe("founder@example.com");
	});

	it("relies on ON CONFLICT rather than reading the table first", () => {
		// Reading to check for an existing address would make this endpoint an
		// oracle for whether a given person is on the list. The conflict clause is
		// what keeps a resubmission a silent no-op without a read.
		const { runs, db } = fakeDb();
		return handleWaitlist(post({ email: "founder@example.com" }), { db }).then(() => {
			expect(runs[0].sql).toMatch(/ON CONFLICT\(email\) DO NOTHING/i);
			expect(runs[0].sql).not.toMatch(/\bSELECT\b/i);
			expect(runs).toHaveLength(1);
		});
	});

	it("normalises before binding, so the UNIQUE constraint sees one address", async () => {
		await handleWaitlist(post({ email: "  Founder@Example.COM " }), { db: fake.db });
		expect(fake.runs[0].params[0]).toBe("founder@example.com");
	});

	it("binds the Cloudflare country and a truncated user agent", async () => {
		await handleWaitlist(
			post(
				{ email: "founder@example.com" },
				{ headers: { "cf-ipcountry": "IN", "user-agent": "x".repeat(400) } },
			),
			{ db: fake.db },
		);
		expect(fake.runs[0].params[1]).toBe("IN");
		expect(fake.runs[0].params[2]).toHaveLength(300);
	});

	it("binds null rather than undefined when the headers are absent", async () => {
		// D1 rejects undefined as a bound parameter; null is the representable
		// "we did not have this" and is what the column allows.
		await handleWaitlist(post({ email: "founder@example.com" }), { db: fake.db });
		expect(fake.runs[0].params[1]).toBeNull();
		expect(fake.runs[0].params[2]).toBeNull();
	});

	it("never caches a response", async () => {
		const res = await handleWaitlist(post({ email: "founder@example.com" }), { db: fake.db });
		expect(res.headers.get("cache-control")).toBe("no-store");
	});

	it("rejects a non-POST method with 405 and an Allow header", async () => {
		const res = await handleWaitlist(
			new Request("https://gtmxagents.com/api/waitlist", { method: "GET" }),
			{ db: fake.db },
		);
		expect(res.status).toBe(405);
		expect(res.headers.get("allow")).toBe("POST");
	});

	it.each([
		["malformed JSON", "{not json", 400],
		["a missing email field", JSON.stringify({ nope: 1 }), 400],
		["a non-string email", JSON.stringify({ email: 42 }), 400],
		["an invalid address", JSON.stringify({ email: "nope" }), 400],
	])("rejects %s with %i and never touches the database", async (_label, body, status) => {
		const res = await handleWaitlist(post(body), { db: fake.db });
		expect(res.status).toBe(status);
		expect(fake.runs).toHaveLength(0);
	});

	it("returns 503 rather than silently dropping when the binding is absent", async () => {
		const res = await handleWaitlist(post({ email: "founder@example.com" }), { db: undefined });
		expect(res.status).toBe(503);
		expect(await res.json()).toMatchObject({ error: "unavailable" });
	});

	it("returns 500 when the insert throws", async () => {
		const failing = fakeDb(() => {
			throw new Error("D1_ERROR: no such table");
		});
		const res = await handleWaitlist(post({ email: "founder@example.com" }), { db: failing.db });
		expect(res.status).toBe(500);
		expect(await res.json()).toMatchObject({ error: "insert_failed" });
	});
});
