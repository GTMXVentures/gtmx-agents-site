import type { ReactElement } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Side-effect import: the Vite Tailwind plugin compiles this into the bundled
// stylesheet. Importing it here (not from a component) keeps the CSS in the
// initial chunk of every entry, so there is no unstyled flash on any page.
import "@/index.css";

/**
 * Mounts a page component into #root.
 *
 * Shared by every HTML entry point in the multi-page build. Without this the
 * root lookup, the null check and the StrictMode wrapper are copy-pasted once
 * per page, and they drift.
 */
export function mount(page: ReactElement, entryFile: string): void {
	const rootElement = document.getElementById("root");
	// Fail loudly rather than with a null-deref deep inside React: if this throws,
	// the entry's HTML lost its <div id="root">.
	if (!rootElement) {
		throw new Error(`Root element #root not found — check ${entryFile}`);
	}

	createRoot(rootElement).render(
		// StrictMode double-invokes effects in dev only; it is free in production
		// and surfaces unsafe lifecycles early.
		<StrictMode>{page}</StrictMode>,
	);
}
