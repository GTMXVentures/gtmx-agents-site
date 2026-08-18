import type { ReactElement } from "react";
import { COVERAGE, formatCount, LARGEST_SECTOR_FIRMS, SECTORS } from "@/data/coverage";

/**
 * Database — the credibility section.
 *
 * Everything above this point is a claim about what agents will do. This is the
 * only section that is checkable, so it is deliberately the densest thing on the
 * page: real counts, a sector-by-sector breakdown, and a definition of the one
 * term ("reachable") that a founder would otherwise have to take on trust.
 *
 * Two decisions worth keeping:
 *
 *  - The sector table is ordered by firm count, descending, and the bars are
 *    scaled to the LARGEST sector rather than each row's own total. A founder
 *    scanning this is asking "is my sector thin?", and a per-row-normalised bar
 *    would render every sector the same width and answer the wrong question.
 *  - The reachable segment is drawn inside the firms bar, not beside it, because
 *    reachable partners are a subset of the firms — two adjacent bars would
 *    imply two independent quantities.
 *
 * The bar widths are computed from the data at render time. Hard-coded
 * percentages would silently drift the moment a count in @/data/coverage is
 * refreshed, and a chart that disagrees with the number printed next to it is
 * worse than no chart.
 */

const HEADLINE_STATS = [
	{
		id: "firms",
		value: formatCount(COVERAGE.firms),
		label: "Investor firms",
		note: "Institutional VCs, growth funds and family offices.",
	},
	{
		id: "partners",
		value: formatCount(COVERAGE.partners),
		label: "Named partners",
		note: `${formatCount(COVERAGE.firmsWithPartner)} firms have at least one partner attached.`,
	},
	{
		id: "reachable",
		value: formatCount(COVERAGE.reachablePartners),
		label: "Verified emails",
		note: "Partners the Outreach Agent can reach directly today.",
	},
	{
		id: "stages",
		value: String(COVERAGE.dealRoomStages),
		label: "Deal-room stages",
		note: "One standard funnel, first outreach through signature.",
	},
];

export function Database(): ReactElement {
	return (
		<section
			aria-labelledby="database-heading"
			id="database"
			className="scroll-mt-4 border-line border-t bg-mantle"
		>
			<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
				<div className="max-w-2xl">
					<p className="eyebrow">The data layer</p>
					<h2
						id="database-heading"
						className="mt-5 text-balance font-display font-bold text-[clamp(2rem,4.5vw,3.25rem)] text-ink leading-[1] tracking-[-0.03em]"
					>
						The database behind the agents.
					</h2>
					<p className="mt-5 text-ink-muted leading-[1.7]">
						An agent is only as good as what it can see. The Matching Agent does not search the web
						for investors — it works a maintained database of firms, partners and verified contact
						routes that live fundraises already run against.
					</p>
				</div>

				{/* A <ul>, not a <dl>. The design needs the figure ABOVE its label, and a
				    <dl> requires each <dt> to precede its <dd> — satisfying both would
				    mean either invalid markup or a visual-order hack for no semantic
				    gain. Read linearly this is "7,033 / Investor firms / Institutional
				    VCs…", which is the right order for a screen reader anyway. */}
				<ul className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
					{HEADLINE_STATS.map((stat) => (
						<li key={stat.id} className="bg-surface p-6 sm:p-7">
							<p className="font-display font-bold text-[clamp(1.75rem,3vw,2.5rem)] text-ink tabular-nums leading-none tracking-[-0.03em]">
								{stat.value}
							</p>
							<p className="mt-3 font-mono text-[0.6875rem] text-ink uppercase tracking-[0.16em]">
								{stat.label}
							</p>
							<p className="mt-2 text-ink-subtle text-xs leading-[1.6]">{stat.note}</p>
						</li>
					))}
				</ul>

				{/* --- Sector coverage --------------------------------------------- */}
				<div className="mt-4 overflow-hidden rounded-card border border-line bg-surface">
					<div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-line border-b px-6 py-5 sm:px-8">
						<h3 className="eyebrow">Sector coverage</h3>
						<p className="eyebrow">Firms · reachable partners</p>
					</div>

					<ul className="divide-y divide-line">
						{SECTORS.map((sector) => {
							// Both bars share one scale — the largest sector's firm count —
							// so widths are comparable across rows AND the reachable segment
							// reads as a proportion of the firms it sits inside.
							const firmsWidth = (sector.firms / LARGEST_SECTOR_FIRMS) * 100;
							const reachableWidth = (sector.reachable / LARGEST_SECTOR_FIRMS) * 100;

							return (
								<li
									key={sector.id}
									className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 px-6 py-4 transition-colors duration-200 hover:bg-surface-hover sm:grid-cols-[10rem_1fr_auto] sm:px-8"
								>
									<span className="font-display font-medium text-ink text-sm">{sector.name}</span>

									{/* Presentational: the same two numbers are printed in words
									    to the right, so the bar adds nothing for a screen reader
									    and would only be announced as an unlabelled element. */}
									<span
										aria-hidden="true"
										className="col-span-2 order-last h-1.5 w-full overflow-hidden rounded-full bg-base sm:order-none sm:col-span-1"
									>
										{/* ink-subtle at 40% rather than the hairline token: --color-line
										    is tuned to be nearly invisible as a 1px border, which makes it
										    unreadable as a 6px data bar on a black track. */}
										<span
											className="flex h-full rounded-full bg-ink-subtle/40"
											style={{ width: `${firmsWidth}%` }}
										>
											<span
												className="h-full rounded-full bg-accent"
												style={{ width: `${(reachableWidth / firmsWidth) * 100}%` }}
											/>
										</span>
									</span>

									<span className="text-right font-mono text-[0.6875rem] tabular-nums sm:text-xs">
										<span className="text-ink">{formatCount(sector.firms)}</span>
										<span className="text-ink-subtle"> firms · </span>
										<span className="text-accent">{formatCount(sector.reachable)}</span>
										<span className="text-ink-subtle"> reachable</span>
									</span>
								</li>
							);
						})}
					</ul>

					<p className="border-line border-t px-6 py-4 text-ink-subtle text-xs sm:px-8">
						Reachable = a named partner with a verified email. Firms appear in every sector they
						invest in, so sector totals exceed {formatCount(COVERAGE.firms)}.
					</p>
				</div>

				{/* --- The deal room ------------------------------------------------ */}
				<div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
					<div className="rounded-card border border-line bg-surface p-7 sm:p-10">
						<h3 className="text-balance font-display font-bold text-[clamp(1.5rem,3vw,2.25rem)] text-ink leading-[1.05] tracking-[-0.025em]">
							Thirteen stages. Nine move forward. Four record how it ended.
						</h3>
						<p className="mt-5 max-w-xl text-ink-muted leading-[1.7]">
							Every fund on your raise sits in exactly one stage, and the Tracking Agent is what
							keeps it there honestly. Nine stages carry a conversation toward a signature. The
							other four are the ones founders never write down — passed, stalled, no reply,
							withdrawn — which is why nobody can answer "what actually happened to those two
							hundred funds?" six months later.
						</p>
					</div>

					<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
						{[
							{
								id: "advancing",
								value: COVERAGE.advancingStages,
								label: "Advancing stages",
								note: "Matched through to signature.",
							},
							{
								id: "terminal",
								value: COVERAGE.terminalStages,
								label: "Terminal stages",
								note: "How and why a conversation closed.",
							},
						].map((item) => (
							<li key={item.id} className="rounded-card border border-line bg-surface p-6 sm:p-7">
								<p className="font-display font-bold text-4xl text-ink tabular-nums leading-none tracking-[-0.03em]">
									{item.value}
								</p>
								<p className="mt-3 font-mono text-[0.6875rem] text-ink uppercase tracking-[0.16em]">
									{item.label}
								</p>
								<p className="mt-2 text-ink-subtle text-xs leading-[1.6]">{item.note}</p>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
