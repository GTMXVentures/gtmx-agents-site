import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import { COVERAGE, formatCount } from "@/data/coverage";

/**
 * Backed by GTMX Ventures.
 *
 * This is the page's only real credential, and it does a specific job: it
 * explains where a maintained database of {COVERAGE.firms} investor firms came
 * from before the product existed. Without it, the numbers further up read as a
 * scrape. With it, they read as the by-product of an advisory practice that
 * runs rounds — which is what they are.
 *
 * Kept to three facts and a link. A longer "about us" here would compete with
 * the CTA immediately below it.
 */
const CREDENTIALS = [
	{
		id: "practice",
		label: "Advisory practice",
		note: "The agents run on the same database GTMX Ventures uses on live mandates.",
	},
	{
		id: "database",
		label: "Maintained, not scraped",
		note: `Every one of the ${formatCount(COVERAGE.firms)} firms is promoted by a person before it goes live.`,
	},
	{
		id: "side",
		label: "Founder-side",
		note: "GTMX Agents works for the company raising, never for the fund writing the cheque.",
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
				<Reveal className="max-w-2xl">
					<p className="eyebrow">Backed by</p>
					<h2
						id="backed-by-heading"
						className="mt-5 text-balance font-display font-bold text-[clamp(2rem,4.5vw,3.25rem)] text-ink leading-[1] tracking-[-0.03em]"
					>
						Built inside GTMX Ventures.
					</h2>
					<p className="mt-5 text-ink-muted leading-[1.7]">
						GTMX Agents comes out of an advisory practice that runs fundraises. The database was
						built to do that work, and the agents automate the parts of it that were always the
						same.
					</p>
				</Reveal>

				<ul className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
					{CREDENTIALS.map((item) => (
						<li key={item.id} className="bg-surface p-7">
							<p className="font-display font-medium text-ink text-sm">{item.label}</p>
							<p className="mt-2.5 text-ink-subtle text-sm leading-[1.6]">{item.note}</p>
						</li>
					))}
				</ul>

				<p className="mt-8">
					<a
						className="font-display font-medium text-ink text-sm underline decoration-line underline-offset-4 transition-colors duration-200 hover:text-accent hover:decoration-accent"
						href="https://gtmxventures.com"
						rel="noreferrer"
						target="_blank"
					>
						More about GTMX Ventures
					</a>
				</p>
			</div>
		</section>
	);
}
