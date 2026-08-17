package site

import (
	"strings"

	"github.com/pulumi/pulumi-cloudflare/sdk/v6/go/cloudflare"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// NewZone declares the gtmxagents.com zone.
//
// The zone ALREADY EXISTS — it was added in the Cloudflare dashboard before this
// program was written — so this resource is adopted, never created. Run the
// import once, on a fresh stack, before the first `pulumi up`:
//
//	pulumi import cloudflare:index/zone:Zone gtmxagents-com <zoneId>
//
// (The resource name is the zone name with dots swapped for dashes, so for
// gtmxagents.com it is exactly `gtmxagents-com` as written above. Find <zoneId>
// on the zone's dashboard Overview page, bottom right.)
//
// Skipping the import makes `pulumi up` try to CREATE the zone, which fails with
// a duplicate-zone error from the API — noisy but harmless. The genuinely
// dangerous direction is deletion, which is what Protect guards: destroying a
// zone takes its DNS with it, and the domain's mail with that. `pulumi destroy`
// on this stack will refuse until someone deliberately runs
// `pulumi state unprotect`.
//
// Docs: https://developers.cloudflare.com/api/resources/zones/methods/create/
func NewZone(ctx *pulumi.Context, s *Settings) (*cloudflare.Zone, error) {
	return cloudflare.NewZone(ctx, zoneResourceName(s), &cloudflare.ZoneArgs{
		// v6 nests the account under an object with a single `id` field; the
		// flat `accountId` argument was a v5-and-earlier shape.
		Account: cloudflare.ZoneAccountArgs{
			Id: pulumi.String(s.AccountID),
		},
		Name: pulumi.String(s.ZoneName),
		// "full" = Cloudflare is authoritative for the domain (registrar points
		// its nameservers here). "partial"/CNAME setup is a Business-plan
		// feature and would not give us the free zone-level TLS and settings.
		Type: pulumi.String("full"),
	}, s.opts(pulumi.Protect(true))...)
}

// zoneResourceName is the Pulumi logical name for the zone. It has to be stable
// forever — it is baked into the `pulumi import` command above and into stack
// state — so it is derived from the zone name and nothing else.
func zoneResourceName(s *Settings) string {
	return strings.ReplaceAll(s.ZoneName, ".", "-")
}
