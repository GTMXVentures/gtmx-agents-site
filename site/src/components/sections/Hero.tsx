import type { ReactElement } from "react";
import { BorderBeam } from "@/components/BorderBeam";
import { PulseDot } from "@/components/PulseDot";
import { COVERAGE, formatCount, INVESTOR_TYPES } from "@/data/coverage";

/**
 * Hero — centred, single column.
 *
 * Centred rather than left-aligned because there is nothing beside the claim to
 * align to. A left-aligned headline in a full-width container leaves a large
 * dead right margin at desktop widths; centring turns that into symmetry and
 * lets the headline run bigger for the same measure.
 *
 * The headline is the largest thing the page will ever show — clamp tops out at
 * 6.5rem — and everything under it steps down hard. That contrast is the whole
 * impact budget, which is why the subhead, the figures and the paragraph are all
 * quieter than they would be if they had to carry the section on their own.
 *
 * Load order is staggered by animation-delay so the page assembles top-down
 * rather than appearing at once.
 *
 * Every figure comes from @/data/coverage — no number is typed twice.
 */
export function Hero(): ReactElement {
	return (
		<section
			aria-labelledby="hero-heading"
			className="relative overflow-hidden border-line border-b"
		>
			{/* Ambient only — see the motion notes in index.css. Static washes, behind
			    everything, pointer-events off so they can never intercept a click. */}
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 subtle-grid" />
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 hero-glow" />

			<div className="relative mx-auto max-w-6xl px-6 py-24 text-center sm:px-8 sm:py-32">
				{/* animation-delay is set inline, not via a utility: `animate-rise` is the
				    `animation` SHORTHAND, and a separately-emitted delay utility can sort
				    before it and get reset to 0. The reduced-motion block in index.css
				    uses !important, which beats inline styles, so this stays accessible. */}
				<p className="inline-flex animate-rise items-center gap-2 rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.6875rem] text-ink-muted">
					<PulseDot />
					Pre-launch · agent-run fundraising
				</p>

				<h1
					id="hero-heading"
					className="mx-auto mt-9 max-w-5xl animate-rise text-balance font-display font-bold text-[clamp(2.75rem,8vw,6.5rem)] text-ink leading-[0.92] tracking-[-0.04em]"
					style={{ animationDelay: "60ms" }}
				>
					Agents that run your fundraise.
				</h1>

				<p
					className="mx-auto mt-8 max-w-2xl animate-rise text-balance text-ink-muted text-xl leading-[1.45] sm:text-2xl"
					style={{ animationDelay: "120ms" }}
				>
					So you can stay on customers and revenue.
				</p>

				<div
					className="mt-11 flex animate-rise flex-col items-center justify-center gap-3 sm:flex-row"
					style={{ animationDelay: "180ms" }}
				>
					<a
						href="#waitlist"
						className="inline-flex w-full items-center justify-center rounded-control bg-primary px-8 py-4 font-display font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary-hover sm:w-auto"
					>
						Talk to us
					</a>
					<a
						href="#database"
						className="inline-flex w-full items-center justify-center rounded-control border border-line px-8 py-4 font-display font-medium text-ink transition-colors duration-200 hover:border-ink-subtle hover:bg-surface-hover sm:w-auto"
					>
						See the database
					</a>
				</div>

				{/* The figures answer "who is actually in there?" rather than "how big is
				    it?". The reach funnel is the better story in the database section,
				    where "reachable" can be defined; here it would need a footnote. */}
				<dl
					className="relative mx-auto mt-16 grid max-w-4xl animate-rise grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-4"
					style={{ animationDelay: "240ms" }}
				>
					<BorderBeam duration={14} />
					{INVESTOR_TYPES.map((stat) => (
						<div key={stat.id} className="bg-surface px-5 py-7">
							{/* The label is repeated as an sr-only <dt> so the number is never
							    announced bare — "3,473" alone is meaningless in a linear pass. */}
							<dt className="sr-only">{stat.label}</dt>
							<dd className="font-display font-bold text-[clamp(1.75rem,3.5vw,2.75rem)] text-ink tabular-nums leading-none tracking-[-0.03em]">
								{formatCount(stat.value)}
							</dd>
							<dd aria-hidden="true" className="mt-2.5 font-mono text-[0.6875rem] text-ink-subtle">
								{stat.label}
							</dd>
						</div>
					))}
				</dl>

				<p
					className="mx-auto mt-12 max-w-3xl animate-rise text-ink-muted leading-[1.75]"
					style={{ animationDelay: "300ms" }}
				>
					The agents sit on top of a maintained investor database with an intelligence layer over
					it. They build your pipeline, run the outreach, and get you meetings with the right
					investors. They keep track of every process and conversation, and act as your fundraising
					coach — so each round teaches the next one.
				</p>

				<p className="mt-8 text-ink-subtle text-sm">
					Built on a maintained database of {formatCount(COVERAGE.firms)} investor firms.
				</p>
			</div>
		</section>
	);
}
