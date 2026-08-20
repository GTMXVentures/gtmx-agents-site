// Vitest setup — loaded once per test file via `setupFiles` in vitest.config.ts.
//
// Importing jest-dom registers its custom matchers (toBeInTheDocument,
// toHaveTextContent, …) on the global `expect`. It must happen in a setup file,
// not per test: the matchers are global state, and `globals: true` means tests
// never import `expect` themselves.
import "@testing-library/jest-dom/vitest";

// --- Browser APIs jsdom does not implement --------------------------------
//
// Reveal.tsx reads both of these on mount. jsdom ships neither, so without
// these stubs every test that renders a section throws before asserting
// anything. Stubbed here rather than guarded in the component: both APIs exist
// in every browser the site targets, and a `typeof window.matchMedia ===
// "function"` check in production code would be dead weight that exists only to
// satisfy the test environment.

// Reports "no preference", which is the branch that actually runs the reveal.
// A test needing the reduced-motion branch should override this per-test.
if (!window.matchMedia) {
	window.matchMedia = (query: string): MediaQueryList =>
		({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}) as MediaQueryList;
}

// Never fires. Reveal only hides an element that starts BELOW the fold, and
// jsdom reports every rect as 0×0 at the origin — which reads as "already on
// screen", so the component leaves its children visible and the observer is
// never consulted. That is the behaviour tests want: assert on content, not on
// scroll position.
if (typeof window.IntersectionObserver === "undefined") {
	class NoopIntersectionObserver implements IntersectionObserver {
		readonly root = null;
		readonly rootMargin = "";
		readonly thresholds: readonly number[] = [];
		disconnect(): void {}
		observe(): void {}
		takeRecords(): IntersectionObserverEntry[] {
			return [];
		}
		unobserve(): void {}
	}
	window.IntersectionObserver = NoopIntersectionObserver;
}
