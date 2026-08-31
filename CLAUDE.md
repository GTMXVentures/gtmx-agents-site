# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.

## What this is

The public marketing site for **gtmxagents.com**, hosted on **Cloudflare Workers with static
assets**. Four routes: `/`, `/product`, `/company`, `/contact` — a multi-page Vite build, one
HTML entry each, see ADR 0003. The GTMX agent product lives on GKE in a different repo and is
out of scope here — do not add product/API logic to this site beyond the `/api/*` seam
described below.

Registrar is Hostinger; DNS is Cloudflare (Free plan). Email is a **Google Workspace domain
alias** of gtmxventures.com — every existing user receives at and can send-as
`@gtmxagents.com` with no new licenses. **No cold outreach from this domain** (it shares a
reputation surface with the Workspace primary domain).

## Repo map

```
site/                 deployable unit
  wrangler.jsonc      Worker + static-asset config (assets → ./dist)
  worker/index.ts     Worker entry: www→apex 301, /api/* routing, ASSETS passthrough
  worker/waitlist.ts  POST /api/waitlist — validate + insert into D1
  migrations/         D1 schema; `wrangler d1 migrations apply`
  vite.config.ts      prod bundler (multi-page `input`)  vitest.config.ts  tests
  index.html          home; product|company|contact/index.html are the other routes
                      ALL SEO/OG/JSON-LD is static, per route, in these files
  src/pages/          one component per route      src/entries/  their mount modules
  src/components/Shell.tsx   header/footer chrome shared by every route
  src/data/company.ts        company facts; `null` means "do not publish"
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
- **SEO is static, per route.** Unfurlers (LinkedIn, Slack, X) do not run JS. Anything that
  must appear in a preview card goes in that route's `index.html`, never in React. Adding a
  route means five edits — `vite.config.ts` input, the HTML file, `src/entries/`,
  `public/sitemap.xml`, and the new file's canonical tag. Miss the last two and the page is
  invisible or misindexed.
- **Never publish a company fact we do not have.** `src/data/company.ts` drives the footer and
  the contact page; a `null` field renders *nothing* — no placeholder, no em dash, no "coming
  soon". Tests in `src/pages/__tests__` enforce this. An invented address or phone number on a
  page whose purpose is proving the company is real is a liability, not a stopgap.
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
- `/api/waitlist` is implemented (`worker/waitlist.ts`); other `/api/*` paths return a JSON
  404. Getting **HTML** back from any `/api/*` path is the canonical symptom that
  `run_worker_first` is misconfigured.
- Waitlist signups go to **Cloudflare D1** (`waitlist_signups`), bound as `WAITLIST_DB`. Not
  the product's Postgres: marketing data and application data have no reason to share a
  database, and the rule at the top of this file is that product logic stays out of this site.
- **A native binding means there is no credential here** — nothing to `wrangler secret put`,
  nothing to rotate, and a compromised marketing Worker cannot reach the product database even
  in principle. Keep it that way; if a future feature seems to need a Supabase key in this
  Worker, that feature probably belongs in the product repo.
- The `d1_databases` block is **commented out** in `wrangler.jsonc` until the database is
  created; until then the endpoint answers 503 and the form falls back to a mailto link. A
  placeholder `database_id` fails `wrangler deploy`; an id for a database that does not exist
  deploys and then throws at runtime.
- The insert uses `ON CONFLICT(email) DO NOTHING` and **never reads the table**. A read would
  make the endpoint an oracle for whether a given address is on the list; the conflict clause
  keeps a resubmission a silent no-op, and both first and repeat signups return the same 202.
  There is a test asserting the statement contains no SELECT.
- **Open issue — the www→apex 301 is currently a no-op for page views.** `run_worker_first`
  only routes `/api/*` to the Worker, so `www.gtmxagents.com/anything` is answered by the
  asset server with a 200 instead of redirecting (verified locally with `wrangler dev`).
  Close it either by widening `run_worker_first` to `["/*", "!/assets/*"]` (one Worker
  invocation per page view; assets stay unmetered) or with a Pulumi-owned Cloudflare Single
  Redirect rule. Until then the absolute `<link rel="canonical">` in `index.html` is what
  prevents duplicate-content indexing.
- `pnpm` only. A `package-lock.json` or `yarn.lock` appearing here is a mistake.
