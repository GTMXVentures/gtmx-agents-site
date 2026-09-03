import type { ReactElement, ReactNode } from "react";
import { GlobalMouseSpotlight } from "@/components/GlobalMouseSpotlight";
import { Footer } from "@/components/sections/Footer";
import { useSmoothScroll } from "@/lib/useSmoothScroll";

/**
 * Shared page chrome: ambient spotlight, skip link, sticky header, <main>, footer.
 *
 * Every HTML entry point renders through this so the header and footer cannot
 * drift between pages — the failure mode of a multi-page Vite build, where each
 * entry is a separate React root with no shared layout unless one is imposed.
 *
 * Nav links are ROOT-RELATIVE (`/product`, `/#waitlist`) rather than bare hashes
 * because they must resolve identically from `/` and from `/product`. A bare
 * `#waitlist` on /product scrolls to nothing.
 */

const NAV = [
	{ href: "/product", label: "Product" },
	{ href: "/company", label: "Company" },
	{ href: "/contact", label: "Contact" },
] as const;

export interface SectionLink {
	readonly href: string;
	readonly label: string;
}

export interface ShellProps {
	children: ReactNode;
	/**
	 * In-page section anchors for long pages (the home page). Rendered before the
	 * site nav and hidden below `md`, where the page-level links matter more than
	 * a scroll shortcut. Pages without long-form sections pass nothing.
	 */
	sections?: readonly SectionLink[];
	/** Marks the current page so its nav item can be indicated to assistive tech. */
	current?: (typeof NAV)[number]["href"] | "/";
	/** Where the skip link lands. Home targets the waitlist; subpages their content. */
	skipTo?: { href: string; label: string };
}

export function Shell({
	children,
	sections = [],
	current = "/",
	skipTo = { href: "#waitlist", label: "Skip to the waitlist" },
}: ShellProps): ReactElement {
	useSmoothScroll();

	return (
		<div className="relative min-h-dvh antialiased selection:bg-accent selection:text-accent-ink">
			<GlobalMouseSpotlight />

			<a
				href={skipTo.href}
				className="sr-only rounded-control bg-primary px-4 py-2 text-primary-foreground text-sm focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-10"
			>
				{skipTo.label}
			</a>

			<header className="sticky top-0 z-40 border-line border-b bg-background/85 backdrop-blur-md">
				<div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-4 sm:gap-4 sm:px-8">
					<a
						href="/"
						className="min-w-0 shrink whitespace-nowrap font-display font-bold text-ink text-sm tracking-[-0.01em]"
					>
						GTMX Agents
					</a>

					<nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
						{/* Section shortcuts, home page only. Hidden on narrow screens so the
						    page-level links never get pushed off the header. */}
						{sections.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="hidden rounded-control px-1.5 py-2 font-mono text-[0.6875rem] text-ink-subtle uppercase tracking-[0.08em] transition-colors duration-200 hover:text-ink md:inline-block sm:px-3 sm:tracking-[0.16em]"
							>
								{link.label}
							</a>
						))}
						{sections.length > 0 && (
							<span aria-hidden="true" className="hidden h-4 w-px bg-line md:inline-block" />
						)}
						{NAV.map((link) => (
							<a
								key={link.href}
								href={link.href}
								aria-current={current === link.href ? "page" : undefined}
								className="rounded-control px-1.5 py-2 font-mono text-[0.6875rem] text-ink-subtle uppercase tracking-[0.08em] transition-colors duration-200 hover:text-ink aria-[current=page]:text-ink sm:px-3 sm:tracking-[0.16em]"
							>
								{link.label}
							</a>
						))}
						<a
							href="/#waitlist"
							className="ml-0.5 whitespace-nowrap rounded-control bg-primary px-3 py-2 font-display font-medium text-primary-foreground text-sm shadow-sm transition-colors duration-200 hover:bg-primary-hover sm:ml-1 sm:px-4"
						>
							Talk to us
						</a>
					</nav>
				</div>
			</header>

			<main className="will-change-transform">{children}</main>

			<Footer />
		</div>
	);
}
