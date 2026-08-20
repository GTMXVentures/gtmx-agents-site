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

	/* --- Composition of the 7,033, by the firm's own type ------------------
	 * Counted from the `vc_type` column, which is a constrained vocabulary
	 * rather than free text, so these are exact rather than approximate.
	 *
	 * They are SUBSETS, not a partition: VCs + family offices + angels come to
	 * 4,197, and the remaining 2,836 are PE funds, accelerators, venture debt,
	 * banks, and firms still awaiting a type. Presenting them as a breakdown
	 * that sums to the total would be the easy lie here. */

	/** Institutional venture funds — the core of the database. */
	vcFunds: 3473,
	/** Single-family offices plus multi-family offices and wealth managers. */
	familyOffices: 550,
	/** Angel funds and syndicates, plus individually-listed angels. */
	angels: 174,
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

/**
 * Funding stages the sector table can be filtered by.
 *
 * Only three, and that is a data constraint rather than a design one: Seed,
 * Pre-Series A and Series A are the stages the database actually carries in
 * volume. Growth and late-stage mandates are too thin to quote honestly, so
 * they are not offered as a filter rather than shown as near-empty rows.
 *
 * `all` is not a stage — it is the unfiltered view, and it maps to the totals
 * already in SECTORS. Keeping it in the same list lets the UI render one row of
 * buttons instead of special-casing a "clear filter" control.
 */
export const STAGES = [
	{ id: "all", name: "All stages" },
	{ id: "seed", name: "Seed" },
	{ id: "pre-a", name: "Pre-Series A" },
	{ id: "series-a", name: "Series A" },
] as const;

export type StageId = (typeof STAGES)[number]["id"];

interface StageCell {
	readonly firms: number;
	readonly reachable: number;
}

/**
 * Sector x stage counts, same definitions as SECTORS: `firms` is firms that
 * list the sector AND the stage, `reachable` is the subset with a named partner
 * on a verified email.
 *
 * These do NOT sum to the SECTORS totals, and should not be made to. A fund
 * that invests at both Seed and Series A is counted in both stage columns and
 * once in the sector total, so the stage rows overlap by design — the same
 * reason the footnote already warns that sector totals exceed COVERAGE.firms.
 */
const SECTOR_STAGE_COVERAGE: Record<string, Record<Exclude<StageId, "all">, StageCell>> = {
	"b2b-saas": {
		seed: { firms: 1758, reachable: 642 },
		"pre-a": { firms: 331, reachable: 175 },
		"series-a": { firms: 1269, reachable: 528 },
	},
	"ai-ml": {
		seed: { firms: 1802, reachable: 653 },
		"pre-a": { firms: 312, reachable: 149 },
		"series-a": { firms: 1301, reachable: 525 },
	},
	fintech: {
		seed: { firms: 1549, reachable: 633 },
		"pre-a": { firms: 306, reachable: 162 },
		"series-a": { firms: 1263, reachable: 542 },
	},
	enterprise: {
		seed: { firms: 1097, reachable: 452 },
		"pre-a": { firms: 184, reachable: 94 },
		"series-a": { firms: 950, reachable: 388 },
	},
	healthcare: {
		seed: { firms: 980, reachable: 429 },
		"pre-a": { firms: 208, reachable: 113 },
		"series-a": { firms: 767, reachable: 373 },
	},
	deeptech: {
		seed: { firms: 1008, reachable: 399 },
		"pre-a": { firms: 184, reachable: 99 },
		"series-a": { firms: 703, reachable: 309 },
	},
	consumer: {
		seed: { firms: 977, reachable: 402 },
		"pre-a": { firms: 210, reachable: 118 },
		"series-a": { firms: 643, reachable: 330 },
	},
	climate: {
		seed: { firms: 572, reachable: 249 },
		"pre-a": { firms: 124, reachable: 67 },
		"series-a": { firms: 395, reachable: 190 },
	},
};

/**
 * The sector table's rows for a given stage. Returns SECTORS unchanged for
 * `all`, so the default render is identical to the pre-filter one.
 *
 * Order is preserved from SECTORS (descending by total firm count) rather than
 * re-sorted per stage. Re-sorting would make rows jump between filters, and the
 * question a founder is answering — "where does my sector sit?" — is easier when
 * the row stays put and only its numbers move.
 */
export function sectorsForStage(stage: StageId): readonly SectorCoverage[] {
	if (stage === "all") return SECTORS;
	return SECTORS.map((sector) => {
		const cell = SECTOR_STAGE_COVERAGE[sector.id]?.[stage];
		return cell ? { ...sector, firms: cell.firms, reachable: cell.reachable } : sector;
	});
}

/**
 * The 100% mark for the coverage bars at a given stage.
 *
 * Scaled to the largest sector WITHIN the current filter, not to the global
 * maximum. Pre-Series A tops out around 331 firms against a global max of 2,204,
 * so a fixed scale would collapse every Pre-Series A bar into an unreadable
 * sliver and answer no question at all.
 */
export function largestFirmsForStage(stage: StageId): number {
	return sectorsForStage(stage).reduce((max, sector) => Math.max(max, sector.firms), 0);
}

/**
 * The hero's headline figures: what kind of investor the database actually
 * holds. A founder raising a seed round cares whether there are angels and
 * family offices in here at all, not only institutional VCs — and the honest
 * answer is "far fewer", which this shows rather than hides.
 *
 * `Investors` is the total and the other three are subsets of it; see the note
 * in COVERAGE above for why they do not sum.
 */
export const INVESTOR_TYPES = [
	{ id: "investors", value: COVERAGE.firms, label: "Investors" },
	{ id: "vcs", value: COVERAGE.vcFunds, label: "VCs" },
	{ id: "family-offices", value: COVERAGE.familyOffices, label: "Family offices" },
	{ id: "angels", value: COVERAGE.angels, label: "Angels" },
] as const;
