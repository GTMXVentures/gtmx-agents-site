// Package site declares the Cloudflare-side infrastructure for gtmxagents.com:
// the (imported) zone, its DNS records, a couple of zone settings, and the
// apex/www Workers custom domains. One file per resource concern.
package site

import (
	"fmt"
	"strings"

	"github.com/pulumi/pulumi-cloudflare/sdk/v6/go/cloudflare"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi/config"
)

const (
	// Config namespace for everything this program reads, so stack config never
	// collides with the `cloudflare:` namespace the provider owns.
	namespace = "gtmxsite"

	defaultWorkerName = "gtmx-agents-site"

	// Google Workspace's DKIM UI defaults to the selector "google". It is only
	// configurable at key-generation time, so it lives in config rather than
	// being hardcoded — but nobody has ever needed to change it.
	defaultDkimSelector = "google"
)

// Settings is the fully-resolved, validated stack configuration plus the
// explicit Cloudflare provider every resource in this package is pinned to.
type Settings struct {
	// AccountID is the Cloudflare account that owns the zone and the Worker.
	AccountID string
	// ZoneName is the apex domain, e.g. "gtmxagents.com".
	ZoneName string
	// WorkerName is the wrangler `name` from site/wrangler.jsonc. The custom
	// domains route to this script, so a rename there is a rename here.
	WorkerName string
	// AttachWorkerDomain gates the apex/www custom domains. See domains.go for
	// why this is a flag and not just always-on.
	AttachWorkerDomain bool

	// The four fields below are the email phase (rollout step 9). Each DNS
	// record they drive is created only once its key is set, so the stack is
	// applyable end-to-end before Google Workspace has been touched at all.
	GoogleSiteVerification string
	DkimSelector           string
	DkimPublicKey          string
	DmarcRua               string

	// Provider is an explicitly-constructed Cloudflare provider rather than the
	// implicit default one. See LoadSettings for why.
	Provider *cloudflare.Provider
}

// LoadSettings reads and validates stack config, then builds the Cloudflare
// provider.
//
// The provider is constructed explicitly from `cloudflare:apiToken` instead of
// letting Pulumi fall back to the ambient CLOUDFLARE_API_TOKEN / CLOUDFLARE_API_KEY
// environment variables. That fallback is the failure mode worth designing out:
// with an env var in the shell, `pulumi up` silently succeeds against whatever
// credential happens to be exported — possibly the CI deploy token (which has no
// DNS write scope) or a personal token on a different account. Requiring the
// token to come from stack config means a missing/wrong credential fails fast at
// config-read time with a named key, and the credential in use is the same one
// for every operator of the stack.
//
//	pulumi config set --secret cloudflare:apiToken <token-A>
func LoadSettings(ctx *pulumi.Context) (*Settings, error) {
	cfg := config.New(ctx, namespace)

	s := &Settings{
		AccountID:              cfg.Require("accountId"),
		ZoneName:               cfg.Require("zoneName"),
		WorkerName:             cfg.Get("workerName"),
		AttachWorkerDomain:     cfg.GetBool("attachWorkerDomain"),
		GoogleSiteVerification: cfg.Get("googleSiteVerification"),
		DkimSelector:           cfg.Get("dkimSelector"),
		DkimPublicKey:          cfg.Get("dkimPublicKey"),
		DmarcRua:               cfg.Get("dmarcRua"),
	}

	if s.WorkerName == "" {
		s.WorkerName = defaultWorkerName
	}
	if s.DkimSelector == "" {
		s.DkimSelector = defaultDkimSelector
	}

	// A zone is an apex domain. Catching "www.gtmxagents.com" or a stray
	// trailing dot here is cheaper than catching it as a confusing 400 from the
	// Cloudflare API halfway through an update.
	s.ZoneName = strings.TrimSuffix(strings.ToLower(strings.TrimSpace(s.ZoneName)), ".")
	if !strings.Contains(s.ZoneName, ".") || strings.HasPrefix(s.ZoneName, ".") {
		return nil, fmt.Errorf("%s:zoneName must be an apex domain like gtmxagents.com, got %q", namespace, s.ZoneName)
	}

	provider, err := cloudflare.NewProvider(ctx, "cloudflare", &cloudflare.ProviderArgs{
		ApiToken: config.New(ctx, "cloudflare").RequireSecret("apiToken"),
	})
	if err != nil {
		return nil, err
	}
	s.Provider = provider

	return s, nil
}

// opts prefixes the explicit provider onto a resource's options. Every resource
// in this package goes through it — a resource that forgets it would quietly
// use the default provider and its ambient-env credentials, which is exactly
// the fallback LoadSettings exists to prevent.
func (s *Settings) opts(extra ...pulumi.ResourceOption) []pulumi.ResourceOption {
	return append([]pulumi.ResourceOption{pulumi.Provider(s.Provider)}, extra...)
}

// fqdn returns a fully-qualified record name for a label under the zone, or the
// zone apex itself when label is empty.
//
// Everything here is written fully-qualified on purpose. Cloudflare's API always
// returns record names as FQDNs, so declaring "@" or a bare "_dmarc" leaves the
// state and the remote in a shape Pulumi re-diffs on every preview.
func (s *Settings) fqdn(label string) string {
	if label == "" {
		return s.ZoneName
	}
	return label + "." + s.ZoneName
}
