import chosenlyLogo from "@/assets/clients/chosenly.svg";
import comprinnoLogo from "@/assets/clients/comprinno.png";
import greenovativeLogo from "@/assets/clients/greenovative.svg";
import mytronLogo from "@/assets/clients/mytron.png";
import nexxioLogo from "@/assets/clients/nexxio.png";
import telosaLogo from "@/assets/clients/telosa.png";
import thingsupLogo from "@/assets/clients/thingsup.png";

/**
 * Companies GTMX has run a raise for.
 *
 * `logo` is optional on purpose. Until a company's mark is in
 * `src/assets/clients/`, the strip sets its name as a wordmark — which reads as
 * deliberate, where a broken <img> or an invented mark does not.
 *
 * Every mark must have a TRANSPARENT background. The strip normalises marks to
 * white (`brightness-0 invert`) because the page ground is #050506 and the seven
 * brands span blue, green, cyan and near-black — Chosenly's mark is #111111 and
 * would be invisible untreated. That filter turns any opaque background into a
 * solid white box, so check the alpha channel before adding a file: a PNG can
 * carry an alpha channel and still be fully opaque.
 *
 * Only add a company here once the engagement is public. This list is a public
 * claim about who we work for.
 */

export type Client = {
	/** Stable key — also the test selector. */
	readonly id: string;
	/** Display name, spelled as the company spells it. */
	readonly name: string;
	/** Imported asset URL. Omit until a real mark exists — never a placeholder. */
	readonly logo?: string;
	/**
	 * Intrinsic width of `logo` at its rendered height, so the row reserves the
	 * right space and does not reflow as marks load. Required with `logo`.
	 */
	readonly logoWidth?: number;
	/**
	 * Rendered height in px. Defaults to LOGO_HEIGHT.
	 *
	 * Equal box height does NOT mean equal optical size: a lockup carrying a
	 * tagline spends part of its height on type nobody can read at this scale,
	 * so its wordmark lands smaller than everyone else's. These values are
	 * tuned by eye against the rendered row, which is the only way to do it.
	 */
	readonly logoHeight?: number;
	/**
	 * Skip the white normalisation and render the mark in its own colours.
	 *
	 * The invert turns any solid shape into a solid white shape. For a lockup
	 * whose icon is a filled tile that reads as a blank white block beside the
	 * wordmark, which looks broken rather than deliberate.
	 */
	readonly noInvert?: boolean;
};

/** Default rendered height. Per-client `logoHeight` overrides it optically. */
export const LOGO_HEIGHT = 28;

export const CLIENTS: readonly Client[] = [
	{ id: "greenovative", name: "Greenovative", logo: greenovativeLogo, logoWidth: 159 },
	// Tagline under the wordmark eats ~a third of the height, so at the shared
	// 28px its name renders about half the size of everyone else's.
	// noInvert for the same reason as ThingsUp: filled icon tile.
	{ id: "telosa", name: "Telosa", logo: telosaLogo, logoWidth: 92, logoHeight: 38, noInvert: true },
	// noInvert: its icon is a filled tile — inverted it is a blank white block.
	{
		id: "thingsup",
		name: "ThingsUp",
		logo: thingsupLogo,
		logoWidth: 106,
		logoHeight: 32,
		noInvert: true,
	},
	{ id: "mytron", name: "MyTron Labs", logo: mytronLogo, logoWidth: 155 },
	{ id: "chosenly", name: "Chosenly", logo: chosenlyLogo, logoWidth: 147 },
	{ id: "nexxio", name: "Nexxio", logo: nexxioLogo, logoWidth: 133 },
	{ id: "comprinno", name: "Comprinno", logo: comprinnoLogo, logoWidth: 135 },
];
