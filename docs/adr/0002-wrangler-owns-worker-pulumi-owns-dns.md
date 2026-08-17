# ADR 0002 — wrangler owns the Worker; Pulumi owns the zone, DNS, and domain attachment

- **Status**: Accepted
- **Date**: 2026-08-17
- **Context owner**: GTMX engineering

## Context

Two tools can write to the same Cloudflare account: `wrangler` (from `site/`, and from CI on
every merge to `main`) and Pulumi (`infra/`, Go, run by a human). Cloudflare exposes the Worker
script, its routes, the zone, DNS records, and custom domains all through the same API, so both
tools *could* manage all of it. If they overlap, the loser of the last write wins and
`pulumi preview` never converges.

The zone for gtmxagents.com was already created in the Cloudflare dashboard before any code
existed.

## Decision

Split ownership on the line **"what runs" vs "where traffic goes"**:

| Tool | Owns |
| --- | --- |
| **wrangler** (`site/`, GitHub Actions) | the Worker script and its static assets |
| **Pulumi** (`infra/`) | the zone (imported), DNS records (MX/SPF/DMARC/DKIM/verification), zone settings, and the apex + `www` `WorkersCustomDomain` attachments |

Concrete prohibitions:

- **No `cloudflare.WorkersScript` in Pulumi.** Every `wrangler deploy` would then be reverted
  by the next `pulumi up`. (Deliberate deviation from the openskillmd platform repo, where
  Pulumi does own a Worker — that Worker is a tiny Cloud-Run router with no assets and no CI
  deploy loop, so there is nothing to fight.)
- **No `cloudflare.DnsRecord` for the apex or `www`.** `WorkersCustomDomain` creates and owns
  those records and the certificate; a parallel `DnsRecord` on the same hostname yields a
  permanent diff and can block TLS issuance.
- **No management of the `*.workers.dev` subdomain** in either tool — it is an account setting
  used for previews only.
- The zone is **imported** (`pulumi import cloudflare:index/zone:Zone gtmxagents-com <zoneId>`)
  and marked `Protect(true)`; it is never created or deleted by code.

## Consequences

- Ordering matters: the Worker script must exist (first `wrangler deploy`) **before**
  `gtmxsite:attachWorkerDomain=true` and `pulumi up`, because a custom domain cannot attach to
  a non-existent service.
- Two least-privilege API tokens instead of one: **A** `pulumi-gtmxagents` (Zone:Edit,
  DNS:Edit, Zone Settings:Edit, Workers Scripts:**Read**, Account Settings:Read — used locally
  by Pulumi) and **B** `gha-deploy` (Workers Scripts:Edit, Workers Routes:Edit, Account
  Settings:Read, **no DNS write**). A leaked CI token cannot repoint company mail.
- CI/CD deploys via GitHub Actions gated on the PR check suite, not Cloudflare Workers Builds:
  Workers Builds cannot see the GitHub check suite, so it would deploy code that failed CI.
- A recurring `pulumi preview` diff is diagnosed as an **ownership collision** first (or TXT
  content that needs escaped quotes), not as a provider bug.
- Rollback paths differ by layer: `wrangler versions`/`wrangler rollback` for code,
  `pulumi up` for DNS. That is a feature — a bad landing-page deploy can never take mail down.

## Addendum (2026-08-17) — host canonicalization is Pulumi's, not the Worker's

The www→apex 301 is a **Cloudflare Single Redirect rule owned by Pulumi**
(`infra/internal/site/redirects.go`, `http_request_dynamic_redirect` phase), not
the branch in `site/worker/index.ts`.

The in-Worker branch alone was insufficient: with `assets.run_worker_first`
limited to `["/api/*"]` and `not_found_handling: single-page-application`, the
asset server answers document requests without ever invoking the Worker, so
`www…/pricing` returned a 200 page instead of a 301 and only `www…/api/*`
redirected. Widening `run_worker_first` to all documents would have fixed it too,
at the cost of a Worker invocation per page view — and it would have made a
hostname decision, which is squarely "where traffic goes", depend on the deploy
artifact. The Worker branch stays as defence in depth and so `wrangler dev`
matches production.

Corollary prohibition: a zone permits exactly **one** ruleset per phase, so all
future redirects go into that same `cloudflare.Ruleset` resource — never a second
one, and never a hand-made rule in the dashboard.
