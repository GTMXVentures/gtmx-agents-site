import type { ReactElement } from "react";
import { COVERAGE, formatCount } from "@/data/coverage";

/**
 * Agents — the roster in full.
 *
 * The hero panel is the glance: four names, four live states. This is the same
 * four in depth, and it keeps the SAME numbers and the SAME names so a reader
 * who scrolled down from the panel lands on an expansion rather than on a
 * second, differently-worded feature list. If an agent is renamed, it must be
 * renamed in both places — that duplication is the cost of having a summary and
 * a detail view on a single route, and it is cheaper than the indirection of a
 * shared config for two call sites with genuinely different copy needs.
 *
 * `handoff` is the structural device: what each agent passes to the next. It is
 * what makes this a sequence rather than four independent tools, which is the
 * central product claim.
 */
const AGENTS = [
	{
		id: "matching",
		stage: "01",
		name: "Matching Agent",
		summary: "The list, built in an afternoon instead of a month.",
		body: `Screens ${formatCount(COVERAGE.firms)} firms and ${formatCount(COVERAGE.partners)} named partners against what you actually are — stage, sector, cheque size, geography, and the thesis a partner has written about publicly. You get a ranked list with the reason attached to every name, so you can argue with it.`,
		handoff: "Hands off: a ranked target list with a named partner per firm.",
	},
	{
		id: "outreach",
		stage: "02",
		name: "Outreach Agent",
		summary: "Every approach written for the fund that receives it.",
		body: "Drafts each message against that fund's thesis and your traction, surfaces the warmest available path in, and sequences sends so your round opens in a window rather than trickling out over two months. Nothing leaves without your review.",
		handoff: "Hands off: approved sends, sequenced, with a warm path where one exists.",
	},
	{
		id: "tracking",
		stage: "03",
		name: "Tracking Agent",
		summary: "One live state per fund, across every inbox.",
		body: "Reads across email, LinkedIn and meeting notes to hold a single view of each conversation — who asked what, what you owe them, what has gone quiet — and places every fund in exactly one of the deal room's stages.",
		handoff: "Hands off: an honest pipeline, including the conversations that ended.",
	},
	{
		id: "diligence",
		stage: "04",
		name: "Diligence Agent",
		summary: "The data room ready before it is asked for.",
		body: "Assembles the room from the questions funds actually ask at your stage, drafts the answers from your own numbers, and flags the gaps while there is still time to close them.",
		handoff: "Hands off: a room that answers the next question before the call.",
	},
];

export function Agents(): ReactElement {
	return (
		<section
			aria-labelledby="agents-heading"
			id="agents"
			className="scroll-mt-4 border-line border-t"
		>
			<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
				<div className="max-w-2xl">
					<p className="eyebrow">The agent team</p>
					<h2
						id="agents-heading"
						className="mt-5 text-balance font-display font-bold text-[clamp(2rem,4.5vw,3.25rem)] text-ink leading-[1] tracking-[-0.03em]"
					>
						Four agents, one handoff chain.
					</h2>
					<p className="mt-5 text-ink-muted leading-[1.7]">
						Not four tools you keep in sync — one sequence, where each agent's output is the next
						one's input. You review, you decide, you take the meeting.
					</p>
				</div>

				<ol className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line lg:grid-cols-2">
					{AGENTS.map((agent) => (
						<li
							key={agent.id}
							className="flex flex-col bg-surface p-7 transition-colors duration-200 hover:bg-surface-hover sm:p-9"
						>
							<div className="flex items-center gap-3">
								<span
									aria-hidden="true"
									className="flex size-8 shrink-0 items-center justify-center rounded-control border border-line font-mono text-[0.6875rem] text-ink-subtle tabular-nums"
								>
									{agent.stage}
								</span>
								<h3 className="font-display font-medium text-ink text-lg tracking-[-0.015em]">
									{agent.name}
								</h3>
							</div>

							<p className="mt-5 font-display font-medium text-ink text-lg leading-snug tracking-[-0.015em]">
								{agent.summary}
							</p>
							<p className="mt-3 text-ink-muted text-sm leading-[1.75]">{agent.body}</p>

							{/* mt-auto pins the handoff line to the bottom of every card, so the
							    chain reads as one horizontal band across the grid regardless of
							    how long each body paragraph runs. */}
							<p className="mt-auto border-line border-t pt-5 font-mono text-[0.6875rem] text-ink-subtle leading-[1.6]">
								<span className="text-accent">&rarr;</span> {agent.handoff}
							</p>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
