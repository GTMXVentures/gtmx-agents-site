/// <reference types="vite/client" />

// Vite resolves `*.svg` imports to a URL string. Without this declaration tsc
// fails the build on `import logo from "@/assets/…svg"` — vite/client covers it,
// but only once the reference above is in the project's include path.
