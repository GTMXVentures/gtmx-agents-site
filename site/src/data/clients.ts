/**
 * Companies GTMX has run a raise for.
 *
 * `logo` is optional on purpose. Until a company's mark is in
 * `src/assets/clients/`, the strip sets its name as a wordmark — which reads as
 * deliberate, where a broken <img> or an invented mark does not. To add a real
 * logo: drop the SVG in, import it, and set `logo` on that one entry. Nothing
 * else changes.
 *
 * Only add a company here once the engagement is public. This list is a public
 * claim about who we work for.
 */

export type Client = {
	/** Stable key — also the test selector. */
	readonly id: string;
	/** Display name, exactly as the company writes it. */
	readonly name: string;
	/** Imported asset URL. Omit until a real mark exists — never a placeholder. */
	readonly logo?: string;
	/**
	 * Intrinsic width of `logo` at `LOGO_HEIGHT`, so the row reserves the right
	 * space and does not reflow as marks load. Required whenever `logo` is set.
	 */
	readonly logoWidth?: number;
};

/** Every mark renders at this height, so wide wordmarks and square marks sit evenly. */
export const LOGO_HEIGHT = 28;

export const CLIENTS: readonly Client[] = [
	{ id: "greenovative", name: "Greenovative" },
	{ id: "telosa", name: "Telosa" },
	{ id: "thingsup", name: "ThingsUp" },
	{ id: "mytron", name: "Mytron" },
	{ id: "choosenly", name: "Choosenly" },
	{ id: "nexxio", name: "Nexxio" },
	{ id: "comprino", name: "Comprino" },
];
