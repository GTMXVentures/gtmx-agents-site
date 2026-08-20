import { type ReactElement, useState } from "react";
import { MouseSpotlight } from "@/components/MouseSpotlight";
import { Reveal } from "@/components/Reveal";
import {
	COVERAGE,
	formatCount,
	SECTORS,
	STAGES,
	type StageId,
	sectorsForStage,
} from "@/data/coverage";

/**
 * Database — the credibility section, as a coverage check.
 *
 * Everything above this point is a claim about what agents will do. This is the
 * only checkable section, so rather than asserting a total it hands the visitor
 * the query: pick your sector, pick your stage, see what is actually there.
 *
 * It replaced a static sector table. The table showed more at once, but it
 * answered "how does my sector compare to the others?", which is not the
 * question — a founder wants a yes or no about their own row, and a number they
 * can act on. Two figures and a share bar say that in one glance.
 *
 * The reachable segment is drawn inside the in-scope bar, not beside it,
 * because reachable firms are a subset — two adjacent bars would imply two
 * independent quantities. Widths come from the data at render time; hard-coded
 * percentages would drift the moment a count in @/data/coverage is refreshed.
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
		note: `${formatCount(COVERAGE.firmsWithPartner)} firms have at least one attached.`,
	},
	{
		id: "reachable",
		value: formatCount(COVERAGE.reachablePartners),
		label: "Verified emails",
		note: "Partners the Outreach Agent can reach directly today.",
	},
];

export function Database(): ReactElement {
	const [sectorId, setSectorId] = useState(SECTORS[0].id);
	const [stage, setStage] = useState<StageId>("series-a");

	const row = sectorsForStage(stage).find((sector) => sector.id === sectorId) ?? SECTORS[0];
	const share = Math.round((row.reachable / row.firms) * 100);
	const stageName = STAGES.find((option) => option.id === stage)?.name ?? "";

	return (
		<section
			aria-labelledby="database-heading"
			id="database"
			className="scroll-mt-4 border-line border-t bg-mantle"
		>
			<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
				<Reveal className="mx-auto max-w-2xl text-center">
					<p className="eyebrow">The data layer</p>
					<h2
						id="database-heading"
						className="mt-5 text-balance font-display font-bold text-[clamp(2rem,4.5vw,3.25rem)] text-ink leading-[1] tracking-[-0.03em]"
					>
						Check the database before you pitch.
					</h2>
					<p className="mt-5 text-ink-muted leading-[1.7]">
						An agent is only as good as what it can see. Pick a sector and a stage to query the same
						index the Matching Agent runs against — these are live counts, not a sample.
					</p>
				</Reveal>

				<Reveal delay={80}>
					<ul className="mt-14 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
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
				</Reveal>

				<Reveal delay={140}>
					<div className="relative mt-4 overflow-hidden rounded-card border border-line bg-surface">
						<MouseSpotlight size={600} opacity={0.14} />

						{/* Two stacked full-width rows rather than side-by-side columns.
						    Side by side, the sector chips wrapped to two lines while the
						    three stage chips filled one, so the panel had a large empty
						    quadrant. Stacking makes both rows the same shape and puts the
						    two choices in the order they are made.

						    <fieldset>/<legend> rather than a div with role="group": same
						    semantics, and the legend names the group with no id to keep in
						    sync. The legend is positioned as a label column at sm and above
						    so the chips align across both rows. */}
						<fieldset className="border-line border-b px-6 py-5 sm:flex sm:items-baseline sm:gap-6 sm:px-8">
							<legend className="eyebrow sm:hidden">Sector</legend>
							<p aria-hidden="true" className="eyebrow hidden w-24 shrink-0 sm:block">
								Sector
							</p>
							<div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
								{SECTORS.map((sector) => {
									const selected = sector.id === sectorId;
									return (
										<button
											aria-pressed={selected}
											className={`rounded-control border px-3.5 py-2 font-display text-sm transition-colors duration-200 ${
												selected
													? "border-accent-line bg-accent-soft text-accent"
													: "border-line text-ink-muted hover:bg-surface-hover hover:text-ink"
											}`}
											key={sector.id}
											onClick={() => setSectorId(sector.id)}
											type="button"
										>
											{sector.name}
										</button>
									);
								})}
							</div>
						</fieldset>

						<fieldset className="border-line border-b px-6 py-5 sm:flex sm:items-baseline sm:gap-6 sm:px-8">
							<legend className="eyebrow sm:hidden">Stage</legend>
							<p aria-hidden="true" className="eyebrow hidden w-24 shrink-0 sm:block">
								Stage
							</p>
							<div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
								{STAGES.filter((option) => option.id !== "all").map((option) => {
									const selected = option.id === stage;
									return (
										<button
											aria-pressed={selected}
											className={`rounded-control border px-3.5 py-2 font-display text-sm transition-colors duration-200 ${
												selected
													? "border-line bg-primary text-primary-foreground"
													: "border-line text-ink-muted hover:bg-surface-hover hover:text-ink"
											}`}
											key={option.id}
											onClick={() => setStage(option.id)}
											type="button"
										>
											{option.name}
										</button>
									);
								})}
							</div>
						</fieldset>

						<div className="px-6 py-8 sm:px-8 sm:py-10">
							<div className="grid gap-6 sm:grid-cols-2">
								<div>
									<p className="eyebrow">Firms in scope</p>
									<p className="mt-3 font-display font-bold text-[clamp(2.5rem,6vw,4rem)] text-ink tabular-nums leading-none tracking-[-0.035em]">
										{formatCount(row.firms)}
									</p>
									<p className="mt-3 text-ink-muted text-sm leading-[1.6]">
										invest in {row.name} at {stageName}
									</p>
								</div>
								<div>
									<p className="eyebrow">Reachable today</p>
									<p className="mt-3 font-display font-bold text-[clamp(2.5rem,6vw,4rem)] text-accent tabular-nums leading-none tracking-[-0.035em]">
										{formatCount(row.reachable)}
									</p>
									<p className="mt-3 text-ink-muted text-sm leading-[1.6]">
										have a named partner with a verified email
									</p>
								</div>
							</div>

							<div className="mt-9">
								{/* Presentational: the same proportion is printed in words below. */}
								<span
									aria-hidden="true"
									className="flex h-1.5 w-full overflow-hidden rounded-full bg-base"
								>
									<span
										className="h-full rounded-full bg-accent transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
										style={{ width: `${share}%` }}
									/>
								</span>
								<p className="mt-4 text-ink-subtle text-sm leading-[1.6]">
									<span className="text-ink tabular-nums">{share}%</span> reachable. The rest are on
									file without a partner contact yet — nightly enrichment keeps working on them.
								</p>
							</div>
						</div>
					</div>
				</Reveal>

				<Reveal delay={200}>
					<p className="mt-6 text-center text-ink-subtle text-sm">
						Reachable = a named partner with a verified email. Firms appear in every sector and
						stage they invest in, so these counts overlap and their total exceeds{" "}
						{formatCount(COVERAGE.firms)}.
					</p>
				</Reveal>
			</div>
		</section>
	);
}
