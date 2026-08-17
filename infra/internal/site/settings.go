package site

import (
	"github.com/pulumi/pulumi-cloudflare/sdk/v6/go/cloudflare"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// NewZoneSettings pins the two zone-level knobs that are load-bearing for a
// site served entirely over HTTPS.
//
// Neither is exotic — both are two clicks in the dashboard (SSL/TLS → Edge
// Certificates) — and the stack works without them. They are codified anyway
// because they are security posture, and posture that lives only in a dashboard
// is posture nobody can review in a diff. If either ever becomes awkward to
// manage here (the provider models zone settings one resource per setting, and
// the value is an untyped `pulumi.Input`), deleting this file is a safe
// downgrade: re-set them by hand and note it in the README.
//
// One v6 sharpness worth recording: the provider's setting IDs are camelCase
// (`alwaysUseHttps`, `minTlsVersion`), not the snake_case spelling used in
// Cloudflare's own REST API docs (`always_use_https`, `min_tls_version`).
// Passing the snake_case form fails at apply time with an unhelpful error.
//
// Docs: https://developers.cloudflare.com/api/resources/zones/subresources/settings/
func NewZoneSettings(ctx *pulumi.Context, s *Settings, zone *cloudflare.Zone) error {
	// 301s plain http:// to https://. Without it the apex answers on port 80
	// with real content, which means any link that drops the scheme is a
	// downgrade waiting to be intercepted.
	_, err := cloudflare.NewZoneSetting(ctx, "always-use-https", &cloudflare.ZoneSettingArgs{
		ZoneId:    zone.ID(),
		SettingId: pulumi.String("alwaysUseHttps"),
		Value:     pulumi.String("on"),
	}, s.opts()...)
	if err != nil {
		return err
	}

	// Cloudflare's default floor is TLS 1.0. Nothing that will ever load this
	// landing page needs it, and 1.0/1.1 are deprecated (RFC 8996). 1.2 rather
	// than 1.3 because 1.3-only still excludes a long tail of corporate
	// middleboxes — the audience here includes people behind exactly those.
	_, err = cloudflare.NewZoneSetting(ctx, "min-tls-version", &cloudflare.ZoneSettingArgs{
		ZoneId:    zone.ID(),
		SettingId: pulumi.String("minTlsVersion"),
		Value:     pulumi.String("1.2"),
	}, s.opts()...)
	if err != nil {
		return err
	}

	return nil
}
