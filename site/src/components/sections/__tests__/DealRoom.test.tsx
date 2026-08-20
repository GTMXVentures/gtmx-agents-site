import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DealRoom } from "@/components/sections/DealRoom";
import { COVERAGE } from "@/data/coverage";
import { ADVANCING_STAGES, TERMINAL_STAGES } from "@/data/dealRoom";

/**
 * The section's whole claim is a count and a split, so the tests guard exactly
 * that: the stage data cannot drift away from the figures quoted beside it, and
 * selecting a stage has to actually change the panel.
 */
describe("DealRoom", () => {
	it("renders every advancing stage as its own control", () => {
		render(<DealRoom />);
		expect(screen.getAllByRole("button")).toHaveLength(ADVANCING_STAGES.length);
	});

	it("keeps the stage data and the quoted counts in step", () => {
		// If someone adds a stage without touching @/data/coverage, the heading
		// would claim a number the list does not contain. This is the guard.
		expect(ADVANCING_STAGES).toHaveLength(COVERAGE.advancingStages);
		expect(TERMINAL_STAGES).toHaveLength(COVERAGE.terminalStages);
		expect(COVERAGE.advancingStages + COVERAGE.terminalStages).toBe(COVERAGE.dealRoomStages);
	});

	it("swaps the detail panel when another stage is selected", async () => {
		const user = userEvent.setup();
		render(<DealRoom />);

		const first = ADVANCING_STAGES[0];
		const last = ADVANCING_STAGES[ADVANCING_STAGES.length - 1];

		await user.click(screen.getByRole("button", { name: new RegExp(first.name, "i") }));
		expect(screen.getByRole("heading", { level: 3, name: first.name })).toBeInTheDocument();
		expect(screen.getByText(first.next)).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: new RegExp(last.name, "i") }));
		expect(screen.getByRole("heading", { level: 3, name: last.name })).toBeInTheDocument();
		expect(screen.queryByText(first.next)).not.toBeInTheDocument();
	});

	it("marks only the selected stage as pressed", async () => {
		const user = userEvent.setup();
		render(<DealRoom />);

		await user.click(screen.getByRole("button", { name: /term sheet negotiations/i }));
		const pressed = screen
			.getAllByRole("button")
			.filter((b) => b.getAttribute("aria-pressed") === "true");
		expect(pressed).toHaveLength(1);
		expect(pressed[0]).toHaveAccessibleName(/term sheet negotiations/i);
	});

	it("lists the terminal states without numbering them", () => {
		render(<DealRoom />);
		for (const stage of TERMINAL_STAGES) {
			expect(screen.getByText(stage.name)).toBeInTheDocument();
		}
	});
});
