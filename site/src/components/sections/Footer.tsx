import type { ReactElement } from "react";

/**
 * Footer — the <footer> here is a direct child of the layout root (see App.tsx),
 * NOT nested inside <main>, so it exposes the `contentinfo` landmark. Nesting it
 * in a sectioning element would silently drop that role.
 *
 * The year is hard-coded rather than computed from `new Date()`: this is a
 * static asset served from cache, so a computed year would differ between the
 * built HTML and a late-hydrating client for no benefit. Bump it on the next
 * meaningful deploy.
 */
export function Footer(): ReactElement {
	return (
		<footer className="border-line border-t">
			<div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-baseline sm:justify-between sm:px-8">
				<div>
					<p className="font-display font-medium text-ink text-sm">GTMX Agents</p>
					<p className="mt-1 text-ink-subtle text-xs">Agent-run fundraising.</p>
					<p className="mt-3 text-ink-subtle text-xs">Supported by GTMX Ventures.</p>
				</div>
				<div className="flex flex-col gap-1 text-xs sm:items-end">
					<a
						href="mailto:hello@gtmxagents.com"
						className="text-ink-muted transition-colors duration-200 hover:text-accent"
					>
						hello@gtmxagents.com
					</a>
					<p className="text-ink-subtle">© 2026 GTMX Agents</p>
				</div>
			</div>
		</footer>
	);
}
