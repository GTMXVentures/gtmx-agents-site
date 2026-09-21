import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import { Shell } from "@/components/Shell";
import { COMPANY } from "@/data/company";

/**
 * /terms — Terms of Service for GTMX Agents.
 *
 * Covers service description, acceptable use, anti-spam obligations (CAN-SPAM / GDPR),
 * mailbox connection authority, and broker-dealer disclaimers.
 */

export default function Terms(): ReactElement {
	const lastUpdated = "September 21, 2026";
	const contactEmail = COMPANY.email;

	return (
		<Shell
			current="/terms"
			skipTo={{ href: "#content", label: "Skip to terms of service content" }}
		>
			<article id="content">
				{/* ── Intro ─────────────────────────────────────────────────────── */}
				<section aria-labelledby="terms-heading" className="border-line border-b">
					<div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-24">
						<Reveal>
							<p className="eyebrow">Legal & Agreements</p>
							<h1
								id="terms-heading"
								className="mt-4 text-balance font-display font-bold text-[clamp(2.25rem,4.5vw,3.5rem)] text-ink leading-[1.08] tracking-[-0.03em]"
							>
								Terms of Service
							</h1>
							<p className="mt-4 text-ink-subtle text-sm">
								Effective Date: <time dateTime="2026-09-21">{lastUpdated}</time>
							</p>
							<p className="mt-6 text-balance text-ink-muted text-base leading-relaxed sm:text-lg">
								Please read these Terms of Service carefully before using GTMX Agents. By accessing
								or using our services, you agree to be bound by these terms.
							</p>
						</Reveal>
					</div>
				</section>

				{/* ── Main Terms Body ───────────────────────────────────────────── */}
				<div className="mx-auto max-w-4xl px-6 py-16 sm:px-8">
					<div className="space-y-12 text-ink-muted text-sm leading-relaxed sm:text-base">
						{/* 1. Description of Service */}
						<section aria-labelledby="section-service-desc">
							<h2
								id="section-service-desc"
								className="font-display font-bold text-ink text-xl tracking-tight sm:text-2xl"
							>
								1. Description of Service
							</h2>
							<div className="mt-4 space-y-3">
								<p>
									GTMX Agents provides autonomous software agents and workflow tooling designed to
									assist startup founders in researching prospective venture capital investors,
									managing fundraising pipelines, and orchestrating outreach communications.
								</p>
								<p className="text-ink-subtle">
									<strong className="text-ink">No Broker-Dealer Relationship:</strong> GTMX Agents
									is a software technology provider. We are not a registered broker-dealer,
									investment advisor, or placement agent. We do not negotiate securities, hold
									funds, or provide investment recommendations.
								</p>
							</div>
						</section>

						{/* 2. Mailbox Authorization & Anti-Spam Compliance */}
						<section aria-labelledby="section-anti-spam">
							<h2
								id="section-anti-spam"
								className="font-display font-bold text-ink text-xl tracking-tight sm:text-2xl"
							>
								2. Mailbox Connection & Anti-Spam Obligations
							</h2>
							<div className="mt-4 space-y-3">
								<p>
									When you connect your email account (via Google OAuth or equivalent protocols) to
									GTMX Agents, you warrant and agree to the following:
								</p>
								<ul className="list-disc space-y-2 pl-5 text-ink-subtle">
									<li>
										<strong className="text-ink">Authority:</strong> You possess full legal
										authority to connect the email mailbox on behalf of yourself and your
										organization.
									</li>
									<li>
										<strong className="text-ink">Anti-Spam Compliance:</strong> You agree to
										strictly abide by all applicable communications and privacy laws, including the
										U.S. CAN-SPAM Act, the EU General Data Protection Regulation (GDPR), and
										international telecommunications laws.
									</li>
									<li>
										<strong className="text-ink">Bona Fide Communications:</strong> GTMX Agents is
										designed exclusively for tailored, relevant communications between startup
										founders and institutional investors. Sending bulk unsolicited marketing,
										deceptive subject lines, misleading identities, or abusive spam is strictly
										prohibited and constitutes grounds for immediate account termination.
									</li>
									<li>
										<strong className="text-ink">Opt-Out & Follow-Up Halts:</strong> Our platform
										automatically halts follow-up sequences upon detecting replies. You agree not to
										bypass or interfere with these safeguard mechanisms.
									</li>
								</ul>
							</div>
						</section>

						{/* 3. Founder Approval & Responsibility */}
						<section aria-labelledby="section-founder-approval">
							<h2
								id="section-founder-approval"
								className="font-display font-bold text-ink text-xl tracking-tight sm:text-2xl"
							>
								3. Founder Approval & Content Responsibility
							</h2>
							<div className="mt-4 space-y-3">
								<p>
									While GTMX Agents utilizes artificial intelligence to suggest matching criteria,
									research investors, and draft communications,{" "}
									<strong>you retain ultimate review and approval authority</strong> over all
									messages dispatched from your account.
								</p>
								<p className="text-ink-subtle">
									You are solely responsible for the accuracy, legality, and representations made in
									any pitch deck, financial projection, or correspondence sent through the platform.
								</p>
							</div>
						</section>

						{/* 4. Intellectual Property */}
						<section aria-labelledby="section-ip">
							<h2
								id="section-ip"
								className="font-display font-bold text-ink text-xl tracking-tight sm:text-2xl"
							>
								4. Intellectual Property Rights
							</h2>
							<div className="mt-4 space-y-3">
								<p>
									<strong className="text-ink">Your Content:</strong> You retain complete ownership
									of all pitch materials, slide decks, business plans, confidential data, and
									proprietary information you provide to the platform. GTMX Agents claims no
									ownership over your intellectual property.
								</p>
								<p className="text-ink-subtle">
									<strong className="text-ink">Platform IP:</strong> GTMX Agents, including our
									agentic orchestration architecture, algorithms, interface, and branding, remains
									the exclusive intellectual property of GTMX Agents and its licensors.
								</p>
							</div>
						</section>

						{/* 5. Disclaimer of Warranties */}
						<section aria-labelledby="section-disclaimer">
							<h2
								id="section-disclaimer"
								className="font-display font-bold text-ink text-xl tracking-tight sm:text-2xl"
							>
								5. Disclaimer of Warranties & Limitation of Liability
							</h2>
							<div className="mt-4 space-y-3">
								<p>
									The service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties
									of any kind. GTMX Agents does not guarantee that your outreach will result in
									meetings, term sheets, or investment commitments.
								</p>
								<p className="text-ink-subtle">
									To the maximum extent permitted by applicable law, GTMX Agents shall not be liable
									for any indirect, incidental, special, consequential, or punitive damages, or loss
									of profits or data, resulting from your access to or use of the service.
								</p>
							</div>
						</section>

						{/* 6. Termination */}
						<section aria-labelledby="section-termination">
							<h2
								id="section-termination"
								className="font-display font-bold text-ink text-xl tracking-tight sm:text-2xl"
							>
								6. Termination
							</h2>
							<p className="mt-4">
								You may terminate your account and disconnect your integrations at any time. We
								reserve the right to suspend or terminate access for accounts that violate anti-spam
								standards or breach these Terms of Service.
							</p>
						</section>

						{/* 7. Contact Us */}
						<section aria-labelledby="section-contact-terms" className="border-line border-t pt-8">
							<h2
								id="section-contact-terms"
								className="font-display font-bold text-ink text-xl tracking-tight sm:text-2xl"
							>
								7. Contact Us
							</h2>
							<p className="mt-3">
								For questions regarding these Terms of Service, please contact us at:
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
