import { useState } from "react";

export default function AllocationCalculator() {
	const [raiseAmount, setRaiseAmount] = useState(3.5); // in Millions
	const [stage, setStage] = useState("Series A");

	// Dynamic calculations based on raise amount
	const matchingFunds = Math.max(
		12,
		Math.round(raiseAmount * 38 + (stage === "Series A" ? 45 : 20)),
	);
	const partnerLeads = Math.round(matchingFunds * 2.8);
	const avgCheque = (raiseAmount * 0.45).toFixed(1);
	const estimatedWeeks = Math.max(4, Math.round(12 - raiseAmount * 0.4));

	return (
		<section
			id="calculator"
			className="py-24 relative z-10 bg-[#070B09] border-t border-white/[0.06]"
		>
			<div className="max-w-6xl mx-auto px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
						Calculate Your Deal Room Velocity
					</h2>
					<p className="mt-4 text-neutral-400 text-base leading-relaxed">
						Simulate current investor appetite, active allocation mandates, and expected timeline
						based on your target round parameters.
					</p>
				</div>

				{/* Metal.so-Style Interactive Card */}
				<div className="w-full rounded-2xl glass-panel p-8 sm:p-12 shadow-2xl border border-white/[0.08]">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
						{/* Left Sliders Controls (6 cols) */}
						<div className="lg:col-span-6 space-y-6">
							{/* Target Raise Slider */}
							<div>
								<div className="flex items-center justify-between text-xs mb-2">
									<span className="text-neutral-400 font-medium">Target Round Size</span>
									<span className="text-base font-bold text-neutral-400">
										${raiseAmount.toFixed(1)} Million USD
									</span>
								</div>

								<input
									type="range"
									min="0.5"
									max="25"
									step="0.5"
									value={raiseAmount}
									onChange={(e) => setRaiseAmount(parseFloat(e.target.value))}
									className="w-full h-2 bg-neutral-900 rounded-xl appearance-none cursor-pointer accent-emerald-400"
								/>

								<div className="flex justify-between text-[10px] text-neutral-500 mt-1.5 font-mono">
									<span>$500K (Seed)</span>
									<span>$10M (Series B)</span>
									<span>$25M (Growth)</span>
								</div>
							</div>

							{/* Stage Select Buttons */}
							<div>
								<span className="text-xs text-neutral-400 font-medium block mb-2">
									Target Funding Stage
								</span>
								<div className="grid grid-cols-3 gap-2">
									{["Seed", "Series A", "Series B"].map((s) => (
										<button
											type="button"
											key={s}
											onClick={() => setStage(s)}
											className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
												stage === s
													? "bg-white text-neutral-950 shadow-md"
													: "bg-black/40 border border-white/5 text-neutral-400 hover:text-neutral-200"
											}`}
										>
											{s}
										</button>
									))}
								</div>
							</div>
						</div>

						{/* Right Output Metrics Grid (6 cols) */}
						<div className="lg:col-span-6 grid grid-cols-2 gap-3.5">
							<div className="p-5 rounded-2xl bg-black/50 border border-white/5 hover:border-white/20 transition-all">
								<span className="text-[11px] text-neutral-400 font-semibold block mb-1">
									Active Funds
								</span>
								<div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
									{matchingFunds}+
								</div>
								<span className="text-[11px] text-neutral-400 mt-1 block">Mandate matching</span>
							</div>

							<div className="p-5 rounded-2xl bg-black/50 border border-white/5 hover:border-white/20 transition-all">
								<span className="text-[11px] text-neutral-400 font-semibold block mb-1">
									Partner Contacts
								</span>
								<div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
									{partnerLeads}+
								</div>
								<span className="text-[11px] text-neutral-400 mt-1 block">
									Direct verified emails
								</span>
							</div>

							<div className="p-5 rounded-2xl bg-black/50 border border-white/5 hover:border-white/20 transition-all">
								<span className="text-[11px] text-neutral-400 font-semibold block mb-1">
									Lead Cheque
								</span>
								<div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
									${avgCheque}M
								</div>
								<span className="text-[11px] text-neutral-400 mt-1 block">
									Typical anchor cheque
								</span>
							</div>

							<div className="p-5 rounded-2xl bg-black/50 border border-white/5 hover:border-white/20 transition-all">
								<span className="text-[11px] text-neutral-400 font-semibold block mb-1">
									Term Sheet Velocity
								</span>
								<div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
									~{estimatedWeeks} wks
								</div>
								<span className="text-[11px] text-neutral-400 mt-1 block">
									To signed term sheet
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
