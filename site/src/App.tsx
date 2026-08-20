// React 19 removed the global JSX/React namespaces from @types/react, so return
// types must be imported explicitly — `React.ReactElement` without an import no
// longer resolves.
import type { ReactElement } from "react";
import { Agents } from "@/components/sections/Agents";
import { BackedBy } from "@/components/sections/BackedBy";
import { Database } from "@/components/sections/Database";
import { DealRoom } from "@/components/sections/DealRoom";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Mcp } from "@/components/sections/Mcp";
import { Problem } from "@/components/sections/Problem";
import { Waitlist } from "@/components/sections/Waitlist";

/**
 * Single route — no router. The site is one page; adding react-router/wouter now
 * would ship a router for zero routes. The header links are in-page anchors, not
 * routes. If real routes appear, add `wouter` (per the plan) and keep this
 * component as the layout shell.
 *
 * Landmark structure is deliberate and flat: <header> (banner) → <main> →
 * <footer> (contentinfo), all siblings. Moving <footer> inside <main> would drop
 * the contentinfo role.
 *
 * Section order is an argument, not a layout: claim (Hero) → why it is needed
 * (Problem) → how it works (Agents) → why to believe it (Database, DealRoom) →
 * how to extend it (Mcp) → who is behind it (BackedBy) → objections (Faq) → act
 * (Waitlist). Database sits AFTER the capability claims on purpose; it is the
 * only checkable section on the page, so it works as proof rather than as an
 * opening statistic nobody has context for yet.
 *
 * Faq is last before the CTA because it exists to clear the final objections —
 * moving it above the proof sections would have it answering questions the
 * reader has not thought to ask yet.
 */
export default function App(): ReactElement {
	return (
		<div className="min-h-dvh">
			{/* Keyboard-only escape hatch past the header. `sr-only focus:not-sr-only`
			    is the standard pattern: present in the a11y tree, painted only when
			    focused. */}
			<a
				href="#waitlist"
				className="sr-only rounded-control bg-primary px-4 py-2 text-primary-foreground text-sm focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-10"
			>
				Skip to the waitlist
			</a>

			<header className="border-line border-b">
				<div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
					<p className="whitespace-nowrap font-display font-bold text-ink text-sm tracking-[-0.01em]">
						GTMX Agents
					</p>

					<nav aria-label="Page sections" className="flex items-center gap-1 sm:gap-2">
						{/* `wide` marks links that only appear once there is room. Three
						    section links plus the CTA overflow a 390px viewport, and the CTA
						    is the one thing that must never be pushed off — so the least
						    important link is the one that drops. */}
						{[
							{ href: "#agents", label: "Agents", wide: false },
							{ href: "#database", label: "Database", wide: false },
							{ href: "#deal-room", label: "Deal room", wide: true },
						].map((link) => (
							<a
								key={link.href}
								href={link.href}
								className={`rounded-control px-2 py-2 font-mono text-[0.6875rem] text-ink-subtle uppercase tracking-[0.12em] transition-colors duration-200 hover:text-ink sm:px-3 sm:tracking-[0.16em] ${
									link.wide ? "hidden sm:inline-block" : ""
								}`}
							>
								{link.label}
							</a>
						))}
						<a
							href="#waitlist"
							className="ml-1 rounded-control bg-primary px-4 py-2 font-display font-medium text-primary-foreground text-sm transition-colors duration-200 hover:bg-primary-hover"
						>
							Talk to us
						</a>
					</nav>
				</div>
			</header>

			<main>
				<Hero />
				<Problem />
				<Agents />
				<Database />
				<DealRoom />
				<Mcp />
				<BackedBy />
				<Faq />
				<Waitlist />
			</main>

			<Footer />
		</div>
	);
}
