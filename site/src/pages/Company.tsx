import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import { Shell } from "@/components/Shell";
import { COMPANY } from "@/data/company";

/**
 * /company — who is behind the product.
 *
 * Content policy: everything on this page is either verifiable today or comes
 * from @/data/company. Nothing is invented to fill space. Where a fact is not
 * yet available (team roster, founding year, legal entity) the corresponding
 * block does not render at all — an omitted section reads as a site still being
 * built out; a fabricated one is a much more expensive problem, particularly on
 * a page used to establish that the company is real.
 */

const PRINCIPLES = [
	{
		id: "agentic",
		title: "Agents that act, not a chatbot that answers",
		body: "The bar is whether an agent finishes the job unattended and hands back something usable.",
	},
	{
		id: "approval",
		title: "Autonomy with an explicit boundary",
		body: "Every agent has a defined point where it stops. Nothing reaches an investor without founder approval.",
	},
	{
		id: "grounding",
		title: "Grounded in a maintained record",
		body: "Agents fail expensively on stale inputs, so the investor database is treated as the product.",
	},
	{
		id: "side",
		title: "The agents work for the company raising",
		body: "Not for the funds. Founder data is never sold, brokered, or shown to investors.",
	},
	{
		id: "data",
		title: "Counted, not estimated",
		body: "Every figure on this site is a live count. What cannot be counted honestly is not shown.",
	},
];

export default function Company(): ReactElement {
	const { legalName, foundedYear, team } = COMPANY;

	return (
		<Shell current="/company" skipTo={{ href: "#principles", label: "Skip to how we work" }}>
			{/* ── Intro ───────────────────────────────────────────────────────── */}
			<section aria-labelledby="company-heading">
				<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
					<Reveal>
						<p className="eyebrow">The company</p>
						<h1
							id="company-heading"
							className="mt-5 max-w-4xl text-balance font-display font-bold text-[clamp(2.25rem,5.5vw,3.75rem)] text-ink leading-[1] tracking-[-0.03em]"
						>
							We are building the agents we needed ourselves.
						</h1>
						<p className="mt-7 max-w-xl text-ink-muted text-lg leading-[1.7]">
							GTMX Agents was incubated within GTMX Ventures, which runs fundraising for its own
							portfolio. The product is that work — investor research, outreach, threads going cold
							— handed to agents.
						</p>
						{(legalName || foundedYear) && (
							<dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4">
								{legalName && (
									<div>
										<dt className="font-mono text-[0.6875rem] text-ink-subtle uppercase tracking-[0.16em]">
											Registered entity
										</dt>
										<dd className="mt-2 text-ink">{legalName}</dd>
									</div>
								)}
								{foundedYear && (
									<div>
										<dt className="font-mono text-[0.6875rem] text-ink-subtle uppercase tracking-[0.16em]">
											Operating since
										</dt>
										<dd className="mt-2 text-ink">{foundedYear}</dd>
									</div>
								)}
							</dl>
						)}
					</Reveal>
				</div>
			</section>

			{/* ── Principles ──────────────────────────────────────────────────── */}
			<section
				aria-labelledby="principles-heading"
				id="principles"
				className="scroll-mt-4 border-line border-t bg-mantle"
			>
				<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
					<Reveal>
						<p className="eyebrow">How we work</p>
						<h2
							id="principles-heading"
							className="mt-5 max-w-3xl text-balance font-display font-bold text-[clamp(1.75rem,4vw,2.75rem)] text-ink leading-[1.05] tracking-[-0.03em]"
						>
							Five commitments that shape the product.
						</h2>
						<p className="mt-6 max-w-xl text-ink-muted leading-[1.7]">
							Mostly about restraint: the interesting question with agents is where they stop.
						</p>
					</Reveal>

					<div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
						{PRINCIPLES.map((p) => (
							<Reveal key={p.id}>
								<article className="border-line border-t pt-6">
									<h3 className="font-display font-semibold text-ink text-lg tracking-[-0.02em]">
										{p.title}
									</h3>
									<p className="mt-3 text-ink-muted leading-[1.7]">{p.body}</p>
								</article>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* ── Team ────────────────────────────────────────────────────────────
			    Renders only when there is a roster to render. An empty grid with a
			    "team coming soon" caption is worse than no section: it advertises
			    the exact gap a reader is checking for. */}
			{team.length > 0 && (
				<section aria-labelledby="team-heading" className="border-line border-t">
					<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
						<Reveal>
							<p className="eyebrow">The team</p>
							<h2
								id="team-heading"
								className="mt-5 font-display font-bold text-[clamp(1.75rem,4vw,2.75rem)] text-ink leading-[1.05] tracking-[-0.03em]"
							>
								Who builds it.
							</h2>
						</Reveal>
						<div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
							{team.map((member) => (
								<Reveal key={member.name}>
									<article className="border-line border-t pt-6">
										<h3 className="font-display font-semibold text-ink text-lg tracking-[-0.02em]">
											{member.name}
										</h3>
										<p className="mt-2 font-mono text-[0.6875rem] text-accent uppercase tracking-[0.16em]">
											{member.role}
										</p>
										{member.linkedin && (
											<a
												href={member.linkedin}
												rel="noreferrer noopener"
												target="_blank"
												className="mt-3 inline-block font-display font-medium text-ink-muted text-sm transition-colors duration-200 hover:text-ink"
											>
												LinkedIn →
											</a>
										)}
									</article>
								</Reveal>
							))}
						</div>
					</div>
				</section>
			)}

			{/* ── Close ───────────────────────────────────────────────────────── */}
			<section aria-labelledby="company-cta-heading" className="border-line border-t">
				<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-24">
					<Reveal>
						<h2
							id="company-cta-heading"
							className="max-w-2xl text-balance font-display font-bold text-[clamp(1.75rem,4vw,2.5rem)] text-ink leading-[1.05] tracking-[-0.03em]"
						>
							Questions about the product or the data?
						</h2>
						<div className="mt-8 flex flex-wrap items-center gap-4">
							<a
								href="/contact"
								className="rounded-control bg-primary px-5 py-3 font-display font-medium text-primary-foreground text-sm shadow-sm transition-colors duration-200 hover:bg-primary-hover"
							>
								Get in touch
							</a>
							<a
								href="/product"
								className="font-display font-medium text-ink-muted text-sm transition-colors duration-200 hover:text-ink"
							>
								How the product works →
							</a>
						</div>
					</Reveal>
				</div>
			</section>
		</Shell>
	);
}
