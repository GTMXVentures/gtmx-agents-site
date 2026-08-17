// Vitest setup — loaded once per test file via `setupFiles` in vitest.config.ts.
//
// Importing jest-dom registers its custom matchers (toBeInTheDocument,
// toHaveTextContent, …) on the global `expect`. It must happen in a setup file,
// not per test: the matchers are global state, and `globals: true` means tests
// never import `expect` themselves.
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

class MockIntersectionObserver implements IntersectionObserver {
	readonly root = null;
	readonly rootMargin = "";
	readonly thresholds = [];

	disconnect(): void {}
	observe(): void {}
	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}
	unobserve(): void {}
}

Object.defineProperty(window, "IntersectionObserver", {
	writable: true,
	value: MockIntersectionObserver,
});
Object.defineProperty(globalThis, "IntersectionObserver", {
	writable: true,
	value: MockIntersectionObserver,
});

class MockResizeObserver implements ResizeObserver {
	disconnect(): void {}
	observe(): void {}
	unobserve(): void {}
}

Object.defineProperty(window, "ResizeObserver", {
	writable: true,
	value: MockResizeObserver,
});
Object.defineProperty(globalThis, "ResizeObserver", {
	writable: true,
	value: MockResizeObserver,
});

HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
	arc: vi.fn(),
	beginPath: vi.fn(),
	clearRect: vi.fn(),
	fill: vi.fn(),
	lineTo: vi.fn(),
	moveTo: vi.fn(),
	stroke: vi.fn(),
})) as unknown as HTMLCanvasElement["getContext"];
