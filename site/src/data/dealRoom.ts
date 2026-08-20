/**
 * The thirteen canonical deal-room stages, in ONE place.
 *
 * These mirror `DEAL_STAGES` in the GTMX Agents backend
 * (emergent/backend/app/core/constants.py) and its frontend mirror. They are
 * the real vocabulary the Tracking Agent writes against, not an illustrative
 * funnel invented for a landing page — which is the whole reason the section
 * is worth building. If the backend list changes, change it here too, and keep
 * COVERAGE.advancingStages / terminalStages in @/data/coverage in step.
 *
 * The split matters more than the count. Nine stages carry a conversation
 * toward a signature; the other four record how one ended. Most pipelines only
 * model the nine, which is why nobody can answer what happened to the two
 * hundred funds that went quiet.
 */

export interface DealStage {
	readonly id: string;
	readonly name: string;
	/** One line, shown in the list. What state the fund is in. */
	readonly summary: string;
	/** Shown when the stage is selected. What is actually happening. */
	readonly detail: string;
	/** The single action that moves it on — the reason a founder reads this. */
	readonly next: string;
}

export const ADVANCING_STAGES: readonly DealStage[] = [
	{
		id: "needs-contact",
		name: "Needs to be Contacted",
		summary: "Matched to the raise, nothing sent yet",
		detail:
			"The fund is on the list because its sector, stage and cheque band fit. Nothing has gone out.",
		next: "Send the first note to the named partner, not a general inbox.",
	},
	{
		id: "contacted",
		name: "Contacted",
		summary: "First outreach sent to a named partner",
		detail:
			"Outreach went to a specific partner rather than a general inbox, and the thread is tracked against this raise.",
		next: "Chase once after five working days, then move on.",
	},
	{
		id: "evaluating",
		name: "Evaluating",
		summary: "Deck and metrics under review at the fund",
		detail:
			"The fund has the material. Notes, questions and any concerns raised are recorded against the fund.",
		next: "Answer their questions in writing and get a call in the diary.",
	},
	{
		id: "early",
		name: "Early Discussions",
		summary: "First calls held, mutual interest established",
		detail:
			"Conversations are live. The record holds call notes and the action items each side owes the other.",
		next: "Send the metrics they asked for before the next call.",
	},
	{
		id: "advanced",
		name: "Advanced Discussions",
		summary: "Partner meeting, deeper commercial questions",
		detail:
			"The fund is working the opportunity internally. Usually where the sponsoring partner takes it to the wider team.",
		next: "Get in front of the wider partnership.",
	},
	{
		id: "diligence",
		name: "Active Due Diligence",
		summary: "Customer references, cohorts and tech review",
		detail:
			"Data room access, reference calls and model review. The stage that most often stalls without someone tracking it.",
		next: "Line up references early and keep the data room current.",
	},
	{
		id: "term-sheet",
		name: "Term Sheet Negotiations",
		summary: "Valuation, board composition, preferences",
		detail:
			"Commercial terms under negotiation. Competing sheets, if any, sit side by side on the same raise.",
		next: "Settle valuation, option pool and protective provisions.",
	},
	{
		id: "legal",
		name: "Legal and Financial Diligence",
		summary: "Confirmatory legal and financial review",
		detail:
			"Counsel and auditors are engaged. Conditions precedent get itemised here so nothing surfaces late.",
		next: "Clear conditions precedent before they become blockers.",
	},
	{
		id: "sha",
		name: "SHA Drafting & Negotiations",
		summary: "Definitive agreements through to closing",
		detail: "Shareholders' agreement drafting, conditions precedent fulfilment, and disbursement.",
		next: "Signatures, CP fulfilment, then the wire.",
	},
];

export interface TerminalStage {
	readonly id: string;
	readonly name: string;
	readonly note: string;
}

/**
 * States, not steps — a deal is never advanced into or out of these
 * automatically, which is why they are modelled separately rather than as
 * stages ten through thirteen.
 */
export const TERMINAL_STAGES: readonly TerminalStage[] = [
	{ id: "soft", name: "Soft Commitment", note: "In, but not on paper" },
	{ id: "waiting", name: "Waiting for Lead", note: "In, if someone else goes first" },
	{ id: "hold", name: "On-Hold / Consider Later", note: "Not this round" },
	{ id: "declined", name: "Declined", note: "No" },
];
