# 3. Multi-page Vite build, not a client-side router

Date: 2026-08-27

## Status

Accepted.

## Context

The site was one route. An application for cloud credits was rejected on the
grounds that the site "did not contain enough information about your company"
— the only one of the reviewer's three stated reasons that held up, the other
two (the link not loading, and a redirect leaving the company domain) being
demonstrably false. Closing that gap means real pages: what the product is, who
the company is, and how to reach a person.

Adding routes collides with an existing decision recorded throughout this repo:
**all SEO is static, in the HTML**, because unfurlers (LinkedIn, Slack, X,
WhatsApp) fetch the document and do not execute JavaScript. `index.html` says as
much in a comment, and defers the question: *"Single route today, so there is
nothing to make dynamic; revisit prerendering only if routes multiply."*

Routes have now multiplied.

## Decision

Use Vite's **multi-page build** — one HTML entry per route, each with its own
complete static `<head>` — rather than a client-side router.

```
index.html          → src/main.tsx           → App       (/)
product/index.html  → src/entries/product.tsx → Product   (/product)
company/index.html  → src/entries/company.tsx → Company   (/company)
contact/index.html  → src/entries/contact.tsx → Contact   (/contact)
```

Shared chrome (header, footer, ambient spotlight, smooth scroll) lives in
`src/components/Shell.tsx` so four independent React roots cannot drift apart.

## Consequences

**What this buys**

- Title, description, canonical, Open Graph, Twitter card and JSON-LD are real
  bytes in every document. No unfurler, crawler or reader-mode parser has to run
  JavaScript to see them.
- No new runtime dependency. No router, no helmet-equivalent, no prerender step.
- Cloudflare's asset server resolves `/product` to `product/index.html`
  natively, so no rewrite rule and no change to `run_worker_first`.
- Vite hoists the shared code into one chunk, so React is downloaded once and
  cached across pages rather than bundled per entry.

**What it costs**

- Navigation between pages is a full document load, not a client-side
  transition. For a four-page marketing site this is a non-issue and arguably
  the more robust behaviour; it would be the wrong trade for an application.
- Adding a route now touches **five** places: an entry in `vite.config.ts`, the
  HTML file, an entry module in `src/entries/`, a `<url>` in
  `public/sitemap.xml`, and the canonical tag in the new HTML. Miss the sitemap
  or the canonical and the page is invisible or misindexed. This is written down
  in the `input` block in `vite.config.ts` because it is the failure mode.
- The four heads duplicate structure. They were generated from `index.html` so
  they start identical; a change to shared head markup (a new font, a favicon
  swap) must be applied to all four. If that becomes painful, the answer is a
  build-time template, not a client router.

## Alternatives considered

**React Router + a head manager.** Rejected: meta injected by JavaScript is
invisible to every unfurler, which contradicts the repo's stated SEO rule and
would silently break link previews — the exact failure `index.html` already warns
about.

**Worker-side HTML rewriting per path.** Technically sound and keeps one bundle,
but it requires widening `assets.run_worker_first` from `["/api/*"]` to match
document requests, which meters every page view. `wrangler.jsonc` carries an
explicit warning against exactly that change.

**Prerendering via an SSG plugin.** Solves the same problem with more moving
parts than four static files justify at this size.
