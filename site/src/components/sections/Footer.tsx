import type { ReactElement } from "react";

/**
 * Footer — the <footer> here is a direct child of <body>'s layout root (see
 * App.tsx), NOT nested inside <main>, so it exposes the `contentinfo` landmark.
 * Nesting it in a sectioning element would silently drop that role.
 *
 * The year is hard-coded rather than computed from `new Date()`: this is a
 * static asset served from cache, so a computed year would differ between the
 * built HTML and a late-hydrating client for no benefit. Bump it on the next
 * meaningful deploy.
 */
export function Footer(): ReactElement {
	return (
		<footer className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 text-ink-subtle text-sm sm:flex-row sm:items-baseline sm:justify-between sm:px-8">
			<p>© 2026 GTMX Ventures</p>
			<p className="text-ink-subtle">
				GTMX Agents is a product of GTMX Ventures ·{" "}
				<a href="mailto:hello@gtmxagents.com" className="text-ink-muted hover:text-accent">
					hello@gtmxagents.com
				</a>
			</p>
		</footer>
	);
}
