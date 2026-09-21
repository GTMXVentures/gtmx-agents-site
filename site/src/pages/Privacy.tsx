import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import { Shell } from "@/components/Shell";
import { COMPANY } from "@/data/company";

/**
 * /privacy — Privacy Policy and Google API Services Limited Use disclosure.
 *
 * Designed to satisfy Google OAuth Verification and CASA requirements:
 * 1. Prominent and explicit Google API Services User Data Policy / Limited Use statement.
 * 2. Clear explanation of mailbox data access (OAuth, SMTP/IMAP via SASL XOAUTH2).
 * 3. Specific guarantees: no ads, no data broker sales, no LLM training on user email data.
 * 4. User data deletion and token revocation instructions.
 */

export default function Privacy(): ReactElement {
	const lastUpdated = "September 21, 2026";
	const contactEmail = COMPANY.email;

	return (
		<Shell current="/privacy" skipTo={{ href: "#content", label: "Skip to privacy content" }}>
			<article id="content">
				{/* ── Intro ─────────────────────────────────────────────────────── */}
				<section aria-labelledby="privacy-heading" className="border-line border-b">
					<div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-24">
						<Reveal>
							<p className="eyebrow">Legal & Compliance</p>
							<h1
								id="privacy-heading"
								className="mt-4 text-balance font-display font-bold text-[clamp(2.25rem,4.5vw,3.5rem)] text-ink leading-[1.08] tracking-[-0.03em]"
							>
								Privacy Policy
							</h1>
							<p className="mt-4 text-ink-subtle text-sm">
								Effective Date: <time dateTime="2026-09-21">{lastUpdated}</time>
							</p>
							<p className="mt-6 text-balance text-ink-muted text-base leading-relaxed sm:text-lg">
								GTMX Agents provides agentic fundraising orchestration software for startup
								founders. This Privacy Policy describes how we collect, use, and protect your
								information when you use our website, software platform, and connected email
								integrations.
							</p>
						</Reveal>
					</div>
				</section>

				{/* ── Google Limited Use Callout ─────────────────────────────────── */}
				<section
					aria-labelledby="google-disclosure-heading"
					className="border-line border-b bg-surface/50"
				>
					<div className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
						<div className="rounded-card border border-accent/30 bg-accent/5 p-6 sm:p-8">
							<p className="font-mono text-accent text-xs uppercase tracking-wider">
								Google API Compliance
							</p>
							<h2
								id="google-disclosure-heading"
								className="mt-2 font-display font-bold text-ink text-xl tracking-tight sm:text-2xl"
							>
								Google API Services User Data Policy & Limited Use Disclosure
							</h2>
							<blockquote className="mt-4 border-accent/40 border-l-2 pl-4 font-medium text-ink text-sm sm:text-base leading-relaxed italic">
								“GTMX Agents' use and transfer of information received from Google APIs to any other
								app will adhere to the{" "}
								<a
									href="https://developers.google.com/terms/api-services-user-data-policy"
									target="_blank"
									rel="noopener noreferrer"
									className="text-accent underline underline-offset-4 hover:text-accent-hover"
								>
									Google API Services User Data Policy
								</a>
								, including the Limited Use requirements.”
							</blockquote>

							<div className="mt-6 grid gap-4 text-xs text-ink-muted sm:grid-cols-3">
								<div className="rounded-control border border-line bg-background/60 p-4">
									<p className="font-display font-medium text-ink">No Model Training</p>
									<p className="mt-1 leading-normal">
										We do not use your Google workspace data or email content to train or fine-tune
										generalized artificial intelligence models.
									</p>
								</div>
								<div className="rounded-control border border-line bg-background/60 p-4">
									<p className="font-display font-medium text-ink">No Human Reading</p>
									<p className="mt-1 leading-normal">
										No human reads your emails unless you explicitly provide affirmative consent for
										troubleshooting, or when required by law.
									</p>
								</div>
								<div className="rounded-control border border-line bg-background/60 p-4">
									<p className="font-display font-medium text-ink">Zero Advertising</p>
									<p className="mt-1 leading-normal">
										We never sell, broker, or transfer your Google user data to data brokers or
										advertising platforms.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* ── Main Policy Body ──────────────────────────────────────────── */}
				<div className="mx-auto max-w-4xl px-6 py-16 sm:px-8">
					<div className="space-y-12 text-ink-muted text-sm leading-relaxed sm:text-base">
						{/* 1. Information We Collect */}
						<section aria-labelledby="section-info-collected">
							<h2
								id="section-info-collected"
								className="font-display font-bold text-ink text-xl tracking-tight sm:text-2xl"
							>
								1. Information We Collect
							</h2>
							<div className="mt-4 space-y-3">
								<p>
									When you use GTMX Agents, we collect and process only the information strictly
									necessary to run your fundraising outreach workflows:
								</p>
								<ul className="list-disc space-y-2 pl-5 text-ink-subtle">
									<li>
										<strong className="text-ink">Account & Identity Information:</strong> Name, work
										email address, company name, and authentication tokens provided during signup.
									</li>
									<li>
										<strong className="text-ink">Mailbox Authorization Data:</strong> When you
										connect your mailbox via Google OAuth, we receive secure OAuth 2.0 access and
										refresh tokens. We never see or store your raw Google password.
									</li>
									<li>
										<strong className="text-ink">Outreach & Communications Metadata:</strong>{" "}
										Message headers (To, From, Subject, RFC Message-ID, In-Reply-To), timestamps,
										and pitch draft content created or approved by you.
									</li>
									<li>
										<strong className="text-ink">Incoming Reply Signals:</strong> Incoming email
										snippets specifically matched to active investor outreach campaigns in order to
										detect investor responses and stop follow-ups.
									</li>
								</ul>
							</div>
						</section>

						{/* 2. How We Use Information */}
						<section aria-labelledby="section-how-we-use">
							<h2
								id="section-how-we-use"
								className="font-display font-bold text-ink text-xl tracking-tight sm:text-2xl"
							>
								2. How We Use Your Information
							</h2>
							<div className="mt-4 space-y-3">
								<p>
									We use information received from your account and connected integrations
									exclusively to:
								</p>
								<ul className="list-disc space-y-2 pl-5 text-ink-subtle">
									<li>
										Authenticate and connect to your email account via industry-standard protocols
										(SMTP/IMAP via SASL XOAUTH2).
									</li>
									<li>
										Dispatch customized investor introduction pitches that you have reviewed and
										approved.
									</li>
									<li>
										Monitor your INBOX for incoming replies from prospective investors to your
										campaign threads.
									</li>
									<li>
										Automatically halt scheduled follow-up sequences once an investor replies,
										protecting your reputation from unwanted follow-ups.
									</li>
									<li>
										Provide system diagnostics, deliverability monitoring, and technical support.
									</li>
								</ul>
							</div>
						</section>

						{/* 3. Data Storage & Security */}
						<section aria-labelledby="section-security">
							<h2
								id="section-security"
								className="font-display font-bold text-ink text-xl tracking-tight sm:text-2xl"
							>
								3. Data Storage, Security & Encryption
							</h2>
							<div className="mt-4 space-y-3">
								<p>
									We implement enterprise-grade technical and organizational safeguards to protect
									your information:
								</p>
								<ul className="list-disc space-y-2 pl-5 text-ink-subtle">
									<li>
										<strong className="text-ink">Encryption in Transit:</strong> All data
										transmitted between your browser, our backend, and Google APIs is encrypted
										using TLS 1.3.
									</li>
									<li>
										<strong className="text-ink">Encryption at Rest:</strong> OAuth tokens and
										sensitive credentials are stored using AES-256 encryption.
									</li>
									<li>
										<strong className="text-ink">Access Control:</strong> Administrative access to
										production systems is strictly restricted, audited, and secured with
										multi-factor authentication.
									</li>
								</ul>
							</div>
						</section>

						{/* 4. User Rights & Data Deletion */}
						<section aria-labelledby="section-rights">
							<h2
								id="section-rights"
								className="font-display font-bold text-ink text-xl tracking-tight sm:text-2xl"
							>
								4. Your Rights, Token Revocation & Data Deletion
							</h2>
							<div className="mt-4 space-y-3">
								<p>
									You maintain complete control over your connected mailboxes and personal data:
								</p>
								<ul className="list-disc space-y-2 pl-5 text-ink-subtle">
									<li>
										<strong className="text-ink">Revoke Access at Any Time:</strong> You can
										disconnect your Google account instantly from inside GTMX Agents settings or via
										your{" "}
										<a
											href="https://myaccount.google.com/permissions"
											target="_blank"
											rel="noopener noreferrer"
											className="text-accent underline underline-offset-4 hover:text-accent-hover"
										>
											Google Account Security Settings
										</a>
										. Revoking access immediately invalidates our OAuth tokens.
									</li>
									<li>
										<strong className="text-ink">Request Data Deletion:</strong> You can request
										complete erasure of your stored campaign data, authentication tokens, and logs
										at any time by emailing us at{" "}
										<a
											href={`mailto:${contactEmail}`}
											className="text-accent underline underline-offset-4 hover:text-accent-hover"
										>
											{contactEmail}
										</a>
										. We process verified deletion requests within 14 business days.
									</li>
								</ul>
							</div>
						</section>

						{/* 5. Contact Information */}
						<section aria-labelledby="section-contact" className="border-line border-t pt-8">
							<h2
								id="section-contact"
								className="font-display font-bold text-ink text-xl tracking-tight sm:text-2xl"
							>
								5. Contact Us
							</h2>
							<p className="mt-3">
								If you have any questions about this Privacy Policy, our data practices, or Google
								API compliance, please contact our team at:
							</p>
							<div className="mt-4 rounded-control border border-line bg-surface/50 p-4">
								<p className="font-medium text-ink">{COMPANY.name}</p>
								<p className="text-ink-subtle">
									Email:{" "}
									<a
										href={`mailto:${contactEmail}`}
										className="text-accent underline underline-offset-4 hover:text-accent-hover"
									>
										{contactEmail}
									</a>
								</p>
							</div>
						</section>
					</div>
				</div>
			</article>
		</Shell>
	);
}
