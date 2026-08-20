import type { ReactElement } from "react";
import gtmxVenturesLogo from "@/assets/gtmx-ventures.svg";
import { MouseSpotlight } from "@/components/MouseSpotlight";
import { Reveal } from "@/components/Reveal";

/**
 * Backed by GTMX Ventures with interactive spotlight cards.
 */
const FACTS = [
	{
		id: "incubation",
		label: "Venture Studio Lineage",
		note: "Incubated within GTMX Ventures to replace fragmented spreadsheets with autonomous founder-led deal infrastructure.",
	},
	{
		id: "network",
		label: "Tier-1 Syndication",
		note: "Continuous access to active allocation mandates and warm partner routing across US & Indian venture ecosystems.",
	},
	{
		id: "alignment",
		label: "100% Founder-First",
		note: "The agents work exclusively for the company raising, orchestrating conviction without selling founder data to funds.",
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

					<img
						alt="GTMX Ventures"
						className="mx-auto mt-6 h-8 w-auto brightness-110"
						height={34}
						src={gtmxVenturesLogo}
						width={148}
					/>

					<h2
						id="backed-by-heading"
						className="mt-8 text-balance font-display font-bold text-[clamp(1.75rem,3.5vw,2.5rem)] text-ink leading-[1.05] tracking-[-0.03em]"
					>
						The intelligence layer came first.
					</h2>
					<p className="mt-5 text-ink-muted leading-[1.7]">
						GTMX Ventures spent years building and curating the deep investor intelligence index the
						agents run on. That is why every partner recommendation carries verified thesis
						alignment.
					</p>
				</Reveal>

				<Reveal delay={80}>
					<ul className="mt-14 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
						{FACTS.map((fact) => (
							<li
								key={fact.id}
								className="group relative overflow-hidden bg-surface p-7 transition-colors hover:bg-surface-hover"
							>
								<MouseSpotlight size={360} opacity={0.16} />
								<div className="relative z-10">
									<p className="font-mono text-[0.6875rem] text-accent uppercase tracking-[0.14em]">
										{fact.label}
									</p>
									<p className="mt-3 text-ink-muted text-sm leading-[1.6]">{fact.note}</p>
								</div>
							</li>
						))}
					</ul>
				</Reveal>
			</div>
		</section>
	);
}
