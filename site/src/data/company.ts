/**
 * Company facts, in ONE place.
 *
 * Everything a visitor (or a cloud-credits reviewer, or a partner doing basic
 * diligence) checks for to decide whether this is a real operating company.
 * Kept out of JSX so the set of facts we publish is auditable at a glance and
 * so filling a gap is a one-line edit rather than a hunt.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️ FIELDS MARKED `null` ARE NOT PUBLISHED.
 *
 * Every consumer below treats `null` as "omit this row entirely" — nothing
 * renders a placeholder, an em dash, or "Coming soon". A missing phone number
 * is invisible; an invented one is a liability. These were left null because
 * the information was not available when the pages were written, NOT because
 * it is unwanted: the whole point of these pages is that a reviewer previously
 * judged the site to contain "not enough information about your company".
 *
 * Fill these in and the pages populate themselves.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface TeamMember {
	readonly name: string;
	readonly role: string;
	readonly linkedin: string | null;
}

export const COMPANY = {
	/** Product/brand name as used in the UI. */
	name: "GTMX Agents",

	/** Registered legal entity, e.g. "Example Technologies Pvt. Ltd.". */
	legalName: null as string | null,

	/** Registration identifier (CIN in India). Published on the contact page. */
	registrationNumber: null as string | null,

	/** Registered office. All four parts render together or not at all. */
	address: null as {
		readonly line1: string;
		readonly line2: string | null;
		readonly city: string;
		readonly country: string;
	} | null,

	/** E.164 with spacing for readability; the tel: link strips non-digits. */
	phone: "+91 60003 43356" as string | null,

	/** General enquiries. */
	email: "kumar@gtmxagents.com",

	/**
	 * Who the email and phone reach. Rendered beside them so the contact page's
	 * promise ("talk to a person") is literally true rather than a slogan over a
	 * generic inbox. Null falls back to unattributed details.
	 */
	contactName: "Kumar Aditya" as string | null,

	/** Year the company began operating. */
	foundedYear: null as number | null,

	/** Public company profiles. Null entries are skipped. */
	social: {
		linkedin: null as string | null,
		x: null as string | null,
	},

	/**
	 * The people behind it. An empty array omits the section entirely.
	 *
	 * Name and designation only. Bios were dropped deliberately: a one-line
	 * summary of someone's role reads as filler next to the title that already
	 * says it, and a longer one is theirs to write, not ours to invent.
	 * `linkedin` is null until each person supplies their own URL.
	 */
	team: [
		{
			name: "Saurabh Lahoti",
			role: "Founder",
			linkedin: null,
		},
		{
			name: "Raman Shrivastava",
			role: "Chief Technology Officer",
			linkedin: null,
		},
		{
			name: "Kumar Aditya",
			role: "Product",
			linkedin: null,
		},
	] as readonly TeamMember[],
} as const;

/** True when there is enough to render a meaningful contact block. */
export function hasContactDetails(): boolean {
	return Boolean(COMPANY.address || COMPANY.phone);
}
