import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Clients } from "@/components/sections/Clients";
import { CLIENTS } from "@/data/clients";

/**
 * This section is a public claim about who we work for, so these guard the two
 * ways it could quietly misrepresent that: a company silently dropping out of
 * the row, or a mark rendering with no accessible name — which is how a logo
 * strip turns into a row of anonymous images for anyone not looking at it.
 */
describe("Clients", () => {
	it("renders every client in the data file", () => {
		render(<Clients />);

		for (const client of CLIENTS) {
			expect(screen.getByTestId(`client-${client.id}`)).toBeInTheDocument();
		}
		expect(screen.getAllByTestId(/^client-/)).toHaveLength(CLIENTS.length);
	});

	it("names each client, whether it renders as a mark or a wordmark", () => {
		render(<Clients />);

		for (const client of CLIENTS) {
			const entry = within(screen.getByTestId(`client-${client.id}`));

			if (client.logo) {
				// A mark is only named by its alt text.
				expect(entry.getByRole("img", { name: client.name })).toBeInTheDocument();
			} else {
				// A wordmark is its own accessible name.
				expect(entry.getByText(client.name)).toBeInTheDocument();
			}
		}
	});

	it("gives a logo entry the width it needs to reserve space", () => {
		// Without an intrinsic width the row reflows as marks load in.
		for (const client of CLIENTS) {
			if (client.logo) {
				expect(client.logoWidth, `${client.id} sets logo but no logoWidth`).toBeGreaterThan(0);
			}
		}
	});

	it("has no duplicate ids", () => {
		expect(new Set(CLIENTS.map((c) => c.id)).size).toBe(CLIENTS.length);
	});
});
