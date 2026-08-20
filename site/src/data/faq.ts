/**
 * The questions a founder asks before handing over their raise.
 *
 * Written to be answerable, not persuasive: every one that can quote a real
 * figure does, and the two that expose a limit (what the agents will not do,
 * and what the database is thin on) are kept rather than smoothed away. An FAQ
 * that only contains flattering answers is read as marketing and skipped.
 */
export interface FaqItem {
	readonly id: string;
	readonly question: string;
	readonly answer: string;
}

export const FAQS: readonly FaqItem[] = [
	{
		id: "different",
		question: "How is this different from a list of investors?",
		answer:
			"A list tells you a fund exists. The agents tell you whether it invests at your stage in your sector, who at that fund to write to, and what happened the last time you wrote. 8,959 of the 22,402 partners on file have a verified email, so the shortlist is a list of people you can actually reach.",
	},
	{
		id: "send",
		question: "Do the agents send email on my behalf?",
		answer:
			"Only with you in the loop. The Outreach Agent drafts one message per fund from that fund's thesis and your traction, and nothing leaves until you approve it. No blasts, and no sequences running while you sleep.",
	},
	{
		id: "data",
		question: "Where does the investor data come from, and how fresh is it?",
		answer:
			"It is a maintained database GTMX Ventures runs live deals against, refreshed on a nightly enrichment run. Every scraped or bulk record lands in a review queue and a person promotes it — nothing writes straight to the live table.",
	},
	{
		id: "coverage",
		question: "What is the database thin on?",
		answer:
			"Growth and late-stage mandates, and angels. There are 3,473 VC funds against 550 family offices and 174 angels, and 975 firms still have no sector or stage recorded. Untagged firms are left out of matches rather than guessed at, so a thin sector shows up as a small number rather than a bad match.",
	},
	{
		id: "stage",
		question: "How do I know my sector is covered at my stage?",
		answer:
			"Check it on this page. The sector table filters by Seed, Pre-Series A and Series A, and reports how many firms invest there and how many of those have a partner you can email.",
	},
	{
		id: "mcp",
		question: "Can I connect my own agents?",
		answer:
			"Yes, over the Model Context Protocol. Claude Code, Cursor or something you wrote yourself can run the same searches and read the same deal-room state the GTMX agents work from.",
	},
];
