import type { ReactElement } from "react";
import { BorderBeam } from "@/components/BorderBeam";
import { COVERAGE, formatCount, INVESTOR_TYPES } from "@/data/coverage";

/**
 * Hero — single column, full width.
 *
 * The structure is dictated by the content wireframe: headline, subhead, a
 * full-width row of investor-type figures, the paragraph explaining what the
 * agents do, then one action. Nothing sits beside the claim.
 *
 * An earlier version put a live agent roster in a second column here. It was
 * removed rather than shrunk: the Agents section below already explains the
 * four agents in more depth, so the roster was a duplicate that cost the
 * headline half the page. A hero with one column can afford a much larger
 * headline, which is the trade this makes.
 *
 * Every figure comes from @/data/coverage — no number on this page is typed
 * twice.
 */

/**
 * The stat row answers "who is actually in there?" rather than "how big is it?".
 *
 * The reach funnel — firms, named partners, reachable today — is the better
 * story in the database section, where "reachable" can be defined. Here it
 * needed a footnote to mean anything. Composition needs none: a founder raising
 * on angel or family-office cheques can see in one glance whether this database
 * holds anything for them.
 */
const HERO_STATS = INVESTOR_TYPES;

export function Hero(): ReactElement {
	return (
		<section
			aria-labelledby="hero-heading"
			className="relative overflow-hidden border-line border-b"
		>
			{/* Ambient only — see the motion notes in index.css. Both layers are
			    static washes rather than animations, and sit behind everything with
			    pointer-events off so they can never intercept a click. */}
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 subtle-grid" />
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 hero-glow" />

			<div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
				{/* animation-delay is set inline, not via a utility: `animate-rise` is the
				    `animation` SHORTHAND, and a separately-emitted delay utility can sort
				    before it and get reset to 0. The reduced-motion block in index.css
				    uses !important, which beats inline styles, so this stays accessible. */}
				<h1
					id="hero-heading"
					className="animate-rise max-w-4xl text-balance font-display font-bold text-[clamp(2.75rem,7.5vw,5.5rem)] text-ink leading-[0.95] tracking-[-0.035em]"
				>
					Agents that run your fundraise.
				</h1>

				<p
					className="mt-7 max-w-2xl animate-rise text-balance text-ink-muted text-xl leading-[1.45] sm:text-2xl"
					style={{ animationDelay: "80ms" }}
				>
					So you can stay on customers and revenue.
				</p>

				{/* The figures span the full measure rather than sitting in a column, so
				    they read as one row of four rather than as a sidebar stat block.
				    gap-px over a bg-line parent draws the dividers — one hairline between
				    cells, none on the outer edges. */}
				<dl
					className="relative mt-14 grid animate-rise grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-4"
					style={{ animationDelay: "160ms" }}
				>
					<BorderBeam duration={14} />
					{HERO_STATS.map((stat) => (
						<div key={stat.id} className="bg-surface px-6 py-7 sm:px-7 sm:py-8">
							{/* The label is repeated as an sr-only <dt> so the number is never
							    announced bare — "3,473" alone is meaningless in a screen
							    reader's linear pass. */}
							<dt className="sr-only">{stat.label}</dt>
							<dd className="font-display font-bold text-[clamp(2rem,4vw,3rem)] text-ink tabular-nums leading-none tracking-[-0.03em]">
								{formatCount(stat.value)}
							</dd>
							<dd aria-hidden="true" className="mt-3 font-mono text-[0.6875rem] text-ink-subtle">
								{stat.label}
							</dd>
						</div>
					))}
				</dl>

				<p
					className="mt-14 max-w-4xl animate-rise text-ink-muted text-lg leading-[1.7]"
					style={{ animationDelay: "240ms" }}
				>
					The agents sit on top of a maintained investor database with an intelligence layer over
					it. They build your pipeline, run the outreach, and get you meetings with the right
					investors. They keep track of every process and conversation, and act as your fundraising
					coach — so each round teaches the next one.
				</p>

				<div
					className="mt-12 flex animate-rise flex-col gap-3 sm:flex-row"
					style={{ animationDelay: "320ms" }}
				>
					<a
						href="#waitlist"
						className="inline-flex items-center justify-center rounded-control bg-primary px-7 py-3.5 font-display font-medium text-primary-foreground text-sm transition-colors duration-200 hover:bg-primary-hover"
					>
						Talk to us
					</a>
					<a
						href="#database"
						className="inline-flex items-center justify-center rounded-control border border-line px-7 py-3.5 font-display font-medium text-ink text-sm transition-colors duration-200 hover:border-ink-subtle hover:bg-surface-hover"
					>
						See the database
					</a>
				</div>

				<p className="mt-6 text-ink-subtle text-sm">
					Pre-launch. Built on a maintained database of {formatCount(COVERAGE.firms)} investor
					firms.
				</p>
			</div>
		</section>
	);
}
