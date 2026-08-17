import type { ReactElement } from "react";

/**
 * Hero — the thesis of the page.
 *
 * The signature element is the LEDGER below the headline: a raise is worked as a
 * list, so the page opens with the artifact a raise actually produces (stage →
 * count → what happened) rather than a product screenshot. It is set as a bare
 * typeset ledger — hairlines, monospace, tabular figures, no card — so it reads
 * as an appendix in a deal document, which is the vernacular this audience lives
 * in. The 01–04 numbering is not decoration: it is the same four-stage sequence
 * the Agents section expands, and a raise genuinely runs in that order.
 *
 * The <h1> carries the brand as a visible eyebrow line, so its accessible name
 * contains "GTMX Agents" — matching index.html's <noscript> H1 and the smoke
 * test in src/__tests__/App.test.tsx. Do not split the subline paragraph with
 * child elements: that test matches its DIRECT text nodes.
 */

/**
 * Illustrative, and labelled as such in the UI. The product is pre-launch — these
 * are not real portfolio relationships, and the copy must never imply they are.
 */
const LEDGER_ROWS = [
	{
		id: "match",
		stage: "01",
		label: "Match",
		value: "38 / 214",
		detail: "funds on thesis, ranked with the reason attached",
	},
	{
		id: "reach",
		stage: "02",
		label: "Reach",
		value: "38",
		detail: "approaches drafted · 12 warm paths found",
	},
	{
		id: "track",
		stage: "03",
		label: "Track",
		value: "61",
		detail: "live threads across email, LinkedIn and meetings",
	},
	{
		id: "prep",
		stage: "04",
		label: "Prep",
		value: "22",
		detail: "diligence questions answered from your own numbers",
	},
];

export function Hero(): ReactElement {
	return (
		<section aria-labelledby="hero-heading">
			<div className="mx-auto max-w-6xl px-6 pt-16 pb-14 sm:px-8 sm:pt-24 sm:pb-20">
				{/* animation-delay is set inline, not via a utility: `animate-rise` is the
				    `animation` SHORTHAND, and a separately-emitted delay utility can sort
				    before it and get reset to 0. The reduced-motion block in index.css
				    uses !important, which beats inline styles, so this stays accessible. */}
				<h1 id="hero-heading" className="max-w-4xl animate-rise">
					<span className="eyebrow block">GTMX Agents — by GTMX Ventures</span>
					<span className="mt-5 block text-balance font-display font-medium text-[clamp(2.5rem,7vw,5.25rem)] text-ink-display leading-[0.98] tracking-[-0.02em] sm:mt-7">
						Most of a raise is logistics.{" "}
						<span className="text-ink-muted italic">The rest is you.</span>
					</span>
				</h1>

				<p
					className="mt-8 max-w-2xl animate-rise text-pretty text-ink-muted text-lg leading-[1.65] sm:text-xl"
					style={{ animationDelay: "120ms" }}
				>
					GTMX Agents runs the mechanical half of your round — investor matching, outreach, and
					diligence — end to end, so the only thing left on your calendar is the conversation.
				</p>

				<div
					className="mt-10 flex animate-rise flex-wrap items-center gap-x-6 gap-y-4"
					style={{ animationDelay: "220ms" }}
				>
					<a
						href="#waitlist"
						className="inline-flex items-center justify-center rounded-control bg-accent px-6 py-3 font-medium text-accent-ink text-sm transition-colors duration-200 hover:bg-accent-hover"
					>
						Join the waitlist
					</a>
					<p className="eyebrow">Pre-launch · first cohort forming</p>
				</div>
			</div>

			{/* --- The ledger ---------------------------------------------------- */}
			<div
				className="animate-rise border-line/70 border-y bg-mantle"
				style={{ animationDelay: "340ms" }}
			>
				<div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 sm:py-10">
					<div className="flex items-baseline justify-between gap-x-4 border-line/70 border-b pb-4">
						<h2 className="eyebrow">Agent run — Series A, week three</h2>
						<p className="eyebrow text-ink-subtle/80">Illustrative</p>
					</div>
					<ul className="divide-y divide-line/70">
						{LEDGER_ROWS.map((row) => (
							<li
								key={row.id}
								className="grid grid-cols-[2.25rem_1fr] items-baseline gap-x-4 gap-y-1 py-4 sm:grid-cols-[2.75rem_6rem_6.5rem_1fr] sm:gap-y-0"
							>
								<span className="font-mono text-ink-subtle text-xs tabular-nums">{row.stage}</span>
								<span className="font-medium text-ink">{row.label}</span>
								{/* col-start-2 on mobile keeps the value under the label, not under
								    the stage number, so the two-column stack still reads as a row. */}
								<span className="col-start-2 font-mono text-accent text-sm tabular-nums sm:col-start-auto">
									{row.value}
								</span>
								<span className="col-start-2 text-ink-muted text-sm sm:col-start-auto">
									{row.detail}
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
