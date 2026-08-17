package site

import (
	"strings"

	"github.com/pulumi/pulumi-cloudflare/sdk/v6/go/cloudflare"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// Email records get a long, explicit TTL. Cloudflare's "auto" (ttl=1) is a
// 300s TTL that buys nothing for records that change once a year, and a
// short TTL on MX is actively unhelpful during a mail cutover because it
// invites resolvers to re-fetch a half-propagated state.
const mailTTL = 3600

// recordComment is stamped on every record so anyone looking at the Cloudflare
// dashboard knows edits there will be reverted by the next `pulumi up`.
const recordComment = "Managed by Pulumi — infra/internal/site/dns.go"

// NewDNS creates the records this program owns: mail (MX/SPF/DKIM/DMARC) and
// domain-ownership verification.
//
// Note what is NOT here: no A/AAAA/CNAME for the apex or www. Those are created
// and owned by the Workers custom domains in domains.go — see the ownership note
// there. Adding them here is the single most likely way to produce a permanently
// dirty `pulumi preview`.
func NewDNS(ctx *pulumi.Context, s *Settings, zone *cloudflare.Zone) error {
	// Google Workspace's current guidance is one MX host, smtp.google.com, at
	// priority 1 — not the legacy five-record ASPMX.L.GOOGLE.COM / ALT1..ALT4
	// set. The five-record form still works, but Google now load-balances behind
	// the single name, so the extra records are redundant DNS surface that
	// drifts out of date. New domains should use the modern form.
	// https://support.google.com/a/answer/140034
	_, err := cloudflare.NewDnsRecord(ctx, "mx-google", &cloudflare.DnsRecordArgs{
		ZoneId:   zone.ID(),
		Name:     pulumi.String(s.fqdn("")),
		Type:     pulumi.String("MX"),
		Content:  pulumi.String("smtp.google.com"),
		Priority: pulumi.Float64(1),
		Ttl:      pulumi.Float64(mailTTL),
		Comment:  pulumi.String(recordComment),
	}, s.opts()...)
	if err != nil {
		return err
	}

	// SPF. `~all` (softfail) rather than `-all` (hardfail) at launch: until
	// DMARC reports have confirmed that nothing legitimate sends as
	// @gtmxagents.com from outside Google (a helpdesk, a billing provider, a
	// marketing tool someone wires up next month), a hardfail turns an
	// unnoticed misconfiguration into silently bounced mail. Tighten to `-all`
	// at the same time DMARC goes to p=reject, once the reports are clean.
	// https://support.google.com/a/answer/33786
	_, err = cloudflare.NewDnsRecord(ctx, "txt-spf", &cloudflare.DnsRecordArgs{
		ZoneId:  zone.ID(),
		Name:    pulumi.String(s.fqdn("")),
		Type:    pulumi.String("TXT"),
		Content: pulumi.String(txt("v=spf1 include:_spf.google.com ~all")),
		Ttl:     pulumi.Float64(mailTTL),
		Comment: pulumi.String(recordComment),
	}, s.opts()...)
	if err != nil {
		return err
	}

	// DMARC starts at p=none: monitor only, nothing is rejected. That is the
	// deliberate first rung of the standard ramp —
	//   p=none (2–4 wks, read the aggregate reports)
	//     → p=quarantine (suspicious mail to spam)
	//       → p=reject (forged mail refused outright).
	// Starting at p=reject on a domain whose sending patterns nobody has
	// observed yet is how legitimate mail disappears without a bounce anyone
	// sees. The rua= address is where those aggregate reports go; without it,
	// p=none collects no evidence and the ramp can never be justified — so set
	// gtmxsite:dmarcRua as soon as there is a mailbox to receive them.
	// https://datatracker.ietf.org/doc/html/rfc7489#section-6.3
	dmarc := "v=DMARC1; p=none"
	if s.DmarcRua != "" {
		dmarc += "; rua=" + s.DmarcRua
	}
	_, err = cloudflare.NewDnsRecord(ctx, "txt-dmarc", &cloudflare.DnsRecordArgs{
		ZoneId:  zone.ID(),
		Name:    pulumi.String(s.fqdn("_dmarc")),
		Type:    pulumi.String("TXT"),
		Content: pulumi.String(txt(dmarc)),
		Ttl:     pulumi.Float64(mailTTL),
		Comment: pulumi.String(recordComment),
	}, s.opts()...)
	if err != nil {
		return err
	}

	// DKIM, gated: the key does not exist until someone generates it in Google
	// Admin → Apps → Gmail → Authenticate email, which happens after the domain
	// alias is verified. Publishing an empty or placeholder DKIM record in the
	// meantime is worse than publishing none — receivers treat a present-but-
	// broken selector as a signing failure.
	if s.DkimPublicKey != "" {
		// Google Admin displays the whole record value ("v=DKIM1; k=rsa;
		// p=MIIB..."), but it is just as natural to paste only the p= blob, so
		// accept either.
		value := s.DkimPublicKey
		if !strings.HasPrefix(value, "v=DKIM1") {
			value = "v=DKIM1; k=rsa; p=" + value
		}
		// A 2048-bit key exceeds the 255-byte limit on a single TXT character-
		// string. Cloudflare accepts the long value and chunks it on serve; if
		// the API ever rejects it, split manually into adjacent quoted strings:
		// "v=DKIM1; k=rsa; p=firsthalf" "secondhalf".
		_, err = cloudflare.NewDnsRecord(ctx, "txt-dkim", &cloudflare.DnsRecordArgs{
			ZoneId:  zone.ID(),
			Name:    pulumi.String(s.fqdn(s.DkimSelector + "._domainkey")),
			Type:    pulumi.String("TXT"),
			Content: pulumi.String(txt(value)),
			Ttl:     pulumi.Float64(mailTTL),
			Comment: pulumi.String(recordComment),
		}, s.opts()...)
		if err != nil {
			return err
		}
	}

	// Domain-ownership proof for adding gtmxagents.com as a domain alias of the
	// gtmxventures.com Workspace. Gated the same way, and for the same reason:
	// the token is only issued once the alias is being added in Google Admin.
	// Google's own instructions say to leave this record in place permanently —
	// removing it can un-verify the domain later.
	if s.GoogleSiteVerification != "" {
		value := s.GoogleSiteVerification
		// The Admin console hands over the whole "google-site-verification=..."
		// string; tolerate a paste of just the token.
		if !strings.HasPrefix(value, "google-site-verification=") {
			value = "google-site-verification=" + value
		}
		_, err = cloudflare.NewDnsRecord(ctx, "txt-google-site-verification", &cloudflare.DnsRecordArgs{
			ZoneId:  zone.ID(),
			Name:    pulumi.String(s.fqdn("")),
			Type:    pulumi.String("TXT"),
			Content: pulumi.String(txt(value)),
			Ttl:     pulumi.Float64(mailTTL),
			Comment: pulumi.String(recordComment),
		}, s.opts()...)
		if err != nil {
			return err
		}
	}

	return nil
}

// txt wraps a TXT payload in the literal double quotes the Cloudflare API stores
// and returns.
//
// This is the known drift trap: submit `v=spf1 ...` unquoted and the API stores
// `"v=spf1 ..."`, so every subsequent `pulumi preview` shows the same phantom
// diff on content and every `pulumi up` performs the same no-op update. The
// quotes are part of the value in the v5+/v6 provider — they belong in the
// declaration, not just in the response.
func txt(value string) string {
	return `"` + value + `"`
}
