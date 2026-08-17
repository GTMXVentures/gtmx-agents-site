import type { ReactElement } from "react";
import { PulseDot } from "@/components/PulseDot";
import { COVERAGE, formatCount } from "@/data/coverage";

/**
 * Hero — the console view.
 *
 * Two panels side by side on large screens: the LEFT states what the product
 * does, the RIGHT shows it doing it. That split is the whole argument. A
 * fundraise is normally invisible work happening in someone's inbox, so the
 * page's job is to make it look like a system with a status, and the right-hand
 * panel is the page's signature element — a live roster of the four agents with
 * what each one is doing.
 *
 * The two panels are peers, not a hero-plus-screenshot: the right panel is real
 * markup on the same tokens, not an image of a UI. That is deliberate. A
 * screenshot of a product that has not launched is a promise; a rendered panel
 * is a specification, and it stays honest because it only ever states the four
 * agents' standing jobs, never fabricated per-fund activity.
 *
 * Every figure quoted here comes from @/data/coverage — no number on this page
 * is typed twice.
 */

/**
 * The four agents, in the order a raise runs them. The numbering is not
 * decoration: 01 must complete before 02 has a list to work, and the same
 * numbers key the detail section further down the page, so the roster here and
 * the explanation there are visibly one system.
 *
 * `status` is present-tense on purpose — it is what the pill renders, and the
 * pill's green means "running now" (see the colour rule in index.css).
 */
const AGENT_ROSTER = [
	{
		id: "matching",
		stage: "01",
		name: "Matching Agent",
		status: `screening ${formatCount(COVERAGE.firms)} funds`,
		detail: "Stage, sector, cheque size, geography, and the thesis a partner has actually written.",
	},
	{
		id: "outreach",
		stage: "02",
		name: "Outreach Agent",
		status: "drafting fund-specific approaches",
		detail:
			"One message per fund, built from that fund's thesis and your traction — never a blast.",
	},
	{
		id: "tracking",
		stage: "03",
		name: "Tracking Agent",
		status: "watching live threads",
		detail: "Email, LinkedIn and meeting notes reconciled into a single state per fund.",
	},
	{
		id: "diligence",
		stage: "04",
		name: "Diligence Agent",
		status: "assembling the data room",
		detail: "The questions funds ask at your stage, answered from your own numbers.",
	},
];

/**
 * Reads left-to-right as the funnel a founder actually cares about: how many
 * firms exist, how many have a human attached, how many can be reached today.
 */
const HERO_STATS = [
	{ id: "firms", value: formatCount(COVERAGE.firms), label: "investor firms" },
	{ id: "partners", value: formatCount(COVERAGE.partners), label: "named partners" },
	{ id: "reachable", value: formatCount(COVERAGE.reachablePartners), label: "reachable today" },
];

const COMMITMENTS = [
	"Founder-side, never fund-side",
	"Every send reviewed by you",
	"One state per fund, not four inboxes",
];

export function Hero(): ReactElement {
	return (
		<section aria-labelledby="hero-heading" className="px-4 pt-4 pb-16 sm:px-6 sm:pb-24">
			<div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2">
				{/* --- Left panel: the claim ---------------------------------------- */}
				{/* animation-delay is set inline, not via a utility: `animate-rise` is the
				    `animation` SHORTHAND, and a separately-emitted delay utility can sort
				    before it and get reset to 0. The reduced-motion block in index.css
				    uses !important, which beats inline styles, so this stays accessible. */}
				<div className="animate-rise rounded-card border border-line bg-surface p-7 sm:p-10">
					<p className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[0.6875rem] text-ink-muted">
						<PulseDot />
						Pre-launch · agent-run fundraising
					</p>

					<h1
						id="hero-heading"
						className="mt-7 text-balance font-display font-bold text-[clamp(2.75rem,6.5vw,4.5rem)] text-ink leading-[0.95] tracking-[-0.035em]"
					>
						Agents run the raise.
					</h1>

					{/* The status line is the page's one piece of theatre, and it is kept
					    honest: the only figure it quotes is the database count, which is
					    real and shared with the stat trio below. It never claims a live
					    per-user session. */}
					<p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-accent text-xs">
						<PulseDot />
						<span>agent_team online</span>
						<span aria-hidden="true" className="text-ink-subtle">
							·
						</span>
						<span>watching {formatCount(COVERAGE.firms)} funds</span>
						<span
							aria-hidden="true"
							className="inline-block h-[1em] w-[0.5em] translate-y-[0.1em] animate-caret bg-accent"
						/>
					</p>

					<p className="mt-6 max-w-lg text-ink-muted leading-[1.7]">
						GTMX Agents runs sourcing-in-reverse for founders: investor matching, outreach
						orchestration, conversation tracking, and diligence prep — one agent team working your
						round end to end.
					</p>

					{/* <dl> rather than three divs: each figure genuinely is a term and its
					    value. The label is repeated as an sr-only <dt> so the number is
					    never announced bare — "22,402" alone is meaningless in a screen
					    reader's linear pass. */}
					<dl className="mt-9 grid grid-cols-3 gap-x-4">
						{HERO_STATS.map((stat) => (
							<div key={stat.id}>
								<dt className="sr-only">{stat.label}</dt>
								<dd className="font-display font-bold text-2xl text-ink tabular-nums tracking-[-0.02em] sm:text-3xl">
									{stat.value}
								</dd>
								<dd aria-hidden="true" className="mt-1 text-ink-subtle text-xs">
									{stat.label}
								</dd>
							</div>
						))}
					</dl>

					<div className="mt-9 flex flex-col gap-3 sm:flex-row">
						<a
							href="#waitlist"
							className="inline-flex items-center justify-center rounded-control bg-primary px-6 py-3 font-display font-medium text-primary-foreground text-sm transition-colors duration-200 hover:bg-primary-hover"
						>
							Join the waitlist
						</a>
						<a
							href="#database"
							className="inline-flex items-center justify-center rounded-control border border-line px-6 py-3 font-display font-medium text-ink text-sm transition-colors duration-200 hover:border-ink-subtle hover:bg-surface-hover"
						>
							See the database
						</a>
					</div>

					<p className="mt-5 text-ink-subtle text-xs">
						Built on the GTMX Ventures investor database.
					</p>
				</div>

				{/* --- Right panel: the roster -------------------------------------- */}
				<div
					className="animate-rise rounded-card border border-line bg-surface"
					style={{ animationDelay: "140ms" }}
				>
					<div className="flex items-baseline justify-between gap-4 border-line border-b px-6 py-5 sm:px-8">
						<div>
							{/* The panel's own <h2> — which is what makes the agent names below
							    legal <h3>s. Without a heading here the roster would be four
							    orphaned h3s hanging off the page's h1. */}
							<h2 className="flex items-center gap-2 font-mono text-[0.6875rem] text-accent uppercase tracking-[0.16em]">
								<PulseDot />
								Live agent team
							</h2>
							<a
								href="#agents"
								className="mt-1.5 inline-block font-display font-medium text-ink text-sm transition-colors duration-200 hover:text-accent"
							>
								What each agent does &darr;
							</a>
						</div>
						<p className="eyebrow whitespace-nowrap">04 agents</p>
					</div>

					<ol className="divide-y divide-line">
						{AGENT_ROSTER.map((agent) => (
							<li
								key={agent.id}
								className="flex gap-4 px-6 py-5 transition-colors duration-200 hover:bg-surface-hover sm:px-8"
							>
								<span
									aria-hidden="true"
									className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-control border border-line font-mono text-[0.6875rem] text-ink-subtle tabular-nums"
								>
									{agent.stage}
								</span>
								<div className="min-w-0">
									<div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
										<h3 className="font-display font-medium text-ink text-sm">{agent.name}</h3>
										<span className="status-pill">{agent.status}</span>
									</div>
									<p className="mt-2 text-ink-muted text-sm leading-[1.6]">{agent.detail}</p>
								</div>
							</li>
						))}
					</ol>

					{/* Three standing commitments rather than three more features. These
					    are the questions a founder asks before handing over their raise,
					    and they belong on the roster panel because they scope what the
					    agents are allowed to do. */}
					<ul className="grid divide-line border-line border-t sm:grid-cols-3 sm:divide-x">
						{COMMITMENTS.map((commitment) => (
							<li key={commitment} className="px-6 py-5 text-ink-subtle text-xs leading-[1.5]">
								{commitment}
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
