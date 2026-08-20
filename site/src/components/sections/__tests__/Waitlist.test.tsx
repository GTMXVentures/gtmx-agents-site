import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Waitlist } from "@/components/sections/Waitlist";

/**
 * The failure path is the path that runs in production TODAY: `/api/waitlist`
 * does not exist, and the Worker answers every /api/* route with a JSON 404 on
 * purpose (site/worker/index.ts). So this is not a defensive edge-case test —
 * it covers the only response the live site can currently produce, and it is
 * what stops the form from silently becoming a dead end.
 *
 * fetch is stubbed rather than left to jsdom: jsdom's fetch would attempt a real
 * request to a relative URL with no origin and fail in a way that happens to
 * look like the behaviour under test, so the test would pass for the wrong
 * reason.
 */
describe("Waitlist", () => {
	beforeEach(() => {
		vi.stubGlobal("fetch", vi.fn());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it("falls back to the contact email when the endpoint returns a non-2xx", async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ error: "not_found" }), {
				status: 404,
				headers: { "content-type": "application/json" },
			}),
		);
		const user = userEvent.setup();
		render(<Waitlist />);

		await user.type(screen.getByLabelText(/work email/i), "founder@example.com");
		await user.click(screen.getByRole("button", { name: /talk to us/i }));

		// toHaveTextContent, not getByText: the address is a nested <a>, so the
		// sentence is split across elements.
		expect(await screen.findByRole("status")).toHaveTextContent(
			/not wired up to take this yet — reach us at hello@gtmxagents\.com/i,
		);
		expect(screen.getByRole("link", { name: /hello@gtmxagents\.com/i })).toHaveAttribute(
			"href",
			"mailto:hello@gtmxagents.com",
		);
	});

	it("shows the same fallback when the request never completes", async () => {
		vi.mocked(fetch).mockRejectedValue(new TypeError("Failed to fetch"));
		const user = userEvent.setup();
		render(<Waitlist />);

		await user.type(screen.getByLabelText(/work email/i), "founder@example.com");
		await user.click(screen.getByRole("button", { name: /talk to us/i }));

		expect(await screen.findByRole("status")).toHaveTextContent(/not wired up to take this yet/i);
	});

	it("posts the email to /api/waitlist and confirms on success", async () => {
		vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 202 }));
		const user = userEvent.setup();
		render(<Waitlist />);

		await user.type(screen.getByLabelText(/work email/i), "founder@example.com");
		await user.click(screen.getByRole("button", { name: /talk to us/i }));

		expect(await screen.findByRole("status")).toHaveTextContent(/we will come back to you/i);
		expect(fetch).toHaveBeenCalledWith(
			"/api/waitlist",
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({ email: "founder@example.com" }),
			}),
		);
	});
});
