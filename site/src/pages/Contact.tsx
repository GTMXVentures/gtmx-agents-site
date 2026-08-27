import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import { Shell } from "@/components/Shell";
import { COMPANY } from "@/data/company";

/**
 * /contact — how to reach a human, and where the company is.
 *
 * Every row is driven by @/data/company and a null value renders nothing. That
 * is deliberate: an address block reading "Address: —" is worse than no address
 * block, and an invented one is worse than both. Fill the fields in
 * data/company.ts and the rows appear.
 */

const CHANNELS = [
	{
		id: "product",
		label: "Product & access",
		body: "Waitlist, cohorts, what the agents do, what is in the database.",
	},
	{
		id: "data",
		label: "Data & corrections",
		body: "If your firm is listed and something is wrong, tell us and we will correct the record.",
	},
	{
		id: "partnerships",
		label: "Partnerships",
		body: "Funds, syndicates and studios who want to work with us rather than be listed by us.",
	},
];

export default function Contact(): ReactElement {
	const { email, phone, address, legalName, registrationNumber, social } = COMPANY;
	const socialLinks = [
		{ id: "linkedin", label: "LinkedIn", href: social.linkedin },
		{ id: "x", label: "X", href: social.x },
	].filter((s): s is { id: string; label: string; href: string } => Boolean(s.href));

	return (
		<Shell current="/contact" skipTo={{ href: "#reach-us", label: "Skip to contact details" }}>
			<section aria-labelledby="contact-heading">
				<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
					<Reveal>
						<p className="eyebrow">Contact</p>
						<h1
							id="contact-heading"
							className="mt-5 max-w-3xl text-balance font-display font-bold text-[clamp(2.25rem,5.5vw,3.75rem)] text-ink leading-[1] tracking-[-0.03em]"
						>
							Talk to a person.
						</h1>
						<p className="mt-7 max-w-2xl text-ink-muted text-lg leading-[1.7]">
							One address, read by the people who build the product. No ticket queue.
						</p>
					</Reveal>

					<div
						id="reach-us"
						className="mt-16 grid scroll-mt-4 gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]"
					>
						{/* ── Details ─────────────────────────────────────────────── */}
						<Reveal>
							<div className="border-line border-t pt-6">
								<h2 className="font-display font-semibold text-ink text-lg tracking-[-0.02em]">
									Reach us
								</h2>
								<dl className="mt-6 grid gap-6">
									<div>
										<dt className="font-mono text-[0.6875rem] text-ink-subtle uppercase tracking-[0.16em]">
											Email
										</dt>
										<dd className="mt-2">
											<a
												href={`mailto:${email}`}
												className="text-ink transition-colors duration-200 hover:text-accent"
											>
												{email}
											</a>
										</dd>
									</div>

									{phone && (
										<div>
											<dt className="font-mono text-[0.6875rem] text-ink-subtle uppercase tracking-[0.16em]">
												Phone
											</dt>
											<dd className="mt-2">
												{/* tel: needs the number without spaces to dial reliably. */}
												<a
													href={`tel:${phone.replace(/[^+\d]/g, "")}`}
													className="text-ink transition-colors duration-200 hover:text-accent"
												>
													{phone}
												</a>
											</dd>
										</div>
									)}

									{address && (
										<div>
											<dt className="font-mono text-[0.6875rem] text-ink-subtle uppercase tracking-[0.16em]">
												Registered office
											</dt>
											<dd className="mt-2 text-ink not-italic leading-[1.7]">
												<address className="not-italic">
													{address.line1}
													<br />
													{address.line2 && (
														<>
															{address.line2}
															<br />
														</>
													)}
													{address.city}
													<br />
													{address.country}
												</address>
											</dd>
										</div>
									)}

									{socialLinks.length > 0 && (
										<div>
											<dt className="font-mono text-[0.6875rem] text-ink-subtle uppercase tracking-[0.16em]">
												Elsewhere
											</dt>
											<dd className="mt-2 flex gap-4">
												{socialLinks.map((s) => (
													<a
														key={s.id}
														href={s.href}
														rel="noreferrer noopener"
														target="_blank"
														className="text-ink transition-colors duration-200 hover:text-accent"
													>
														{s.label}
													</a>
												))}
											</dd>
										</div>
									)}
								</dl>

								{(legalName || registrationNumber) && (
									<p className="mt-8 border-line border-t pt-6 text-ink-subtle text-xs leading-[1.7]">
										{legalName}
										{legalName && registrationNumber && " · "}
										{registrationNumber}
									</p>
								)}
							</div>
						</Reveal>

						{/* ── What to write about ─────────────────────────────────── */}
						<Reveal>
							<div className="grid gap-10">
								{CHANNELS.map((c) => (
									<article key={c.id} className="border-line border-t pt-6">
										<h3 className="font-display font-semibold text-ink text-lg tracking-[-0.02em]">
											{c.label}
										</h3>
										<p className="mt-3 text-ink-muted leading-[1.7]">{c.body}</p>
									</article>
								))}
								<p className="text-ink-subtle text-sm leading-[1.7]">
									Looking for access rather than a conversation?{" "}
									<a href="/#waitlist" className="text-accent hover:underline">
										Join the waitlist
									</a>{" "}
									— cohorts open as the agents are tuned against live rounds.
								</p>
							</div>
						</Reveal>
					</div>
				</div>
			</section>
		</Shell>
	);
}
