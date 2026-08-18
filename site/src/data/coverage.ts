/**
 * The investor-database figures quoted on the page, in ONE place.
 *
 * These numbers appear in four separate places in the UI — the hero status
 * line, the hero stat trio, the agent-team pills, and the database section's
 * stat quad and sector table. Hard-coding them per component is how a landing
 * page ends up claiming 7,033 firms in the hero and 6,800 further down. Import
 * from here instead, and change a figure exactly once.
 *
 * These are real counts from the investor database behind the product, not
 * illustrative placeholders. If they are refreshed, refresh this file — and
 * keep `reachablePartners` consistent with the definition in the footnote
 * rendered by the database section: a named partner with a verified email.
 */
export const COVERAGE = {
	/** Investor organisations: institutional VCs, growth funds, family offices. */
	firms: 7033,
	/** Named individuals attached to those firms. */
	partners: 22402,
	/** Partners with a verified email — i.e. contactable without an intro hunt. */
	reachablePartners: 8959,
	/** Firms with at least one named partner attached. */
	firmsWithPartner: 4329,
	/** Stages in the canonical deal room, outreach through closing. */
	dealRoomStages: 13,
	/** Of those stages, the ones that move a conversation forward. */
	advancingStages: 9,
	/** …and the ones that record how a conversation ended. */
	terminalStages: 4,
} as const;

export interface SectorCoverage {
	readonly id: string;
	readonly name: string;
	readonly firms: number;
	readonly reachable: number;
}

/**
 * Ordered by firm count, descending — the order is the information. A sector
 * table sorted alphabetically hides the thing a founder is scanning for, which
 * is whether their own sector is thin.
 */
export const SECTORS: readonly SectorCoverage[] = [
	{ id: "b2b-saas", name: "B2B SaaS", firms: 2204, reachable: 754 },
	{ id: "ai-ml", name: "AI / ML", firms: 2179, reachable: 734 },
	{ id: "fintech", name: "Fintech", firms: 2090, reachable: 862 },
	{ id: "enterprise", name: "Enterprise", firms: 1556, reachable: 589 },
	{ id: "healthcare", name: "Healthcare", firms: 1382, reachable: 569 },
	{ id: "deeptech", name: "DeepTech", firms: 1331, reachable: 462 },
	{ id: "consumer", name: "Consumer", firms: 1299, reachable: 515 },
	{ id: "climate", name: "Climate", firms: 856, reachable: 313 },
];

/** Largest sector by firm count — the 100% mark for the coverage bars. */
export const LARGEST_SECTOR_FIRMS = SECTORS.reduce((max, sector) => Math.max(max, sector.firms), 0);

/**
 * Thousands separators without Intl.
 *
 * `toLocaleString()` would be the obvious call, but its output depends on the
 * runtime's ICU data and the ambient locale: full-ICU Node gives "7,033",
 * small-ICU or a non-en default can give "7 033" or "7.033". That turns a
 * snapshot-stable string into an environment-dependent one, and the figures
 * here are asserted in tests. This is deterministic everywhere.
 */
export function formatCount(value: number): string {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
