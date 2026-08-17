# ADR 0001 — Host the site on Cloudflare Workers with static assets, not Cloudflare Pages

- **Status**: Accepted
- **Date**: 2026-08-17
- **Context owner**: GTMX engineering

## Context

gtmxagents.com needs a static-first landing page with room for one small dynamic endpoint
(a waitlist POST) later. The domain is registered at Hostinger; DNS moves to Cloudflare Free.
The realistic options were Cloudflare Pages, Cloudflare Workers with static assets, and a
generic host (Vercel/Netlify/S3+CDN).

## Decision

Deploy as a **Cloudflare Worker with static assets** (`assets` block in `wrangler.jsonc`,
`binding: ASSETS`, `not_found_handling: single-page-application`).

## Rationale

- **Cloudflare's own recommended path.** Workers-with-assets is the successor to Pages;
  Pages is in maintenance mode for new projects and its feature work has stopped. Starting on
  Pages means a migration later.
- **Static asset requests are unmetered/free**, so a marketing page costs effectively $0 —
  provided the Worker does not sit in front of every asset (see `run_worker_first`, ADR-adjacent
  gotcha in CLAUDE.md).
- **One deployment unit for static + dynamic.** The `/api/*` seam (waitlist, later) runs in the
  same Worker as the assets — no second service, no CORS, no extra origin.
- **A single `wrangler deploy`** covers script and assets, which keeps CI simple and makes
  preview deployments (`wrangler versions upload --preview-alias`) a one-liner.
- Staying inside Cloudflare keeps DNS, TLS, CDN, and compute under one account and one
  Pulumi provider (`pulumi-cloudflare`), instead of splitting DNS from hosting.

## Consequences

- `wrangler.jsonc` is the source of truth for what runs; `site/dist` is the asset payload.
- Deep links rely on `not_found_handling: "single-page-application"` to return the SPA shell
  with a 200. Removing it silently 404s every route but `/`.
- `run_worker_first` must stay a **path array** (`["/api/*"]`). `true` bills every asset hit.
- No Pages-specific features (Pages Functions, `_redirects`, `_headers`) are available —
  redirects and headers are Worker code or Cloudflare rules instead. The www→apex 301 is
  implemented in `worker/index.ts`.
- Preview deploys use `*.workers.dev` preview aliases rather than Pages preview branches.

## Alternatives considered

- **Cloudflare Pages** — familiar, git-integrated builds, but maintenance-mode and would need
  a later migration; its git integration also cannot gate a deploy on a GitHub check suite,
  which is exactly what we want (see the CI/CD note in ADR 0002).
- **Vercel/Netlify** — good DX, but adds a second vendor in front of a Cloudflare zone and
  another billing/ownership boundary for one static page.
