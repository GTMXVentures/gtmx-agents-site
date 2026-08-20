import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import { COVERAGE, formatCount } from "@/data/coverage";

/**
 * Problem — why rounds stall.
 *
 * Deliberately NOT numbered, in contrast to the agent roster above and the
 * detail section below: these three failures happen at once, not in sequence,
 * so a 01/02/03 rail would encode something untrue. The structural marker is a
 * PHASE label instead — where in a raise the failure bites — which is the real
 * information a founder needs to place it against their own round.
 *
 * The copy uses no invented statistics. The only figure here comes from
 * @/data/coverage and is a real database count; a pre-launch product quoting
 * reply-rate benchmarks it has not measured is the fastest way to lose this
 * audience.
 */
const FRICTIONS = [
	{
		id: "list",
		phase: "Before a single email",
		title: "Three weeks spent building the list",
		body: `The list is the raise. Most founders assemble it from memory, a scraped spreadsheet, and whoever answered the last intro request — then work maybe two hundred names out of ${formatCount(COVERAGE.firms)}. Half of those never invest at your stage, in your sector, or out of your geography, and you find that out one polite decline at a time.`,
	},
	{
		id: "spray",
		phase: "At scale, without signal",
		title: "Two hundred sends, one message",
		body: "The funds that would have said yes get the same paragraph as the funds that were never going to. Nothing in the send is specific to the thesis a partner has spent five years writing about, and silence teaches you nothing about which half was which.",
	},
	{
		id: "threads",
		phase: "After the hard part is done",
		title: "The thread that went cold in April",
		body: "A partner asked for cohort retention in March. It landed in a DM, moved to a calendar invite, and stopped. Warm conversations rarely die of conviction — they die of admin, in the gap between four inboxes and nobody owning the follow-up.",
	},
];

export function Problem(): ReactElement {
	return (
		<section aria-labelledby="problem-heading" className="border-line border-t">
			<div className="mx-auto grid max-w-6xl gap-x-16 gap-y-10 px-6 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
				<Reveal>
					<p className="eyebrow">The state of play</p>
					<h2
						id="problem-heading"
						className="mt-5 text-balance font-display font-bold text-[clamp(2rem,4.5vw,3rem)] text-ink leading-[1] tracking-[-0.03em]"
					>
						Raising is a pipeline problem nobody staffs.
					</h2>
					<p className="mt-5 max-w-md text-ink-muted leading-[1.7]">
						A founder runs it between board meetings. An analyst runs six of them at once. The work
						is legible, repeatable and almost entirely manual — which is exactly the shape of work
						an agent team should be doing.
					</p>
				</Reveal>

				<ul className="divide-y divide-line border-line border-t lg:border-t-0">
					{FRICTIONS.map((friction) => (
						<li key={friction.id} className="py-8 lg:first:pt-0">
							<p className="eyebrow">{friction.phase}</p>
							<h3 className="mt-3 font-display font-medium text-ink text-xl tracking-[-0.015em]">
								{friction.title}
							</h3>
							<p className="mt-3 max-w-2xl text-ink-muted leading-[1.7]">{friction.body}</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
