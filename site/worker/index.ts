/**
 * Cloudflare Worker entrypoint for gtmxagents.com.
 *
 * Three jobs, in this order:
 *   1. Canonicalise www → apex with a 301.
 *   2. Answer /api/* itself (JSON, never HTML) — the seam for /api/waitlist.
 *   3. Hand everything else to the static-asset server (env.ASSETS).
 *
 * Why the Worker runs at all for a static site: `assets.run_worker_first` in
 * wrangler.jsonc is set to ["/api/*"], so Cloudflare only invokes this script
 * for API paths and for asset misses. Static hits never reach here — that is
 * what keeps them unmetered. If you ever see this code run for /favicon.svg,
 * run_worker_first has been broken (e.g. set to `true`).
 */

export interface Env {
	/** Static assets from ./dist, bound in wrangler.jsonc as `ASSETS`. */
	ASSETS: Fetcher;
}

/**
 * Canonical host. Both the apex and www are attached as Worker Custom Domains
 * by Pulumi (infra/), which is why the redirect lives here in code rather than
 * in a Cloudflare Redirect Rule: with both hostnames pointing at this Worker,
 * one branch is cheaper and more visible than a dashboard rule nobody reads.
 */
const APEX_HOST = "gtmxagents.com";
const WWW_HOST = "www.gtmxagents.com";

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		// --- 1. www → apex ------------------------------------------------------
		// Exact-match on the www host only. A blanket "starts with www." would also
		// rewrite workers.dev preview hostnames and break PR previews.
		//
		// NOTE: this branch is DEFENCE IN DEPTH, not the primary redirect. With
		// `assets.run_worker_first: ["/api/*"]`, document requests are answered by
		// the asset server without invoking this Worker, so this branch only ever
		// fires for `www…/api/*`. The real www→apex canonicalisation is a
		// Cloudflare Single Redirect rule owned by Pulumi
		// (infra/internal/site/redirects.go) — zero Worker invocations, applied at
		// the zone edge before routing. See docs/adr/0002 for why it lives there.
		// Keep this branch anyway: it makes `wrangler dev` match production for
		// /api/* and guards against the ruleset being deleted out-of-band.
		if (url.hostname === WWW_HOST) {
			url.hostname = APEX_HOST;
			// 301 (permanent): the canonical host is a settled decision, and search
			// engines should collapse link equity onto the apex. Method and body are
			// dropped by a 301 — fine here, the site is GET-only today. If /api/*
			// ever accepts POSTs on www, switch to 308 to preserve the method.
			return Response.redirect(url.toString(), 301);
		}

		// --- 2. /api/* seam -----------------------------------------------------
		// There is no API yet. The contract is nonetheless established now: every
		// /api/* response is JSON, so the future frontend fetch() can parse
		// failures without sniffing content types.
		//
		// This branch is also the canonical test for the assets config: curl
		// /api/waitlist and you must get this JSON 404. Getting HTML back means
		// the asset server answered first — i.e. run_worker_first no longer
		// matches /api/*.
		//
		// TODO(waitlist): add `if (url.pathname === "/api/waitlist" && request.method === "POST")`
		// here — validate, persist (KV/D1/webhook), return 202. Keep it inside this
		// prefix so run_worker_first keeps routing it.
		if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
			return Response.json(
				{ error: "not_found", message: `No API route for ${url.pathname}` },
				{
					status: 404,
					// Never let a CDN or browser cache a route we are about to implement.
					headers: { "cache-control": "no-store" },
				},
			);
		}

		// --- 3. static assets ---------------------------------------------------
		// ASSETS applies its own caching (immutable for hashed /assets/*, revalidated
		// for index.html) and the SPA fallback from `not_found_handling`. Pass the
		// original request through unchanged so conditional requests (If-None-Match)
		// still get 304s.
		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<Env>;
