import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

// The real vocabulary, mirroring app/core/constants.py DEAL_STAGES and
// frontend_new/src/lib/dealStages.js.
const FORWARD = [
	{
		name: "Needs to be Contacted",
		next: "Send the first note to the named partner, not a general inbox.",
		desc: "Matched to the deal, nothing sent yet",
		detail:
			"The fund is on the list because its sector, stage and cheque band fit. Nothing has gone out.",
	},
	{
		name: "Contacted",
		next: "Chase once after five working days, then move on.",
		desc: "First outreach sent to a named partner",
		detail:
			"Outreach went to a specific partner rather than a general inbox, and the thread is tracked against this deal.",
	},
	{
		name: "Evaluating",
		next: "Answer their questions in writing and get a call in the diary.",
		desc: "Deck and metrics under review at the fund",
		detail:
			"The fund has the material. Notes, questions and any concerns raised are recorded on the deal.",
	},
	{
		name: "Early Discussions",
		next: "Send the metrics they asked for before the next call.",
		desc: "First calls held, mutual interest established",
		detail:
			"Conversations are live. The record holds call notes and the action items each side owes the other.",
	},
	{
		name: "Advanced Discussions",
		next: "Get in front of the wider partnership.",
		desc: "Partner meeting, deeper commercial questions",
		detail:
			"The fund is working the opportunity internally. Usually where the sponsoring partner takes it to the wider team.",
	},
	{
		name: "Active Due Diligence",
		next: "Line up references early and keep the data room current.",
		desc: "Customer references, cohorts and tech review",
		detail:
			"Data room access, reference calls and model review. The stage that most often stalls without someone tracking it.",
	},
	{
		name: "Term Sheet Negotiations",
		next: "Settle valuation, option pool and protective provisions.",
		desc: "Valuation, board composition, preferences",
		detail:
			"Commercial terms under negotiation. Competing sheets, if any, sit side by side on the same deal.",
	},
	{
		name: "Legal and Financial Diligence",
		next: "Clear conditions precedent before they become blockers.",
		desc: "Confirmatory legal and financial review",
		detail:
			"Counsel and auditors are engaged. Conditions precedent get itemised here so nothing surfaces late.",
	},
	{
		name: "SHA Drafting & Negotiations",
		next: "Signatures, CP fulfilment, then the wire.",
		desc: "Definitive agreements through to closing",
		detail: "Shareholders' agreement drafting, conditions precedent fulfilment, and disbursement.",
	},
];

const EXITS = [
	{ name: "Soft Commitment", note: "In, but not on paper" },
	{ name: "Waiting for Lead", note: "In, if someone else goes first" },
	{ name: "On-Hold / Consider Later", note: "Not this round" },
	{ name: "Declined", note: "No" },
];

export default function DealRoomStepper() {
	const [selected, setSelected] = useState(5);
	const current = FORWARD[selected];

	return (
		<section
			id="deal-room"
			className="py-24 relative z-10 bg-[#070B09] border-t border-white/[0.06]"
		>
			<div className="max-w-6xl mx-auto px-6 lg:px-8">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
						Nine stages forward. Four ways out.
					</h2>
					<p className="mt-4 text-neutral-400 text-base leading-relaxed">
						Every fund on a deal sits in exactly one of thirteen stages. Nine move toward a
						signature. The other four record how a conversation actually ended.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
					{/* The spine: nine stages threaded on one continuous line */}
					<ol className="lg:col-span-5 relative">
						<span
							aria-hidden="true"
							className="absolute left-[11px] top-4 bottom-4 w-px bg-white/12"
						/>
						{FORWARD.map((stage, i) => {
							const active = selected === i;
							return (
								<li key={stage.name}>
									<button
										type="button"
										onClick={() => setSelected(i)}
										aria-pressed={active}
										className="w-full text-left flex items-start gap-4 py-2 group"
									>
										<span
											className={`relative z-10 mt-0.5 w-[23px] h-[23px] shrink-0 rounded-full border flex items-center justify-center font-mono tabular-nums text-[10px] transition-colors ${
												active
													? "bg-emerald-400 border-emerald-400 text-neutral-950 font-semibold"
													: "bg-[#070B09] border-white/15 text-neutral-500 group-hover:border-white/30 group-hover:text-neutral-300"
											}`}
										>
											{i + 1}
										</span>
										<span className="min-w-0 pb-1">
											<span
												className={`block text-sm font-semibold transition-colors ${
													active ? "text-white" : "text-neutral-300 group-hover:text-white"
												}`}
											>
												{stage.name}
											</span>
											<span className="block text-[11px] text-neutral-500 leading-relaxed">
												{stage.desc}
											</span>
										</span>
									</button>
								</li>
							);
						})}
					</ol>

					{/* Detail for the selected stage, then the four exits */}
					<div className="lg:col-span-7 flex flex-col gap-4">
						<div className="flex-1 flex flex-col justify-center p-6 sm:p-7 rounded-2xl bg-neutral-900/60 border border-white/[0.08]">
							<AnimatePresence mode="wait">
								<motion.div
									key={selected}
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									transition={{ duration: 0.2 }}
								>
									<span className="font-mono tabular-nums text-[11px] text-neutral-500">
										Stage {String(selected + 1).padStart(2, "0")} of 09
									</span>
									<h3 className="text-lg font-bold text-white mt-1 mb-3">{current.name}</h3>
									<p className="text-sm text-neutral-400 leading-relaxed">{current.detail}</p>

									<div className="mt-6 pt-5 border-t border-white/[0.08]">
										<span className="text-[11px] font-semibold text-neutral-300 block mb-1.5">
											What moves it forward
										</span>
										<p className="text-sm text-neutral-400 leading-relaxed">{current.next}</p>
									</div>
								</motion.div>
							</AnimatePresence>
						</div>

						<div className="p-6 sm:p-7 rounded-2xl bg-neutral-900/40 border border-white/[0.06]">
							<span className="text-xs font-semibold text-neutral-300 block">
								A deal can leave from any stage above
							</span>
							<p className="text-[11px] text-neutral-500 mt-1 mb-4 leading-relaxed">
								These four are states, not steps. A deal is never advanced into or out of them
								automatically.
							</p>

							<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{EXITS.map((exit) => (
									<li
										key={exit.name}
										className="p-3 rounded-xl bg-black/30 border border-white/[0.06] flex items-start gap-2.5"
									>
										<ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
										<span className="min-w-0">
											<span className="block text-xs font-semibold text-neutral-200">
												{exit.name}
											</span>
											<span className="block text-[11px] text-neutral-500">{exit.note}</span>
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
