# site/public — files served verbatim at the site root

Anything here is copied to `dist/` **unhashed** and served at `/<filename>`. Use it only for
files whose URL must be stable (crawlers, unfurlers, browser conventions). Everything the app
imports should live in `src/` instead so it gets a content hash.

| File | Purpose |
| --- | --- |
| `robots.txt` | Allow-all + absolute `Sitemap:` line |
| `sitemap.xml` | Single URL (`https://gtmxagents.com/`); hand-maintained |
| `favicon.svg` | Placeholder "G" mark, referenced from `index.html` and the JSON-LD `logo` |
| `.assetsignore` | Copied to `dist/`, read by wrangler — keeps **this file** off the live site |

`this file` is why `.assetsignore` exists: without it, an internal note would be readable at
`https://gtmxagents.com/README.md`. Verify with
`WRANGLER_LOG=debug pnpm exec wrangler deploy --dry-run | grep "Ignoring asset"` →
`.assetsignore` and `README.md` must both be listed.

## ⚠️ Required before launch: `og.png`

**`public/og.png` does not exist yet** — it is a binary and was deliberately not committed by
the scaffold agent. `index.html` already references
`https://gtmxagents.com/og.png` from `og:image`, `og:image:secure_url` and `twitter:image`,
with `og:image:width=1200` / `og:image:height=630` declared.

Until the file exists, every link preview (LinkedIn, Slack, WhatsApp, X, iMessage) renders as
a **broken/blank card**. Requirements:

- **Exactly 1200 × 630 px**, PNG (that is the ratio all major unfurlers crop to).
- Keep text inside the middle ~80% — LinkedIn and WhatsApp crop the edges.
- Under ~1 MB; several crawlers give up on slow or oversized images.
- Dark background matching `--color-background` (`#0b0d12`) so it does not flash white.

Verify after deploy with the LinkedIn Post Inspector and `curl -sI https://gtmxagents.com/og.png`
(expect `200` + `content-type: image/png`). Note that unfurlers cache aggressively — replacing
the image later may require a re-scrape in their tooling.

An `apple-touch-icon.png` (180 × 180) is also worth adding eventually; `index.html` currently
points `apple-touch-icon` at the SVG, which older iOS ignores.
