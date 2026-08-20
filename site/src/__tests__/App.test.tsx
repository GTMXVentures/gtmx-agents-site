import { render, screen, within } from "@testing-library/react";
import App from "@/App";
import { COVERAGE, formatCount } from "@/data/coverage";

/**
 * Smoke test — front-end toolchain verification.
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

		expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
	});

	it("renders the product value proposition", () => {
		render(<App />);

		expect(screen.getByText(/orchestrate your entire round/i)).toBeInTheDocument();
	});

	it("exposes the banner, main and contentinfo landmarks", () => {
		render(<App />);

		expect(screen.getByRole("banner")).toBeInTheDocument();
		expect(screen.getByRole("main")).toBeInTheDocument();
		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
	});

	it("anchors both hero calls to action at real sections on the page", () => {
		const { container } = render(<App />);

		for (const id of ["waitlist", "database", "agents"]) {
			expect(container.querySelector(`#${id}`)).not.toBeNull();
			expect(container.querySelector(`a[href="#${id}"]`)).not.toBeNull();
		}
	});
});

describe("coverage figures", () => {
	it("quotes the firm count in the database section", () => {
		render(<App />);

		expect(screen.getAllByText(new RegExp(formatCount(COVERAGE.firms))).length).toBeGreaterThanOrEqual(1);
	});

	it("breaks the database down by sector with reachable partner counts", () => {
		render(<App />);

		const database = screen.getByRole("region", { name: /check the database before you pitch/i });

		expect(within(database).getByText("B2B SaaS")).toBeInTheDocument();
		expect(within(database).getByText("Climate")).toBeInTheDocument();
		expect(
			within(database).getByText(/reachable = a named partner with a verified email/i),
		).toBeInTheDocument();
	});
});
