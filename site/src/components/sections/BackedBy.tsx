import type { ReactElement } from "react";
import gtmxVenturesLogo from "@/assets/gtmx-ventures.svg";
import { Reveal } from "@/components/Reveal";
import { COVERAGE, formatCount } from "@/data/coverage";

/**
 * Backed by GTMX Ventures.
 *
 * One job: explain where a maintained database of investor firms came from
 * before the product existed. Without it the figures upstream read as a scrape.
 *
 * Kept short deliberately. This is a backer credit, not an about-us — the
 * product is the agents and the data layer, and a long institutional passage
 * here would compete with the CTA directly below it.
 *
 * The mark is vendored into src/assets rather than hotlinked from the GTMX
 * Ventures CDN: an <img> pointing at someone else's Webflow bucket breaks
 * silently when they redesign, and importing it through Vite gets a content
 * hash and long-lived caching for free. It ships white-on-transparent, which is
 * what this page needs, so it is used as-is with no filter.
 */
const FACTS = [
	{
		id: "data",
		label: "Where the data came from",
		note: `The ${formatCount(COVERAGE.firms)} firms were assembled and maintained for live mandates, not scraped for a launch.`,
	},
	{
		id: "loop",
		label: "How it stays current",
		note: "Nightly enrichment, with every new record reviewed before it reaches the live table.",
	},
	{
		id: "side",
		label: "Whose side it is on",
		note: "The agents work for the company raising, never for the fund writing the cheque.",
	},
];

export function BackedBy(): ReactElement {
	return (
		<section
			aria-labelledby="backed-by-heading"
			id="backed-by"
			className="scroll-mt-4 border-line border-t bg-mantle"
		>
			<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
				<Reveal className="mx-auto max-w-2xl text-center">
					<p className="eyebrow">Backed by</p>

					{/* The wordmark carries the name, so the heading does not repeat it —
					    an <h2> reading "GTMX Ventures" above a logo saying the same thing
					    is the sort of duplication a screen reader pass makes obvious. */}
					<img
						alt="GTMX Ventures"
						className="mx-auto mt-6 h-8 w-auto"
						height={34}
						src={gtmxVenturesLogo}
						width={148}
					/>

					<h2
						id="backed-by-heading"
						className="mt-8 text-balance font-display font-bold text-[clamp(1.75rem,3.5vw,2.5rem)] text-ink leading-[1.05] tracking-[-0.03em]"
					>
						The data layer came first.
					</h2>
					<p className="mt-5 text-ink-muted leading-[1.7]">
						GTMX Ventures spent years building and maintaining the investor database the agents run
						on. That is why the numbers on this page are counts rather than estimates.
					</p>
				</Reveal>

				<Reveal delay={80}>
					<ul className="mt-14 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
						{FACTS.map((fact) => (
							<li key={fact.id} className="bg-surface p-7">
								<p className="eyebrow">{fact.label}</p>
								<p className="mt-3 text-ink-muted text-sm leading-[1.6]">{fact.note}</p>
							</li>
						))}
					</ul>
				</Reveal>
			</div>
		</section>
	);
}
