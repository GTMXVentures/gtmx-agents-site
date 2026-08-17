import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Kept separate from vite.config.ts so the production bundler stays free of
// test-only plugins and settings (jsdom, globals, setup files) — a stray test
// dependency can never end up in the shipped bundle. The `@/` alias is
// re-declared here because this config does NOT extend vite.config.ts; without
// it, imports like `from "@/lib/utils"` fail to resolve under jsdom.
//
// Note there is no tailwindcss() plugin here on purpose: jsdom doesn't compute
// styles from CSS anyway, and running the Tailwind scanner would only slow the
// suite down.
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: { "@": path.resolve(import.meta.dirname, "src") },
	},
	test: {
		environment: "jsdom",
		// globals: true → describe/it/expect without importing them, which is also
		// what @testing-library/jest-dom's matcher registration in tests/setup.ts
		// expects.
		globals: true,
		setupFiles: ["./tests/setup.ts"],
		// Colocated tests only. `tests/` holds setup/helpers, not test files, so it
		// is not in this glob.
		include: ["src/**/__tests__/**/*.test.{ts,tsx}"],
		exclude: ["node_modules", "dist", ".wrangler"],
	},
});
