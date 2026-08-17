import { render, screen } from "@testing-library/react";
import App from "../App.jsx";

describe("App", () => {
	it("renders the InvestorIQ landing page heading", () => {
		render(<App />);

		expect(
			screen.getByRole("heading", {
				level: 1,
				name: /venture capital intelligence that closes deals faster/i,
			}),
		).toBeInTheDocument();
	});

	it("renders exactly one h1", () => {
		render(<App />);

		expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
	});

	it("renders the live database proof points", () => {
		render(<App />);

		expect(screen.getAllByText(/7,033 investor firms/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/22,402 named partners/i).length).toBeGreaterThan(0);
	});
});
