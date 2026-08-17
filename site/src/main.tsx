import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
// Side-effect import: the Vite Tailwind plugin compiles this into the bundled
// stylesheet. Importing it from the entrypoint (not from a component) keeps the
// CSS in the initial chunk so there is no unstyled flash.
import "@/index.css";

const rootElement = document.getElementById("root");
// Fail loudly rather than with a null-deref deep inside React: if this throws,
// index.html lost its <div id="root">.
if (!rootElement) {
	throw new Error("Root element #root not found — check site/index.html");
}

createRoot(rootElement).render(
	// StrictMode double-invokes effects in dev only; it is free in production and
	// surfaces unsafe lifecycles early.
	<StrictMode>
		<App />
	</StrictMode>,
);
