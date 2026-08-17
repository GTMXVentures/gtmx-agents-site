import type { ReactElement } from "react";

/**
 * Agents — the four capabilities.
 *
 * This section IS a sequence (match → reach → track → prep is the order a raise
 * actually runs in), which is what earns the 01–04 markers here after the
 * Problem section deliberately refused them. The numbers deliberately rhyme with
 * the hero ledger: same four stages, same labels, so the artifact at the top of
 * the page and the explanation below it are visibly one system.
 *
 * No icons. A lucide glyph per card is the reflex move and would read as
 * decoration next to the ledger; the stage number already does the marking job.
 */
const AGENTS = [
	{
		id: "match",
		stage: "01",
		name: "Investor matching",
		summary: "The list, built in an afternoon instead of a month.",
		body: "Screens a curated VC database against what you actually are — stage, sector, cheque size, geography, and the thesis a partner has written about publicly. You get a ranked list with the reason attached to every name, so you can argue with it.",
	},
	{
		id: "reach",
		stage: "02",
		name: "Outreach orchestration",
		summary: "Every approach written for the fund that receives it.",
		body: "Drafts each message against that fund's thesis and your traction, surfaces the warmest available path in, and sequences sends so your round opens in a window rather than trickling out over two months.",
	},
	{
		id: "track",
		stage: "03",
		name: "Conversation tracking",
		summary: "One live state per fund, across every inbox.",
		body: "Reads across email, LinkedIn and meeting notes to hold a single view of each conversation — who asked what, what you owe them, what has gone quiet — so nothing has to be reconstructed from memory on a Sunday night.",
	},
	{
		id: "prep",
		stage: "04",
		name: "Diligence prep",
		summary: "The data room ready before it is asked for.",
		body: "Assembles the room from the questions funds actually ask at your stage, drafts the answers from your own numbers, and flags the gaps while there is still time to close them.",
	},
];

export function Agents(): ReactElement {
	return (
		<section aria-labelledby="agents-heading" className="border-line/70 border-b">
			<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
				<div className="max-w-3xl">
					<p className="eyebrow">The agent</p>
					<h2
						id="agents-heading"
						className="mt-5 text-balance font-display font-medium text-[clamp(1.875rem,4vw,2.75rem)] text-ink-display leading-[1.05] tracking-[-0.015em]"
					>
						Four stages of a round, worked continuously.
					</h2>
					<p className="mt-5 text-ink-muted leading-[1.7]">
						One agent, running the whole sequence — not four tools you have to keep in sync. You
						review, you decide, you take the meeting.
					</p>
				</div>

				<ol className="mt-14 grid gap-px overflow-hidden rounded-card border border-line/70 bg-line/70 sm:grid-cols-2">
					{AGENTS.map((agent) => (
						<li
							key={agent.id}
							className="bg-base p-7 transition-colors duration-200 hover:bg-surface sm:p-9"
						>
							<div className="flex items-baseline gap-4">
								<span className="font-mono text-accent text-xs tabular-nums">{agent.stage}</span>
								<h3 className="font-medium text-ink text-xl tracking-[-0.01em]">{agent.name}</h3>
							</div>
							<p className="mt-4 font-display text-ink-display text-lg italic leading-snug">
								{agent.summary}
							</p>
							<p className="mt-4 text-ink-muted text-sm leading-[1.75]">{agent.body}</p>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
