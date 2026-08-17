package site

import (
	"github.com/pulumi/pulumi-cloudflare/sdk/v6/go/cloudflare"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// NewDomains attaches the apex and www hostnames to the Worker.
//
// # Ownership rule
//
// A Workers Custom Domain is not just a route: Cloudflare creates the underlying
// proxied DNS record AND issues the edge certificate for the hostname as part of
// attaching it. That is why there is deliberately NO DnsRecord for the apex or
// for www anywhere in this program. Declaring one alongside a custom domain
// means two owners for one name — Pulumi rewrites the record, Cloudflare
// rewrites it back, and `pulumi preview` never comes back clean again. If the
// apex ever needs to stop pointing at the Worker, delete the custom domain
// first; do not race it with an A record.
//
// # Chicken-and-egg
//
// The attach fails if the Worker script does not exist yet — Cloudflare has
// nothing to route to. But the script is deployed by wrangler from site/, not by
// Pulumi (ADR 0002), and on a brand-new repo that deploy has not happened. So
// the attach is gated behind a flag instead of being unconditional:
//
//	# 1. first deploy publishes the script
//	cd site && pnpm build && pnpm wrangler deploy
//	# 2. now the hostnames have something to point at
//	cd infra && pulumi config set gtmxsite:attachWorkerDomain true && pulumi up
//
// Step 2 is exactly two creates. The edge certificate lands 1–15 minutes later;
// until it does, HTTPS to the apex may fail even though `pulumi up` succeeded.
//
// Flipping the flag back to false detaches both hostnames and takes the site
// offline — it is the intended rollback, not a no-op.
//
// The www→apex 301 lives in the Worker (site/worker/index.ts), which is why www
// is attached as a full custom domain rather than handled by a Redirect Rule:
// one place decides canonical host, and it is the same code path in local dev.
//
// Docs: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
func NewDomains(ctx *pulumi.Context, s *Settings, zone *cloudflare.Zone) error {
	if !s.AttachWorkerDomain {
		return nil
	}

	// A slice, not a map: map iteration order is randomised in Go, and resource
	// registration order should not vary run to run.
	domains := []struct{ name, hostname string }{
		{"apex", s.fqdn("")},
		{"www", s.fqdn("www")},
	}

	for _, d := range domains {
		_, err := cloudflare.NewWorkersCustomDomain(ctx, "domain-"+d.name, &cloudflare.WorkersCustomDomainArgs{
			AccountId: pulumi.String(s.AccountID),
			ZoneId:    zone.ID(),
			ZoneName:  pulumi.String(s.ZoneName),
			Hostname:  pulumi.String(d.hostname),
			// Must match `name` in site/wrangler.jsonc. A rename there without
			// the matching gtmxsite:workerName change detaches the site.
			Service: pulumi.String(s.WorkerName),
		}, s.opts()...)
		if err != nil {
			return err
		}
	}

	return nil
}
