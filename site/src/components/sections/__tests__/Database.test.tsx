import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Database } from "@/components/sections/Database";
import { SECTORS, sectorsForStage } from "@/data/coverage";

/**
 * These tests guard the two things a stage filter can silently get wrong: the
 * numbers stop matching the data file, or the row order changes under the
 * reader. Both render fine and both are wrong.
 */
describe("Database sector coverage", () => {
	it("defaults to the unfiltered totals", () => {
		render(<Database />);

		const allStages = screen.getByRole("button", { name: "All stages" });
		expect(allStages).toHaveAttribute("aria-pressed", "true");
		// 2,204 is B2B SaaS across all stages — the largest row.
		expect(screen.getByText("2,204")).toBeInTheDocument();
	});

	it("swaps the figures when a stage is selected", async () => {
		const user = userEvent.setup();
		render(<Database />);

		await user.click(screen.getByRole("button", { name: "Series A" }));

		expect(screen.getByRole("button", { name: "Series A" })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		expect(screen.getByRole("button", { name: "All stages" })).toHaveAttribute(
			"aria-pressed",
			"false",
		);

		// B2B SaaS at Series A, straight from the data file.
		expect(screen.getByText("1,269")).toBeInTheDocument();
		// The all-stages figure for that row must be gone, not merely hidden.
		expect(screen.queryByText("2,204")).not.toBeInTheDocument();
	});

	it("keeps sector rows in their all-stages order when filtered", () => {
		// Pre-Series A reorders sectors by size (Fintech overtakes AI / ML on
		// reachable partners), so a re-sorting bug would show up here first.
		const filtered = sectorsForStage("pre-a");
		expect(filtered.map((sector) => sector.id)).toEqual(SECTORS.map((sector) => sector.id));
	});

	it("returns the SECTORS array itself for the unfiltered view", () => {
		expect(sectorsForStage("all")).toBe(SECTORS);
	});

	it("covers every sector at every stage", () => {
		for (const stage of ["seed", "pre-a", "series-a"] as const) {
			for (const sector of sectorsForStage(stage)) {
				expect(sector.firms, `${sector.id} at ${stage}`).toBeGreaterThan(0);
				expect(sector.reachable, `${sector.id} at ${stage}`).toBeGreaterThan(0);
				// Reachable is a subset of firms; a cell violating this would render a
				// bar segment wider than the bar containing it.
				expect(sector.reachable).toBeLessThanOrEqual(sector.firms);
			}
		}
	});

	it("labels the filter group for assistive tech", () => {
		render(<Database />);
		const group = screen.getByRole("group", { name: "Filter sector coverage by funding stage" });
		expect(within(group).getAllByRole("button")).toHaveLength(4);
	});
});
