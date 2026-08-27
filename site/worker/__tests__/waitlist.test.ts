import { beforeEach, describe, expect, it } from "vitest";
import { handleWaitlist, isValidEmail, normaliseEmail } from "../waitlist";

/**
 * A minimal in-memory stand-in for KVNamespace. Only get/put are exercised by
 * the handler, so implementing the full interface would be noise — the cast is
 * scoped to this fake and nothing else in the suite relies on it.
 */
function fakeStore() {
	const data = new Map<string, string>();
	return {
		data,
		kv: {
			get: async (key: string) => data.get(key) ?? null,
			put: async (key: string, value: string) => {
				data.set(key, value);
			},
		} as unknown as KVNamespace,
	};
}

const FIXED_NOW = new Date("2026-08-27T10:00:00.000Z");
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
	let store: ReturnType<typeof fakeStore>;
	const deps = () => ({ store: store.kv, now: () => FIXED_NOW });

	beforeEach(() => {
		store = fakeStore();
	});

	it("stores a valid address and returns 202", async () => {
		const res = await handleWaitlist(post({ email: "founder@example.com" }), deps());

		expect(res.status).toBe(202);
		expect(await res.json()).toEqual({ status: "accepted" });
		expect(store.data.get("email:founder@example.com")).toBeDefined();
	});

	it("never caches a response", async () => {
		const res = await handleWaitlist(post({ email: "founder@example.com" }), deps());
		expect(res.headers.get("cache-control")).toBe("no-store");
	});

	it("stores the normalised address, not the raw input", async () => {
		await handleWaitlist(post({ email: "  Founder@Example.COM " }), deps());
		expect(store.data.has("email:founder@example.com")).toBe(true);
		expect(store.data.size).toBe(1);
	});

	it("is idempotent and preserves the original first_seen", async () => {
		await handleWaitlist(post({ email: "founder@example.com" }), deps());
		const later = new Date("2026-09-01T00:00:00.000Z");
		const res = await handleWaitlist(post({ email: "founder@example.com" }), {
			store: store.kv,
			now: () => later,
		});

		expect(res.status).toBe(202);
		expect(store.data.size).toBe(1);
		const record = JSON.parse(store.data.get("email:founder@example.com") as string);
		expect(record.first_seen).toBe(FIXED_NOW.toISOString());
		expect(record.last_seen).toBe(later.toISOString());
	});

	it("records the Cloudflare country header when present", async () => {
		await handleWaitlist(
			post({ email: "founder@example.com" }, { headers: { "cf-ipcountry": "IN" } }),
			deps(),
		);
		const record = JSON.parse(store.data.get("email:founder@example.com") as string);
		expect(record.country).toBe("IN");
	});

	it("rejects a non-POST method with 405 and an Allow header", async () => {
		const res = await handleWaitlist(
			new Request("https://gtmxagents.com/api/waitlist", { method: "GET" }),
			deps(),
		);
		expect(res.status).toBe(405);
		expect(res.headers.get("allow")).toBe("POST");
	});

	it.each([
		["malformed JSON", "{not json", 400],
		["a missing email field", JSON.stringify({ nope: 1 }), 400],
		["a non-string email", JSON.stringify({ email: 42 }), 400],
		["an invalid address", JSON.stringify({ email: "nope" }), 400],
	])("rejects %s with %i", async (_label, body, status) => {
		const res = await handleWaitlist(post(body), deps());
		expect(res.status).toBe(status);
		expect(store.data.size).toBe(0);
	});

	it("returns 503 rather than silently dropping when the KV binding is absent", async () => {
		const res = await handleWaitlist(post({ email: "founder@example.com" }), {
			store: undefined,
			now: () => FIXED_NOW,
		});
		expect(res.status).toBe(503);
		expect(await res.json()).toMatchObject({ error: "unavailable" });
	});
});
