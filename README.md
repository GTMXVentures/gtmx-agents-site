# gtmx-agents-site

Landing page for **[gtmxagents.com](https://gtmxagents.com)** — the marketing site for the
GTMX agent product ("AI agents for startup fundraising"). The product itself runs on GKE and
is **not** in this repo.

## Stack

| Layer | Choice |
| --- | --- |
| Hosting | Cloudflare **Workers with static assets** (not Pages — see [ADR 0001](docs/adr/0001-cloudflare-workers-not-pages.md)) |
| App | Vite 7 · React 19 · TypeScript (strict) · Tailwind v4 (CSS-first) · shadcn/ui (new-york) |
| Lint/format | Biome (single tool, root `biome.jsonc`) |
| Tests | Vitest 4 + Testing Library (jsdom) |
| Infra | Pulumi **Go** — Cloudflare zone, DNS (Google Workspace mail), Worker custom domains |
| CI/CD | GitHub Actions — PR checks + preview alias, deploy on merge to `main` |
| Node / pnpm | Node 22 (`.nvmrc`) · pnpm 10 (workspace, `site` package only) |

## Layout

```
site/            the deployable unit (Vite SPA + Worker entrypoint)
  worker/        Worker: www→apex 301, /api/* seam, static-asset passthrough
  src/           React app (single route, no router yet)
  public/        robots.txt, sitemap.xml, favicon, og.png
infra/           Pulumi Go — zone / DNS / Worker custom domains
docs/adr/        architecture decision records
```

## Commands

```bash
nvm use                 # Node 22
pnpm install            # once, from the repo root

pnpm dev                # vite dev server (localhost:5173)
pnpm build              # vite build → site/dist
pnpm typecheck          # tsc, app + worker
pnpm test               # vitest run
pnpm lint               # biome check .   (biome lints + formats)
pnpm lint:fix           # biome check --write .
```

Inside `site/` the same scripts exist, plus the Cloudflare ones:

```bash
pnpm cf:dev             # wrangler dev — runs the real Worker + assets locally
pnpm cf:deploy          # pnpm build && wrangler deploy  (needs CLOUDFLARE_API_TOKEN)
pnpm cf:versions        # wrangler versions list
```

## Deploying

Merges to `main` deploy production via GitHub Actions. PRs get a preview URL
(`https://pr-<n>-gtmx-agents-site.<subdomain>.workers.dev`) posted as a comment.
DNS and the custom-domain attachment are Pulumi's job, not wrangler's — see
[ADR 0002](docs/adr/0002-wrangler-owns-worker-pulumi-owns-dns.md) before touching either.
