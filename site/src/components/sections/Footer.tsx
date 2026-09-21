import type { ReactElement } from "react";
import { COMPANY } from "@/data/company";

/**
 * Footer — the <footer> here is a direct child of the layout root (see Shell),
 * NOT nested inside <main>, so it exposes the `contentinfo` landmark. Nesting it
 * in a sectioning element would silently drop that role.
 *
 * Contact details come from @/data/company and a null value renders nothing —
 * no placeholder rows, no em dashes. See the header comment in that file for
 * why the gaps are gaps rather than invented values.
 */

const NAV = [
	{ href: "/product", label: "Product" },
	{ href: "/company", label: "Company" },
	{ href: "/contact", label: "Contact" },
	{ href: "/privacy", label: "Privacy Policy" },
	{ href: "/terms", label: "Terms of Service" },
] as const;

export function Footer(): ReactElement {
	const { name, legalName, email, phone, address, foundedYear } = COMPANY;
	const year = new Date().getFullYear();

	return (
		<footer className="border-line border-t">
			<div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)_auto]">
				{/* ── Identity ────────────────────────────────────────────────── */}
				<div>
					<p className="font-display font-medium text-ink text-sm">{name}</p>
					<p className="mt-1 text-ink-subtle text-xs">Agent-run fundraising.</p>
					{foundedYear && (
						<p className="mt-1 text-ink-subtle text-xs">Operating since {foundedYear}.</p>
					)}
				</div>

				{/* ── Where to go ─────────────────────────────────────────────── */}
				<div className="text-xs">
					<nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
						{NAV.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="text-ink-muted transition-colors duration-200 hover:text-accent"
							>
								{link.label}
							</a>
						))}
					</nav>

					{address && (
						<address className="mt-5 text-ink-subtle not-italic leading-[1.7]">
							{address.line1}
							{address.line2 && <>, {address.line2}</>}
							<br />
							{address.city}, {address.country}
						</address>
					)}
				</div>

				{/* ── How to reach us ─────────────────────────────────────────── */}
				<div className="flex flex-col gap-1 text-xs sm:items-end">
					<a
						href={`mailto:${email}`}
						className="font-medium text-ink-muted transition-colors duration-200 hover:text-accent"
					>
						{email}
					</a>
					{phone && (
						<a
							// tel: needs the number without spaces to dial reliably.
							href={`tel:${phone.replace(/[^+\d]/g, "")}`}
							className="text-ink-muted transition-colors duration-200 hover:text-accent"
						>
							{phone}
						</a>
					)}
					<p className="mt-2 text-ink-subtle">
						© {year} {legalName ?? name}
					</p>
				</div>
			</div>
		</footer>
	);
}
