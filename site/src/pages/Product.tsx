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

const CAPABILITIES = [
	{
		id: "match",
		title: "Matching, not searching",
		body: `Describe the company and the round. Firms are ranked against your thesis, stage and sector using semantic matching over each fund's own published thesis — not a keyword filter over ${formatCount(COVERAGE.firms)} rows that returns everything and ranks nothing.`,
	},
	{
		id: "reach",
		title: "The named partner, not the info@ address",
		body: `${formatCount(COVERAGE.reachablePartners)} partners across ${formatCount(COVERAGE.firmsWithPartner)} firms have a named individual with a verified email attached, so a target list arrives with a person on it rather than a contact form.`,
	},
	{
		id: "track",
		title: "One state across every inbox",
		body: `Conversations are tracked across email and LinkedIn into ${COVERAGE.dealRoomStages} canonical deal stages — ${COVERAGE.advancingStages} that move a round forward and ${COVERAGE.terminalStages} that record how it ended — so a warm thread cannot go quiet unnoticed.`,
	},
	{
		id: "prep",
		title: "Diligence prepared before it is asked for",
		body: "The requests a fund makes at your stage are predictable. Financials, cohort data and the narrative gaps a partner will probe are structured ahead of the meeting rather than assembled during it.",
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
							An investor database, and agents that work it.
						</h1>
						<p className="mt-7 max-w-2xl text-ink-muted text-lg leading-[1.7]">
							Two things, and the second depends entirely on the first. A maintained record of who
							invests, at what stage, in what, and who at the firm decides — and a set of agents
							that turn that record into a shortlist, an approach, and a tracked conversation.
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
						<p className="eyebrow">What it does</p>
						<h2
							id="capabilities-heading"
							className="mt-5 max-w-3xl text-balance font-display font-bold text-[clamp(1.75rem,4vw,2.75rem)] text-ink leading-[1.05] tracking-[-0.03em]"
						>
							Four jobs a founder otherwise does by hand.
						</h2>
					</Reveal>

					<div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2">
						{CAPABILITIES.map((c) => (
							<Reveal key={c.id}>
								<article>
									<h3 className="font-display font-semibold text-ink text-xl tracking-[-0.02em]">
										{c.title}
									</h3>
									<p className="mt-3 text-ink-muted leading-[1.7]">{c.body}</p>
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
						<p className="eyebrow">How the data is built</p>
						<h2
							id="pipeline-heading"
							className="mt-5 max-w-3xl text-balance font-display font-bold text-[clamp(1.75rem,4vw,2.75rem)] text-ink leading-[1.05] tracking-[-0.03em]"
						>
							The database is the product. It is maintained, not scraped once.
						</h2>
						<p className="mt-6 max-w-2xl text-ink-muted leading-[1.7]">
							Investor data decays — funds close, partners move, mandates change. Four stages run
							continuously, and the last one has a person in it.
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
