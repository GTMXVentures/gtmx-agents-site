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
 * Load order is staggered by animation-delay so the page assembles top-down
 * rather than appearing at once.
 */
export function Hero(): ReactElement {
	return (
		<section
			aria-labelledby="hero-heading"
			className="relative flex min-h-[calc(100svh-4.0625rem)] items-center overflow-hidden border-line border-b"
		>
			{/* Ambient washes */}
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 subtle-grid" />
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 hero-glow" />

			<div className="relative mx-auto w-full max-w-6xl px-6 py-12 text-center sm:px-8 sm:py-16">
				<p className="inline-flex animate-rise items-center gap-2 rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.6875rem] text-ink-muted">
					<PulseDot />
					Autonomous Deal Infrastructure · For Founders
				</p>

				<h1
					id="hero-heading"
					className="mx-auto mt-7 max-w-5xl animate-rise text-balance font-display font-bold text-[clamp(2.5rem,7vw,5.75rem)] text-ink leading-[0.92] tracking-[-0.04em]"
					style={{ animationDelay: "60ms" }}
				>
					Agents that run your fundraise.
				</h1>

				<p
					className="mx-auto mt-6 max-w-2xl animate-rise text-balance text-ink-muted text-xl leading-[1.45] sm:text-2xl"
					style={{ animationDelay: "120ms" }}
				>
					So you can stay on customers, product, and revenue.
				</p>

				<div
					className="mt-9 flex animate-rise flex-col items-center justify-center gap-3 sm:flex-row"
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
						Explore live database
					</a>
				</div>

				{/* Breakdown Figures */}
				<dl
					className="relative mx-auto mt-12 grid max-w-4xl animate-rise grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-4"
					style={{ animationDelay: "240ms" }}
				>
					<BorderBeam duration={14} />
					{INVESTOR_TYPES.map((stat) => (
						<div key={stat.id} className="bg-surface px-5 py-6">
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
					className="mx-auto mt-10 max-w-3xl animate-rise text-ink-muted leading-[1.75]"
					style={{ animationDelay: "300ms" }}
				>
					Four autonomous agents orchestrate your entire round. They reverse-source high-conviction
					investors, write personalized outreach against active fund theses, and maintain a unified
					cross-inbox deal room from initial intro to signed term sheet.
				</p>
			</div>
		</section>
	);
}
