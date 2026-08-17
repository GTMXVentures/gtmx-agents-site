package main

import (
	"github.com/GTMXVentures/gtmx-agents-site/infra/internal/site"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// This program owns "where traffic goes" for gtmxagents.com — the zone, its DNS
// records, and the hostname→Worker attachment. It deliberately does NOT own
// "what runs": the Worker script and its static assets are deployed by wrangler
// from site/ (see docs/adr/0002-wrangler-owns-worker-pulumi-owns-dns.md). Adding
// a WorkersScript resource here would fight wrangler on every deploy.
func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		s, err := site.LoadSettings(ctx)
		if err != nil {
			return err
		}

		zone, err := site.NewZone(ctx, s)
		if err != nil {
			return err
		}

		if err := site.NewDNS(ctx, s, zone); err != nil {
			return err
		}

		if err := site.NewZoneSettings(ctx, s, zone); err != nil {
			return err
		}

		// Deliberately not gated on attachWorkerDomain: the rule only matches
		// the www host, which does not resolve until that attachment happens,
		// so it is inert until the moment it is needed. See redirects.go.
		if err := site.NewRedirects(ctx, s, zone); err != nil {
			return err
		}

		if err := site.NewDomains(ctx, s, zone); err != nil {
			return err
		}

		// nameServers is the output step 4 of the rollout needs: it is pasted
		// into Hostinger as the custom nameservers for the domain. zoneStatus
		// stays "pending" until Cloudflare sees that delegation, then flips to
		// "active" on the next `pulumi refresh`.
		ctx.Export("nameServers", zone.NameServers)
		ctx.Export("zoneStatus", zone.Status)
		ctx.Export("zoneId", zone.ID())
		ctx.Export("siteUrl", pulumi.String("https://"+s.ZoneName))
		ctx.Export("customDomainsAttached", pulumi.Bool(s.AttachWorkerDomain))
		return nil
	})
}
