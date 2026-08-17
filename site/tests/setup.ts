// Vitest setup — loaded once per test file via `setupFiles` in vitest.config.ts.
//
// Importing jest-dom registers its custom matchers (toBeInTheDocument,
// toHaveTextContent, …) on the global `expect`. It must happen in a setup file,
// not per test: the matchers are global state, and `globals: true` means tests
// never import `expect` themselves.
import "@testing-library/jest-dom/vitest";
