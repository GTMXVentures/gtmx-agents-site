# site/public — files served verbatim at the site root

Anything here is copied to `dist/` **unhashed** and served at `/<filename>`. Use it only for
files whose URL must be stable (crawlers, unfurlers, browser conventions). Everything the app
imports should live in `src/` instead so it gets a content hash.

| File | Purpose |
| --- | --- |
| `robots.txt` | Allow-all + absolute `Sitemap:` line |
| `sitemap.xml` | Four routes; hand-maintained — add a `<url>` per new route |
| `favicon.svg` | Placeholder "G" mark, referenced from every route's HTML and the JSON-LD `logo` |
| `og.png` | 1200×630 social card; see the note below |
| `.assetsignore` | Copied to `dist/`, read by wrangler — keeps **this file** off the live site |

`this file` is why `.assetsignore` exists: without it, an internal note would be readable at
`https://gtmxagents.com/README.md`. Verify with
`WRANGLER_LOG=debug pnpm exec wrangler deploy --dry-run | grep "Ignoring asset"` →
`.assetsignore` and `README.md` must both be listed.

## `og.png`

**Present since 2026-08-31.** 1200 × 630 PNG, dark ground matching
`--color-background`, text kept inside the middle ~80% so LinkedIn and WhatsApp
crops do not clip it. Referenced from `og:image`, `og:image:secure_url` and
`twitter:image` in every route's HTML.

Before this existed, `/og.png` was answered by the SPA fallback with
`content-type: text/html`, so every link preview rendered as a blank card —
verify any replacement with `curl -sI https://gtmxagents.com/og.png` and expect
`200` + `content-type: image/png`, not just a 200.

The figures on the card are baked in at render time and will drift from
`src/data/coverage.ts`. Regenerate it when those numbers move materially.

An `apple-touch-icon.png` (180 × 180) is still worth adding; `index.html`
currently points `apple-touch-icon` at the SVG, which older iOS ignores.
