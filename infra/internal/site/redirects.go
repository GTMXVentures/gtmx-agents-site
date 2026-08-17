package site

import (
	"fmt"

	"github.com/pulumi/pulumi-cloudflare/sdk/v6/go/cloudflare"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// NewRedirects creates the zone's Single Redirect ruleset. Today it holds one
// rule: www → apex, 301.
//
// # Why this is here and not in the Worker
//
// site/worker/index.ts has a www→apex branch, and it is not enough on its own.
// With `assets.run_worker_first: ["/api/*"]` plus
// `not_found_handling: single-page-application`, Cloudflare's asset server
// answers document requests before the Worker is ever invoked — every path
// resolves to index.html, so there are no asset misses to fall through. Measured
// 2026-08-17: `https://www.gtmxagents.com/pricing` returned a 200 page, and only
// `www…/api/*` (the one prefix that does run the Worker first) actually
// redirected.
//
// The alternative fix was widening run_worker_first to `["/*", "!/assets/*"]`,
// which buys a Worker invocation on every page view to move a byte-identical
// 301. A redirect rule runs at the edge before any of that, costs nothing, and
// puts host canonicalization in the same place as the rest of "where traffic
// goes" (ADR 0002). The Worker branch stays as defence in depth — it is what
// makes `wrangler dev` behave like production.
//
// # Not gated on attachWorkerDomain
//
// Unlike domains.go, this does not wait for the Worker to exist. The rule only
// matches requests whose Host is www.gtmxagents.com, and nothing resolves that
// hostname until the www custom domain is attached, so an early rule is inert
// rather than wrong. Creating it up front also means the very first request that
// can reach www is already canonicalized — no window where search engines can
// index the www host.
//
// # One ruleset per phase
//
// A zone may have exactly ONE `http_request_dynamic_redirect` ruleset. Every
// future redirect (vanity paths, campaign short links, a retired URL) must be
// added to the Rules array below — a second cloudflare.Ruleset in this phase
// will fail against the API, and creating one by hand in the dashboard will be
// overwritten by the next `pulumi up`.
//
// Docs: https://developers.cloudflare.com/rules/url-forwarding/single-redirects/
func NewRedirects(ctx *pulumi.Context, s *Settings, zone *cloudflare.Zone) error {
	wwwHost := s.fqdn("www")

	// Exact host match, not a `starts_with "www."` test: a prefix match would
	// also catch preview hostnames and any future www-prefixed subdomain, and
	// bounce them to the apex.
	expression := fmt.Sprintf("http.host eq %q", wwwHost)

	// The target is an *expression*, not a static value, because the path has to
	// survive the redirect: /pricing must land on apex/pricing, not on the apex
	// root. The query string is preserved by PreserveQueryString rather than by
	// concatenating http.request.uri.query — the flag omits the "?" correctly
	// when there is no query, which hand-built concatenation does not.
	targetURL := fmt.Sprintf("concat(\"https://%s\", http.request.uri.path)", s.ZoneName)

	_, err := cloudflare.NewRuleset(ctx, "redirects", &cloudflare.RulesetArgs{
		ZoneId: zone.ID(),
		// "zone" (not "root"): this ruleset is entry-pointed by the zone-level
		// dynamic redirect phase.
		Kind:        pulumi.String("zone"),
		Phase:       pulumi.String("http_request_dynamic_redirect"),
		Name:        pulumi.String(s.ZoneName + " redirects"),
		Description: pulumi.String("Single Redirects for " + s.ZoneName + " — managed by Pulumi (infra/internal/site/redirects.go)"),
		Rules: cloudflare.RulesetRuleArray{
			cloudflare.RulesetRuleArgs{
				Action:      pulumi.String("redirect"),
				Description: pulumi.String("www to apex (canonical host)"),
				Enabled:     pulumi.Bool(true),
				Expression:  pulumi.String(expression),
				ActionParameters: cloudflare.RulesetRuleActionParametersArgs{
					FromValue: cloudflare.RulesetRuleActionParametersFromValueArgs{
						// 301, matching the Worker branch: the canonical host is
						// a settled decision and link equity should collapse onto
						// the apex. A 301 drops method and body, which is fine
						// for a GET-only site; if /api/* ever accepts POSTs on
						// www, this and the Worker both move to 308.
						StatusCode:          pulumi.Int(301),
						PreserveQueryString: pulumi.Bool(true),
						TargetUrl: cloudflare.RulesetRuleActionParametersFromValueTargetUrlArgs{
							Expression: pulumi.String(targetURL),
						},
					},
				},
			},
		},
	}, s.opts()...)

	return err
}
