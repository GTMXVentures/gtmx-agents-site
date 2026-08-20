import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import { COVERAGE, formatCount } from "@/data/coverage";

/**
 * Agents — the autonomous deal team.
 *
 * 4 specialized agents executing a unified handoff pipeline:
 * 1. Matching Agent: Sourcing-in-reverse against active fund theses
 * 2. Outreach Agent: High-context personalized approach generation
 * 3. Tracking Agent: Cross-inbox live sync & 13-stage deal room
 * 4. Diligence Agent: Proactive data room & automated Q&A readiness
 */
const AGENTS = [
	{
		id: "matching",
		stage: "01",
		name: "Matching Agent",
		summary: "High-conviction target list built in an afternoon.",
		body: `Screens ${formatCount(COVERAGE.firms)} institutional funds and ${formatCount(COVERAGE.partners)} named decision-makers against your exact stage, sector, cheque target, geography, and partner thesis history. You get a ranked pipeline with transparent conviction scoring attached to every lead.`,
		handoff: "Hands off: a prioritized target matrix with the lead check-writer per firm.",
	},
	{
		id: "outreach",
		stage: "02",
		name: "Outreach Agent",
		summary: "Hyper-personalized approaches drafted for every partner.",
		body: "Synthesizes each partner's public portfolio investments, recent essays, and active mandates to draft high-context outreach that stands out in partner inboxes. Sequences outreach in synchronized waves—nothing leaves without founder approval.",
		handoff: "Hands off: scheduled, approved outreach waves with warm paths prioritized.",
	},
	{
		id: "tracking",
		stage: "03",
		name: "Tracking Agent",
		summary: "One live deal room state across all your inboxes.",
		body: "Monitors email threads, LinkedIn messages, and meeting notes to maintain a unified conversation state for every fund. Automatically maps each active dialogue into the 13 canonical deal stages so no warm thread goes cold.",
		handoff: "Hands off: an automated deal room with clear next-action ownership.",
	},
	{
		id: "diligence",
		stage: "04",
		name: "Diligence Agent",
		summary: "Institutional data room ready before the first call.",
		body: "Anticipates the exact diligence requests Tier-1 funds ask at your stage, structures your financial & cohort data, and flags narrative gaps before partner meetings, compressing term sheet timelines.",
		handoff: "Hands off: a structured data room that accelerates investor conviction.",
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
				<Reveal className="max-w-2xl">
					<p className="eyebrow">The autonomous agent team</p>
					<h2
						id="agents-heading"
						className="mt-5 text-balance font-display font-bold text-[clamp(2rem,4.5vw,3.25rem)] text-ink leading-[1] tracking-[-0.03em]"
					>
						Four agents, one continuous pipeline.
					</h2>
					<p className="mt-5 text-ink-muted leading-[1.7]">
						Not disconnected point tools—one synchronized agent sequence where each agent's output
						seamlessly triggers the next step in your fundraise. You review, decide, and close.
					</p>
				</Reveal>

				<ol className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line lg:grid-cols-2">
					{AGENTS.map((agent) => (
						<li
							key={agent.id}
							className="flex flex-col bg-surface p-7 transition-colors duration-200 hover:bg-surface-hover sm:p-9"
						>
							<div className="flex items-center gap-3">
								<span
									aria-hidden="true"
									className="flex size-8 shrink-0 items-center justify-center rounded-control border border-line font-mono text-[0.6875rem] text-accent tabular-nums font-bold"
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
