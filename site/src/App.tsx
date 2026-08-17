// React 19 removed the global JSX/React namespaces from @types/react, so return
// types must be imported explicitly — `React.ReactElement` without an import no
// longer resolves.
import type { ReactElement } from "react";
import { Agents } from "@/components/sections/Agents";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Waitlist } from "@/components/sections/Waitlist";

/**
 * Single route — no router. The site is one page; adding react-router/wouter now
 * would ship a router for zero routes. If real routes appear, add `wouter` (per
 * the plan) and keep this component as the layout shell.
 *
 * Landmark structure is deliberate and flat: <header> (banner) → <main> →
 * <footer> (contentinfo), all siblings. Moving <footer> inside <main> would drop
 * the contentinfo role, and wrapping the lot in a <div role="application"> style
 * shell would drop all three.
 */
export default function App(): ReactElement {
	return (
		<div className="min-h-dvh">
			{/* Keyboard-only escape hatch past the header. `sr-only focus:not-sr-only`
			    is the standard pattern: present in the a11y tree, painted only when
			    focused. */}
			<a
				href="#waitlist"
				className="sr-only rounded-control bg-accent px-4 py-2 text-accent-ink text-sm focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-10"
			>
				Skip to the waitlist
			</a>

			<header className="border-line/70 border-b">
				<div className="mx-auto flex max-w-6xl items-baseline justify-between gap-4 px-6 py-5 sm:px-8">
					<p className="font-mono text-[0.6875rem] text-ink uppercase tracking-[0.22em]">
						GTMX Agents
					</p>
					<a
						href="#waitlist"
						className="font-mono text-[0.6875rem] text-ink-subtle uppercase tracking-[0.18em] transition-colors duration-200 hover:text-ink"
					>
						Waitlist
					</a>
				</div>
			</header>

			<main>
				<Hero />
				<Problem />
				<Agents />
				<Waitlist />
			</main>

			<Footer />
		</div>
	);
}
