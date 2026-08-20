import { type ReactElement, useState } from "react";
import { BorderBeam } from "@/components/BorderBeam";
import { COVERAGE } from "@/data/coverage";
import { ADVANCING_STAGES, TERMINAL_STAGES } from "@/data/dealRoom";

/**
 * Deal room — the thirteen stages, explorable.
 *
 * This claim was previously a paragraph. A paragraph asserting "thirteen
 * stages, nine forward, four terminal" asks to be taken on trust; a list you
 * can click through is the claim itself, and it costs nothing to verify.
 *
 * The nine advancing stages are threaded on one continuous rule so the sequence
 * is visible as a spine rather than as nine detached rows. The four terminal
 * states sit apart and unnumbered on purpose — they are states, not steps, and
 * numbering them ten through thirteen would imply a deal passes through them in
 * order.
 *
 * Selecting a stage swaps the panel beside it. `aria-pressed` rather than
 * role="tab": the list stays visible and keeps its own meaning, which is not
 * what a tablist promises.
 */
export function DealRoom(): ReactElement {
	// Opens on Active Due Diligence — the stage the copy calls out as the one
	// that stalls, so the default selection is the one worth reading.
	const [selected, setSelected] = useState(5);
	const current = ADVANCING_STAGES[selected];

	return (
		<section
			aria-labelledby="deal-room-heading"
			id="deal-room"
			className="scroll-mt-4 border-line border-t"
		>
			<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
				<div className="max-w-2xl">
					<p className="eyebrow">The deal room</p>
					<h2
						id="deal-room-heading"
						className="mt-5 text-balance font-display font-bold text-[clamp(2rem,4.5vw,3.25rem)] text-ink leading-[1] tracking-[-0.03em]"
					>
						{COVERAGE.advancingStages} stages forward. {COVERAGE.terminalStages} ways out.
					</h2>
					<p className="mt-5 text-ink-muted leading-[1.7]">
						Every fund on your raise sits in exactly one of {COVERAGE.dealRoomStages} stages, and
						the Tracking Agent is what keeps it there honestly. Nine carry a conversation toward a
						signature. The other four record how one ended — which is the half nobody writes down.
					</p>
				</div>

				<div className="mt-14 grid items-stretch gap-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
					{/* The spine */}
					<ol className="relative">
						{/* One rule behind the nodes, inset so it starts and ends inside the
						    first and last markers rather than dangling past them. */}
						<span aria-hidden="true" className="absolute top-5 bottom-5 left-4 w-px bg-line" />
						{ADVANCING_STAGES.map((stage, index) => {
							const active = index === selected;
							return (
								<li key={stage.id}>
									<button
										aria-pressed={active}
										className="group flex w-full items-start gap-4 py-2 text-left"
										onClick={() => setSelected(index)}
										type="button"
									>
										{/* bg-base, not transparent: the marker has to knock a hole in
										    the rule behind it, which a transparent circle would not. */}
										<span
											className={`relative z-10 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border font-mono text-[0.6875rem] tabular-nums transition-colors duration-200 ${
												active
													? "border-accent bg-accent text-accent-ink"
													: "border-line bg-base text-ink-subtle group-hover:border-ink-subtle group-hover:text-ink"
											}`}
										>
											{String(index + 1).padStart(2, "0")}
										</span>
										<span className="min-w-0 pb-1">
											<span
												className={`block font-display font-medium text-sm transition-colors duration-200 ${
													active ? "text-ink" : "text-ink-muted group-hover:text-ink"
												}`}
											>
												{stage.name}
											</span>
											<span className="mt-0.5 block text-ink-subtle text-xs leading-[1.5]">
												{stage.summary}
											</span>
										</span>
									</button>
								</li>
							);
						})}
					</ol>

					<div className="flex flex-col gap-4">
						<div className="relative flex-1 overflow-hidden rounded-card border border-line bg-surface p-7 sm:p-9">
							<BorderBeam delay={2} duration={16} />
							<p className="font-mono text-[0.6875rem] text-ink-subtle tabular-nums">
								Stage {String(selected + 1).padStart(2, "0")} of{" "}
								{String(COVERAGE.advancingStages).padStart(2, "0")}
							</p>
							<h3 className="mt-2 font-display font-bold text-2xl text-ink tracking-[-0.02em]">
								{current.name}
							</h3>
							<p className="mt-4 max-w-xl text-ink-muted leading-[1.7]">{current.detail}</p>

							<div className="mt-7 border-line border-t pt-6">
								<p className="eyebrow">What moves it forward</p>
								<p className="mt-2.5 max-w-xl text-ink leading-[1.6]">{current.next}</p>
							</div>
						</div>

						<div className="rounded-card border border-line bg-surface p-7 sm:p-9">
							<p className="font-display font-medium text-ink text-sm">
								A deal can leave from any stage above
							</p>
							<p className="mt-1.5 text-ink-subtle text-xs leading-[1.6]">
								These four are states, not steps. Nothing is advanced into or out of them
								automatically.
							</p>
							<ul className="mt-5 grid gap-2 sm:grid-cols-2">
								{TERMINAL_STAGES.map((stage) => (
									<li
										key={stage.id}
										className="rounded-control border border-line bg-base px-4 py-3"
									>
										<p className="font-display font-medium text-ink text-sm">{stage.name}</p>
										<p className="mt-0.5 text-ink-subtle text-xs">{stage.note}</p>
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
