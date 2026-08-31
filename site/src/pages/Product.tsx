import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import { Shell } from "@/components/Shell";
import { COVERAGE, formatCount } from "@/data/coverage";

/**
 * /product — what the thing actually is.
 *
 * This page exists because the home page sells the outcome and never explains
 * the mechanism. A reader who wants to know what they would be buying, or a
 * reviewer checking that a real product sits behind the domain, currently has
 * nowhere to go.
 *
 * Same rule as the rest of the site: no invented statistics. Every figure comes
 * from @/data/coverage, which is counted from the live database.
 */

const PIPELINE = [
	{
		id: "collect",
		step: "Collect",
		title: "Investor records, gathered continuously",
		body: "Firm records arrive from aggregators, public filings, fund websites and partner rosters. Everything lands in a raw store first — nothing is discarded at the point of collection, so a parsing mistake is replayable rather than a permanent hole.",
	},
	{
		id: "resolve",
		step: "Resolve",
		title: "Deduplicated, classified, filtered",
		body: "Records are matched against what we already hold by normalised domain and name, so the same fund arriving from three sources stays one row. Individuals are separated from organisations, and aggregator, directory and parked-domain pages are rejected before they reach the database.",
	},
	{
		id: "enrich",
		step: "Enrich",
		title: "Thesis, stage, cheque size, partners",
		body: "Each firm is enriched from its own published material — investment thesis, the stages it writes at, cheque range, sectors, and the partners who make decisions. Values are validated against a fixed vocabulary rather than stored as free text, which is what makes them filterable.",
	},
	{
		id: "review",
		step: "Review",
		title: "A person approves before it goes live",
		body: "No automated source writes to the live database directly. Records queue for review, are merged into any firm we already hold rather than duplicating it, and a nightly audit re-checks live records for the failure modes that survive everything upstream.",
	},
];

const AGENTS = [
	{
		id: "sourcing",
		name: "Sourcing agent",
		does: "Builds the target list",
		body: `Reads the company and the round, then ranks funds against each one's own published thesis rather than a keyword filter over ${formatCount(COVERAGE.firms)} rows. Returns a prioritised matrix with the lead decision-maker named at every firm.`,
		autonomy: "Runs unattended. You approve the list, not each lookup.",
	},
	{
		id: "outreach",
		name: "Outreach agent",
		does: "Writes the approaches",
		body: `Synthesises a partner's portfolio, recent writing and active mandates into an approach specific to them, and sequences sends in waves. ${formatCount(COVERAGE.reachablePartners)} partners across ${formatCount(COVERAGE.firmsWithPartner)} firms are reachable by name and verified email.`,
		autonomy: "Drafts autonomously; nothing sends without founder approval.",
	},
	{
		id: "conversations",
		name: "Conversation agent",
		does: "Keeps the pipeline true",
		body: `Watches email and LinkedIn threads and maintains one state per fund, mapping every live dialogue onto ${COVERAGE.dealRoomStages} canonical deal stages — ${COVERAGE.advancingStages} that advance a round and ${COVERAGE.terminalStages} that record how it ended.`,
		autonomy: "Runs continuously. Surfaces what needs a reply rather than waiting to be asked.",
	},
	{
		id: "diligence",
		name: "Diligence agent",
		does: "Prepares the answers",
		body: "Anticipates what a fund asks at your stage, structures the financial and cohort data behind it, and flags the narrative gaps a partner will probe before the meeting rather than during it.",
		autonomy: "Works ahead of the calendar, not in response to a request.",
	},
];

export default function Product(): ReactElement {
	return (
		<Shell current="/product" skipTo={{ href: "#capabilities", label: "Skip to capabilities" }}>
			{/* ── Intro ───────────────────────────────────────────────────────── */}
			<section aria-labelledby="product-heading">
				<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
					<Reveal>
						<p className="eyebrow">The product</p>
						<h1
							id="product-heading"
							className="mt-5 max-w-4xl text-balance font-display font-bold text-[clamp(2.25rem,5.5vw,3.75rem)] text-ink leading-[1] tracking-[-0.03em]"
						>
							Four agents run the raise. You approve the decisions.
						</h1>
						<p className="mt-7 max-w-2xl text-ink-muted text-lg leading-[1.7]">
							Not a database with a search box, and not a chatbot that answers questions about
							fundraising. Four agents that each own a job a founder currently does by hand —
							sourcing, outreach, conversation tracking, diligence prep — running against a
							maintained record of who actually invests, and stopping at every point a human should
							decide.
						</p>
					</Reveal>
				</div>
			</section>

			{/* ── Capabilities ────────────────────────────────────────────────── */}
			<section
				aria-labelledby="capabilities-heading"
				id="capabilities"
				className="scroll-mt-4 border-line border-t"
			>
				<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
					<Reveal>
						<p className="eyebrow">The agent team</p>
						<h2
							id="capabilities-heading"
							className="mt-5 max-w-3xl text-balance font-display font-bold text-[clamp(1.75rem,4vw,2.75rem)] text-ink leading-[1.05] tracking-[-0.03em]"
						>
							The agents, and where each one stops.
						</h2>
						<p className="mt-6 max-w-2xl text-ink-muted leading-[1.7]">
							Autonomy is only useful if the boundary is explicit. Each agent works unattended up to
							a defined point and then hands back — the list before it is worked, the drafts before
							they send.
						</p>
					</Reveal>

					<div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2">
						{AGENTS.map((a) => (
							<Reveal key={a.id}>
								<article className="border-line border-t pt-6">
									<p className="font-mono text-[0.6875rem] text-accent uppercase tracking-[0.16em]">
										{a.name}
									</p>
									<h3 className="mt-4 font-display font-semibold text-ink text-xl tracking-[-0.02em]">
										{a.does}
									</h3>
									<p className="mt-3 text-ink-muted leading-[1.7]">{a.body}</p>
									<p className="mt-4 text-ink-subtle text-sm leading-[1.6]">{a.autonomy}</p>
								</article>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* ── Pipeline ────────────────────────────────────────────────────── */}
			<section aria-labelledby="pipeline-heading" className="border-line border-t bg-mantle">
				<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
					<Reveal>
						<p className="eyebrow">What the agents read from</p>
						<h2
							id="pipeline-heading"
							className="mt-5 max-w-3xl text-balance font-display font-bold text-[clamp(1.75rem,4vw,2.75rem)] text-ink leading-[1.05] tracking-[-0.03em]"
						>
							An agent is only as good as what it reads from.
						</h2>
						<p className="mt-6 max-w-2xl text-ink-muted leading-[1.7]">
							The failure mode of an agent on bad data is not that it stalls — it is that it acts
							confidently on something wrong, and you find out in a partner meeting. Investor data
							decays constantly: funds close, partners move, mandates change. Four stages run
							continuously to keep ahead of it, and the last one has a person in it.
						</p>
					</Reveal>

					{/* Numbered because these genuinely are sequential: a record cannot be
					    enriched before it is resolved, or reviewed before it is enriched. */}
					<ol className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
						{PIPELINE.map((stage, i) => (
							<Reveal key={stage.id}>
								<li className="border-line border-t pt-6">
									<p className="font-mono text-[0.6875rem] text-accent uppercase tracking-[0.16em]">
										{String(i + 1).padStart(2, "0")} · {stage.step}
									</p>
									<h3 className="mt-4 font-display font-semibold text-ink text-lg tracking-[-0.02em]">
										{stage.title}
									</h3>
									<p className="mt-3 text-ink-muted leading-[1.7]">{stage.body}</p>
								</li>
							</Reveal>
						))}
					</ol>
				</div>
			</section>

			{/* ── Close ───────────────────────────────────────────────────────── */}
			<section aria-labelledby="product-cta-heading" className="border-line border-t">
				<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-24">
					<Reveal>
						<h2
							id="product-cta-heading"
							className="max-w-2xl text-balance font-display font-bold text-[clamp(1.75rem,4vw,2.5rem)] text-ink leading-[1.05] tracking-[-0.03em]"
						>
							Access opens in cohorts while the agents are tuned against live rounds.
						</h2>
						<div className="mt-8 flex flex-wrap items-center gap-4">
							<a
								href="/#waitlist"
								className="rounded-control bg-primary px-5 py-3 font-display font-medium text-primary-foreground text-sm shadow-sm transition-colors duration-200 hover:bg-primary-hover"
							>
								Join the waitlist
							</a>
							<a
								href="/company"
								className="font-display font-medium text-ink-muted text-sm transition-colors duration-200 hover:text-ink"
							>
								Who is behind it →
							</a>
						</div>
					</Reveal>
				</div>
			</section>
		</Shell>
	);
}
