import { render, screen, within } from "@testing-library/react";
import App from "@/App";
import { COVERAGE, formatCount } from "@/data/coverage";

/**
 * Smoke test — the cheapest possible signal that the whole front-end toolchain
 * is wired up: the `@/` alias resolves, JSX compiles under the automatic
 * runtime, jsdom renders, and jest-dom matchers are registered.
 *
 * It asserts on the H1 by ROLE, not by class or test id, so the design can be
 * reworked freely; only removing the heading (or changing its text) breaks
 * this — which is exactly the change that should break a test, since the same
 * string is duplicated in index.html's <noscript> block for crawlers. If the
 * headline changes, change it in BOTH places.
 */
describe("App", () => {
	it("renders the campaign headline as the h1", () => {
		render(<App />);

		expect(
			screen.getByRole("heading", { level: 1, name: /agents that run your fundraise/i }),
		).toBeInTheDocument();
	});

	it("renders exactly one h1", () => {
		render(<App />);

		// A landing page with two <h1>s is the most common accessibility regression
		// when sections get added; cheaper to catch here than in an audit.
		expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
	});

	it("renders the product value proposition", () => {
		render(<App />);

		expect(screen.getByText(/build your pipeline, run the outreach/i)).toBeInTheDocument();
	});

	it("exposes the banner, main and contentinfo landmarks", () => {
		render(<App />);

		expect(screen.getByRole("banner")).toBeInTheDocument();
		expect(screen.getByRole("main")).toBeInTheDocument();
		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
	});

	it("anchors both hero calls to action at real sections on the page", () => {
		const { container } = render(<App />);

		// The CTA pair is the only navigation on a single-route page. An anchor
		// pointing at an id that no section carries is a dead button that no type
		// checker or linter would catch.
		for (const id of ["waitlist", "database", "agents"]) {
			expect(container.querySelector(`#${id}`)).not.toBeNull();
			expect(container.querySelector(`a[href="#${id}"]`)).not.toBeNull();
		}
	});
});

/**
 * The coverage figures are the page's only checkable claim, and they are quoted
 * in several sections. These tests exist to catch the specific failure where a
 * component stops importing from @/data/coverage and starts hard-coding a
 * number that then drifts — the assertions read the SAME source the components
 * do, so they fail on a literal typed into JSX rather than on a data update.
 */
describe("coverage figures", () => {
	it("quotes the firm count in the hero status line and the database section", () => {
		render(<App />);

		expect(screen.getAllByText(new RegExp(formatCount(COVERAGE.firms))).length).toBeGreaterThan(1);
	});

	it("breaks the database down by sector with reachable partner counts", () => {
		render(<App />);

		const database = screen.getByRole("region", { name: /the database behind the agents/i });

		expect(within(database).getByText("B2B SaaS")).toBeInTheDocument();
		expect(within(database).getByText("Climate")).toBeInTheDocument();
		// The footnote defines the one term the numbers depend on. Losing it turns
		// a precise claim into an unfalsifiable one.
		expect(
			within(database).getByText(/reachable = a named partner with a verified email/i),
		).toBeInTheDocument();
	});
});
