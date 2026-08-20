import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Database } from "@/components/sections/Database";
import { formatCount, SECTORS, sectorsForStage } from "@/data/coverage";

/**
 * The coverage check is the only falsifiable thing on the page, so these guard
 * the two ways it could quietly lie: the figures drifting from the data file,
 * or a selection not actually changing them.
 */
describe("Database coverage check", () => {
	it("opens on the first sector at Series A", () => {
		render(<Database />);

		expect(screen.getByRole("button", { name: SECTORS[0].name })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		expect(screen.getByRole("button", { name: "Series A" })).toHaveAttribute(
			"aria-pressed",
			"true",
		);

		const row = sectorsForStage("series-a")[0];
		expect(screen.getByText(formatCount(row.firms))).toBeInTheDocument();
		expect(screen.getByText(formatCount(row.reachable))).toBeInTheDocument();
	});

	it("swaps both figures when the stage changes", async () => {
		const user = userEvent.setup();
		render(<Database />);

		const seriesA = sectorsForStage("series-a")[0];
		await user.click(screen.getByRole("button", { name: "Seed" }));

		const seed = sectorsForStage("seed")[0];
		expect(screen.getByText(formatCount(seed.firms))).toBeInTheDocument();
		expect(screen.getByText(formatCount(seed.reachable))).toBeInTheDocument();
		// The previous figure must be gone, not merely off screen.
		expect(screen.queryByText(formatCount(seriesA.firms))).not.toBeInTheDocument();
	});

	it("swaps both figures when the sector changes", async () => {
		const user = userEvent.setup();
		render(<Database />);

		const climate = SECTORS.find((sector) => sector.id === "climate");
		if (!climate) throw new Error("climate sector missing from SECTORS");

		await user.click(screen.getByRole("button", { name: climate.name }));

		const row = sectorsForStage("series-a").find((sector) => sector.id === "climate");
		if (!row) throw new Error("climate missing from the series-a view");
		expect(screen.getByText(formatCount(row.firms))).toBeInTheDocument();
		expect(screen.getByText(formatCount(row.reachable))).toBeInTheDocument();
	});

	it("never reports more reachable than in scope", () => {
		for (const stage of ["seed", "pre-a", "series-a"] as const) {
			for (const sector of sectorsForStage(stage)) {
				expect(sector.reachable, `${sector.id} at ${stage}`).toBeLessThanOrEqual(sector.firms);
				expect(sector.firms, `${sector.id} at ${stage}`).toBeGreaterThan(0);
			}
		}
	});

	it("defines the term the figures depend on", () => {
		render(<Database />);
		expect(
			screen.getByText(/reachable = a named partner with a verified email/i),
		).toBeInTheDocument();
	});

	it("labels both pickers for assistive tech", () => {
		render(<Database />);
		expect(
			within(screen.getByRole("group", { name: "Sector" })).getAllByRole("button"),
		).toHaveLength(SECTORS.length);
		expect(
			within(screen.getByRole("group", { name: "Stage" })).getAllByRole("button"),
		).toHaveLength(3);
	});
});
