# AGENTS.md

Short version for any agent or human landing in this repo. Full orientation, the repo map,
and the Cloudflare ownership rules are in [CLAUDE.md](CLAUDE.md) — read it before touching
`site/wrangler.jsonc`, `infra/`, or DNS.

## Ground rules

1. **pnpm only.** Node 22 (`nvm use`). Install from the repo root: `pnpm install`.
   Never `npm install` / `yarn` — a stray lockfile breaks CI's `--frozen-lockfile`.
2. **Biome is the only linter and formatter.** Run `pnpm lint` (or `pnpm lint:fix`) before
   handing work back. No ESLint/Prettier configs.
3. **Green before done**: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
4. **Conventional Commits, always scoped**:
   `feat(site): add waitlist form` · `fix(worker): 301 www before asset lookup` ·
   `infra(dns): add Google DKIM TXT` · `chore(ci): cache pnpm store` · `docs(adr): ...`
5. **PR body = Summary + Test plan.** One logical change per PR.
6. **Ownership**: wrangler owns the Worker script + assets; Pulumi owns zone/DNS/domain
   attachment. Never cross that line (see [ADR 0002](docs/adr/0002-wrangler-owns-worker-pulumi-owns-dns.md)).
7. **Comment the non-obvious.** Config lines get a why-comment; decisions get an ADR.
8. Don't commit `og.png`-class binaries without checking `site/public/README.md` first, and
   never commit secrets — Cloudflare tokens live in GitHub Actions secrets, Pulumi secrets in
   the stack config.
