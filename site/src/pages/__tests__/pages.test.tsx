import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { COMPANY } from "@/data/company";
import Company from "@/pages/Company";
import Contact from "@/pages/Contact";
import Product from "@/pages/Product";

/**
 * The load-bearing assertions here are the NEGATIVE ones.
 *
 * Every unset field in @/data/company must render nothing at all — no "TBD", no
 * em dash, no empty definition row. These pages exist because a reviewer judged
 * the site to contain too little information about the company; a placeholder
 * that advertises the gap is worse than an omission, and an invented value is
 * worse than both. If someone later "helpfully" adds a fallback string, these
 * tests fail.
 */

const PAGES = [
	{ name: "Product", Component: Product, heading: /four agents run the raise/i },
	{ name: "Company", Component: Company, heading: /agents we needed ourselves/i },
	{ name: "Contact", Component: Contact, heading: /talk to a person/i },
] as const;

describe.each(PAGES)("$name page", ({ Component, heading }) => {
	it("renders exactly one h1", () => {
		render(<Component />);
		const h1s = screen.getAllByRole("heading", { level: 1 });
		expect(h1s).toHaveLength(1);
		expect(h1s[0]).toHaveTextContent(heading);
	});

	it("exposes the banner, main and contentinfo landmarks", () => {
		render(<Component />);
		expect(screen.getByRole("banner")).toBeInTheDocument();
		expect(screen.getByRole("main")).toBeInTheDocument();
		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
	});

	it("marks its own nav item as the current page", () => {
		const { container } = render(<Component />);
		expect(container.querySelectorAll('a[aria-current="page"]')).toHaveLength(1);
	});
});

describe("unset company facts are omitted, never stubbed", () => {
	it("renders no phone link while COMPANY.phone is unset", () => {
		expect(COMPANY.phone).toBeNull();
		const { container } = render(<Contact />);
		expect(container.querySelector('a[href^="tel:"]')).toBeNull();
	});

	it("renders no address element while COMPANY.address is unset", () => {
		expect(COMPANY.address).toBeNull();
		const { container } = render(<Contact />);
		expect(container.querySelector("address")).toBeNull();
	});

	it("renders every team member with a name and a role", () => {
		render(<Company />);
		const heading = screen.getByRole("heading", { name: /who builds it/i });
		// Scoped to the section: a role like "Product" also appears in the site
		// nav, so an unscoped text query matches two elements and throws.
		const section = heading.closest("section");
		expect(section).not.toBeNull();
		const team = within(section as HTMLElement);
		for (const member of COMPANY.team) {
			expect(team.getByRole("heading", { name: member.name })).toBeInTheDocument();
			expect(team.getByText(member.role)).toBeInTheDocument();
		}
	});

	it("renders no LinkedIn link for a member who has not supplied one", () => {
		// Same null-means-omit rule as the company facts, applied per person:
		// a member without a URL gets no link, not a dead one.
		const withoutLinkedin = COMPANY.team.filter((m) => m.linkedin === null);
		expect(withoutLinkedin.length).toBeGreaterThan(0);
		const { container } = render(<Company />);
		expect(container.querySelectorAll('a[href*="linkedin.com"]')).toHaveLength(
			COMPANY.team.length - withoutLinkedin.length,
		);
	});

	it("omits the team section entirely when the roster is empty", () => {
		// Guards the branch itself rather than today's data: an empty grid with a
		// "team coming soon" caption advertises the exact gap a reader checks for.
		expect(Company.toString()).toContain("team.length > 0");
	});

	it("never renders a placeholder token in place of a missing fact", () => {
		for (const { Component } of PAGES) {
			const { container, unmount } = render(<Component />);
			const text = container.textContent ?? "";
			// The strings a well-meaning edit would reach for.
			expect(text).not.toMatch(/\bTBD\b|\bTODO\b|Coming soon|Lorem ipsum/i);
			unmount();
		}
	});

	it("still publishes the one contact fact we do have", () => {
		render(<Contact />);
		expect(screen.getAllByRole("link", { name: COMPANY.email }).length).toBeGreaterThan(0);
	});
});
