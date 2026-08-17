# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.

## What this is

The public landing page for **gtmxagents.com**, hosted on **Cloudflare Workers with static
assets**. One route today. The GTMX agent product lives on GKE in a different repo and is out
of scope here — do not add product/API logic to this site beyond the `/api/*` seam described
below.

Registrar is Hostinger; DNS is Cloudflare (Free plan). Email is a **Google Workspace domain
alias** of gtmxventures.com — every existing user receives at and can send-as
`@gtmxagents.com` with no new licenses. **No cold outreach from this domain** (it shares a
reputation surface with the Workspace primary domain).

## Repo map

```
site/                 deployable unit
  wrangler.jsonc      Worker + static-asset config (assets → ./dist)
  worker/index.ts     Worker entry: www→apex 301, /api/* JSON 404 seam, ASSETS passthrough
  vite.config.ts      prod bundler          vitest.config.ts  tests (separate on purpose)
  index.html          ALL SEO/OG/JSON-LD lives here (static, single route)
  src/                React 19 + Tailwind v4; tokens in src/index.css @theme
infra/                Pulumi Go: zone (imported), DNS, Worker custom domains
docs/adr/             decision records — read before changing hosting or DNS ownership
.github/workflows/    pr-check.yml (blocking) · deploy.yml (on push to main)
```

## Ownership rules — the one thing to get right

Two tools touch Cloudflare. They must never touch the same resource:

| Tool | Owns | Mental model |
| --- | --- | --- |
| **wrangler** (`site/`, CI) | the Worker script + its static assets | "**what runs**" |
| **Pulumi** (`infra/`) | the zone, DNS records, Worker custom-domain attachment | "**where traffic goes**" |

Hard rules:

- **Never declare a `cloudflare.WorkersScript` in Pulumi.** Pulumi would fight every
  `wrangler deploy` and roll the script back to whatever the last `pulumi up` uploaded.
  (This is a deliberate deviation from the openskillmd platform repo, where the Worker is a
  tiny Cloud-Run router with no assets and Pulumi owning it is harmless.)
- **Never create a `cloudflare.DnsRecord` for the apex or `www`.** A `WorkersCustomDomain`
  creates and owns those records plus the certificate. A hand-written `DnsRecord` on the same
  hostname produces a permanent `pulumi preview` diff and can break TLS issuance.
- **Never manage the `*.workers.dev` subdomain in code.** It is an account-level setting used
  only for previews.
- The zone **already exists** in the Cloudflare dashboard → Pulumi `import`s it and marks it
  `Protect(true)`. Never create it.
- `wrangler deploy` must run **before** `attachWorkerDomain=true` — a custom domain cannot
  attach to a service that doesn't exist yet.

If `pulumi refresh && pulumi preview` shows a recurring diff, assume an ownership collision
(or unquoted TXT content) before assuming a provider bug.

## Conventions

- **Comment the non-obvious.** Every config choice that a reader might "clean up" carries a
  why-comment explaining what breaks without it. Archaeology beats re-litigation.
- **Biome only** — no ESLint, no Prettier. `pnpm lint` = `biome check .` (lint + format).
  Config is `biome.jsonc`, **not** `biome.json`: Biome parses a `.json` config as strict JSON and
  silently falls back to defaults when it hits our why-comments (symptom: `@apply` suddenly
  errors as "Tailwind-specific syntax is disabled").
- **Tailwind v4 CSS-first**: no `tailwind.config.js`, no PostCSS config. Design tokens are
  `--color-*` / `--font-*` entries in the `@theme` block of `site/src/index.css`, and values
  must be **literal hex** — `@theme` values are inlined into utilities, so `var()` /
  `color-mix()` there produce broken CSS.
- **SEO is static.** Unfurlers (LinkedIn, Slack, X) do not run JS. Anything that must appear
  in a preview card goes in `site/index.html`, never in React.
- **Tests**: Vitest in a separate `vitest.config.ts` so test-only plugins stay out of the
  production bundler. Tests colocate in `src/**/__tests__/*.test.tsx`.
- **The `@` alias is declared in three places** — `tsconfig.json`, `vite.config.ts`,
  `vitest.config.ts`. Change one, change all three.
- **Conventional Commits with a scope**: `feat(site):`, `fix(site):`, `infra(dns):`,
  `chore(ci):`. PR body = **Summary** + **Test plan**.
- ADRs in `docs/adr/NNNN-kebab-case.md`.

## Gotchas

- `assets.run_worker_first` must stay an **array** (`["/api/*"]`). `true` routes *every*
  request — including hashed assets — through the Worker, which meters requests that would
  otherwise be free. If a wrangler version rejects the array form, upgrade wrangler; do not
  "fix" it by setting `true`.
- `not_found_handling: "single-page-application"` is what makes deep links return the SPA
  shell with **200**. Removing it turns `/anything` into a 404.
- The Worker's `/api/*` handler returns a JSON 404 today. Getting **HTML** back from
  `/api/waitlist` is the canonical symptom that `run_worker_first` is misconfigured.
- **Open issue — the www→apex 301 is currently a no-op for page views.** `run_worker_first`
  only routes `/api/*` to the Worker, so `www.gtmxagents.com/anything` is answered by the
  asset server with a 200 instead of redirecting (verified locally with `wrangler dev`).
  Close it either by widening `run_worker_first` to `["/*", "!/assets/*"]` (one Worker
  invocation per page view; assets stay unmetered) or with a Pulumi-owned Cloudflare Single
  Redirect rule. Until then the absolute `<link rel="canonical">` in `index.html` is what
  prevents duplicate-content indexing.
- `pnpm` only. A `package-lock.json` or `yarn.lock` appearing here is a mistake.
