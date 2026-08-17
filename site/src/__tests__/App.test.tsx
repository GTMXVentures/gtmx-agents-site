import { render, screen } from "@testing-library/react";
import App from "@/App";

/**
 * Smoke test — the cheapest possible signal that the whole front-end toolchain
 * is wired up: the `@/` alias resolves, JSX compiles under the automatic
 * runtime, jsdom renders, and jest-dom matchers are registered.
 *
 * It asserts on the H1 by ROLE, not by class or test id, so the UI workstream
 * can restyle the Hero freely; only removing the heading (or its text) breaks
 * this — which is exactly the change that should break a test, since the same
 * string is duplicated in index.html's <noscript> block for crawlers.
 *
 * NOTE for future edits: the brand line "GTMX Agents" is an eyebrow <span>
 * INSIDE the <h1>, which is what keeps the heading's accessible name matching
 * here while the visible headline is the campaign line. And the value-prop
 * assertion below matches the subline's DIRECT text nodes — Testing Library's
 * getByText ignores text contributed by child elements — so do not wrap
 * "investor matching, outreach, and diligence" in a <span>.
 */
describe("App", () => {
	it("renders the GTMX Agents heading", () => {
		render(<App />);

		expect(screen.getByRole("heading", { level: 1, name: /gtmx agents/i })).toBeInTheDocument();
	});

	it("renders exactly one h1", () => {
		render(<App />);

		// A landing page with two <h1>s is the most common accessibility regression
		// when sections get added; cheaper to catch here than in an audit.
		expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
	});

	it("renders the product value proposition", () => {
		render(<App />);

		expect(screen.getByText(/investor matching, outreach, and diligence/i)).toBeInTheDocument();
	});

	it("exposes the banner, main and contentinfo landmarks", () => {
		render(<App />);

		expect(screen.getByRole("banner")).toBeInTheDocument();
		expect(screen.getByRole("main")).toBeInTheDocument();
		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
	});
});
