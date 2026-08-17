# infra — Cloudflare for gtmxagents.com

Pulumi (Go) program that owns **where traffic goes** for `gtmxagents.com`: the
zone, its DNS records, two zone settings, the `www`→apex redirect, and the
apex/`www` attachment to the Worker.

It does **not** own **what runs**. The Worker script and its static assets are
deployed by `wrangler` from [`../site`](../site) — see
`docs/adr/0002-wrangler-owns-worker-pulumi-owns-dns.md`. There is deliberately no
`WorkersScript` resource here, and no `DnsRecord` for the apex or `www`.

| File | Owns |
|---|---|
| `main.go` | wiring + stack outputs |
| `internal/site/config.go` | stack config, validation, explicit Cloudflare provider |
| `internal/site/zone.go` | the (imported, protected) zone |
| `internal/site/dns.go` | MX / SPF / DMARC / DKIM / site-verification |
| `internal/site/settings.go` | `alwaysUseHttps`, `minTlsVersion` |
| `internal/site/redirects.go` | Single Redirect ruleset — `www` → apex, 301 |
| `internal/site/domains.go` | apex + `www` Workers custom domains |

SDKs: `pulumi/sdk/v3` and `pulumi-cloudflare/sdk/v6` (provider v6 renamed
`Record` → `DnsRecord` and nests the zone's account under an `account { id }`
object; the pre-v6 flat spellings will not compile).

---

## First-time setup

Requires an API token with **Zone:Edit, DNS:Edit, Zone Settings:Edit, Workers
Scripts:Read, Account Settings:Read** (token "A", `pulumi-gtmxagents`). The CI
deploy token is a *different*, narrower token and cannot run this program.

```bash
cd infra
pulumi stack init prod

# Credential. Read explicitly from config — an ambient CLOUDFLARE_API_TOKEN in
# the shell is NOT picked up, on purpose (see LoadSettings' doc comment).
pulumi config set --secret cloudflare:apiToken <token-A>

pulumi config set gtmxsite:accountId  <cloudflare-account-id>
pulumi config set gtmxsite:zoneName   gtmxagents.com
pulumi config set gtmxsite:workerName gtmx-agents-site      # optional; this is the default
pulumi config set gtmxsite:attachWorkerDomain false         # optional; false is the default
```

### Import the existing zone — before the first `up`

The zone was created in the Cloudflare dashboard, so Pulumi adopts it rather than
creating it. Grab `<zoneId>` from the zone's dashboard **Overview** page (bottom
right), then:

```bash
pulumi import cloudflare:index/zone:Zone gtmxagents-com <zoneId>
```

The resource name `gtmxagents-com` is not arbitrary — it is `zoneName` with dots
replaced by dashes, and it must match or the import lands on the wrong URN.
Skipping this step makes `pulumi up` attempt to *create* the zone and fail with a
duplicate-zone error from the API.

The zone carries `pulumi.Protect(true)`: `pulumi destroy` will refuse until
someone runs `pulumi state unprotect` on it. Deleting a zone deletes its DNS,
and with it the domain's mail.

### First apply

```bash
pulumi up          # MX + SPF + DMARC, the two zone settings, the redirect ruleset
pulumi stack output nameServers
```

Paste those nameservers into **Hostinger** as the domain's custom nameservers,
then poll until Cloudflare notices the delegation:

```bash
dig +short NS gtmxagents.com @1.1.1.1
pulumi refresh && pulumi stack output zoneStatus   # pending → active
```

---

## Config keys

| Key | Required | Default | Notes |
|---|---|---|---|
| `cloudflare:apiToken` | yes (secret) | — | token A; set with `--secret` |
| `gtmxsite:accountId` | yes | — | Cloudflare account owning zone + Worker |
| `gtmxsite:zoneName` | yes | — | apex domain, e.g. `gtmxagents.com` |
| `gtmxsite:workerName` | no | `gtmx-agents-site` | must match `name` in `site/wrangler.jsonc` |
| `gtmxsite:attachWorkerDomain` | no | `false` | see below |
| `gtmxsite:googleSiteVerification` | no | unset | email phase; record omitted while unset |
| `gtmxsite:dkimSelector` | no | `google` | only changeable at key-generation time |
| `gtmxsite:dkimPublicKey` | no | unset | email phase; record omitted while unset |
| `gtmxsite:dmarcRua` | no | unset | e.g. `mailto:dmarc@gtmxventures.com` |

Every email-phase key is optional so the stack is applyable end-to-end before
Google Workspace has been touched. A DKIM or verification record that exists but
is wrong is worse than one that does not exist yet.

---

## Turning the site on: `attachWorkerDomain`

A Workers Custom Domain can only attach to a Worker script that already exists,
and the script is published by wrangler, not by Pulumi. So the order is fixed:

```bash
# 1. publish the script first (from the repo root)
cd site && pnpm build && pnpm wrangler deploy

# 2. then attach both hostnames — exactly two creates
cd ../infra
pulumi config set gtmxsite:attachWorkerDomain true
pulumi up
```

Cloudflare creates the proxied DNS records **and** issues the edge certificate as
part of the attach; the cert lands 1–15 minutes later, so HTTPS to the apex can
fail briefly after a successful `up`. This is why nothing in `dns.go` declares an
A/AAAA/CNAME for the apex or `www` — two owners for one record is a permanently
dirty preview.

Setting the flag back to `false` detaches both hostnames and takes the site
offline. That is the rollback, not a no-op.

---

## Email phase

After the domain alias is added in Google Admin (Account → Domains → Manage
domains → Add a domain alias):

```bash
pulumi config set gtmxsite:googleSiteVerification google-site-verification=<token>
pulumi up      # then click Verify in Google Admin
```

Then generate DKIM (Apps → Gmail → Authenticate email):

```bash
pulumi config set gtmxsite:dkimPublicKey <value from Google Admin>
pulumi config set gtmxsite:dmarcRua mailto:dmarc@gtmxventures.com
pulumi up
```

DMARC ships at `p=none` (monitor only). Ramp it to `p=quarantine` and then
`p=reject` after 2–4 weeks of clean aggregate reports, tightening SPF from `~all`
to `-all` at the same time. Both changes are one-line edits in `dns.go`.

---

## Verification

```bash
cd infra && go vet ./... && go build ./...      # what CI runs

pulumi refresh --yes && pulumi preview          # must say "no changes"

dig +short NS   gtmxagents.com @1.1.1.1
dig +short MX   gtmxagents.com @1.1.1.1         # 1 smtp.google.com
dig +short TXT  gtmxagents.com @1.1.1.1         # v=spf1 ...
dig +short TXT _dmarc.gtmxagents.com @1.1.1.1   # v=DMARC1; p=none

# host canonicalization — must be a 301 for DOCUMENT paths, not just /api/*
curl -sI https://www.gtmxagents.com/pricing | head -2   # 301 → https://gtmxagents.com/pricing
```

A 200 there instead of a 301 means the redirect ruleset is missing or disabled:
the Worker's own www→apex branch does not fire for document requests (see
`redirects.go`), so it will not cover for it.

A **recurring** diff on an otherwise untouched stack always means an ownership
conflict, and it is almost always one of two things:

1. **TXT quoting.** The Cloudflare API stores TXT content wrapped in literal
   double quotes. Every TXT value here goes through the `txt()` helper in
   `dns.go` for exactly that reason — a raw string round-trips as a phantom diff
   forever.
2. **A `DnsRecord` colliding with a Workers Custom Domain.** Never declare a
   record for the apex or `www`.
3. **A redirect rule created by hand in the dashboard.** A zone allows exactly
   one `http_request_dynamic_redirect` ruleset, and `redirects.go` owns it — a
   dashboard rule shows up as a diff and is removed by the next `pulumi up`. Add
   redirects to the `Rules` array in that file instead.
