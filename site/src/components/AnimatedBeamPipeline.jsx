import { FileText, Layers, ShieldCheck, Sparkles, UserCheck, Webhook } from "lucide-react";

export default function AnimatedBeamPipeline() {
	return (
		<section
			id="pipeline"
			className="py-24 relative z-10 bg-[#070B09] border-t border-white/[0.06]"
		>
			<div className="max-w-6xl mx-auto px-6 lg:px-8">
				{/* Section Title */}
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
						How Deal Signals Flow Into Conversion
					</h2>
					<p className="mt-4 text-neutral-400 text-base leading-relaxed">
						From automated inbound deck ingestion and ecosystem webhooks to verified cheque mandates
						and canonical Deal Room progression.
					</p>
				</div>

				{/* Visual Pipeline Container */}
				<div className="w-full rounded-2xl glass-panel p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-white/[0.08]">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-10">
						{/* Column 1: Multi-Channel Inbound */}
						<div className="space-y-4">
							<span className="text-xs font-semibold text-neutral-400 block mb-2">
								Inbound Sourcing
							</span>

							<div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/[0.08] flex items-center gap-3.5">
								<div className="p-2.5 rounded-xl bg-white/[0.04] text-neutral-300">
									<FileText className="w-4 h-4" />
								</div>
								<div>
									<h4 className="font-semibold text-xs text-white">Deck & Memo Parsing</h4>
									<p className="text-[11px] text-neutral-400">
										Instant AI thesis & metric extraction
									</p>
								</div>
							</div>

							<div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/[0.08] flex items-center gap-3.5">
								<div className="p-2.5 rounded-xl bg-white/[0.04] text-neutral-300">
									<Webhook className="w-4 h-4" />
								</div>
								<div>
									<h4 className="font-semibold text-xs text-white">Ecosystem Webhooks</h4>
									<p className="text-[11px] text-neutral-400">
										Real-time syndicate & CRM pipeline sync
									</p>
								</div>
							</div>
						</div>

						{/* Column 2: Central AI Intelligence Engine (Highlighted) */}
						<div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-emerald-500/10 via-neutral-900/90 to-neutral-950 border border-white/15 text-center relative shadow-xl shadow-black/40">
							<div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/15 mx-auto flex items-center justify-center text-neutral-400 mb-4 shadow-sm">
								<Sparkles className="w-6 h-6 animate-pulse" />
							</div>

							<span className="text-xs font-semibold text-neutral-400 block mb-1">
								Intelligence Hub
							</span>
							<h3 className="text-base font-bold text-white mb-2">InvestorIQ Scoring Engine</h3>
							<p className="text-xs text-neutral-400 leading-relaxed mb-4 font-normal">
								768-dim vector embeddings match thesis alignment, check sizes, and stage preferences
								across 7,033 investor firms.
							</p>

							<div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-[11px] text-neutral-400 font-medium flex items-center justify-center gap-1.5">
								<ShieldCheck className="w-3.5 h-3.5 shrink-0" />
								<span>Firms only, never people</span>
							</div>
						</div>

						{/* Column 3: High-Conviction Outcomes */}
						<div className="space-y-4">
							<span className="text-xs font-semibold text-neutral-400 block mb-2">
								Deal Execution
							</span>

							<div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/[0.08] flex items-center gap-3.5">
								<div className="p-2.5 rounded-xl bg-white/[0.04] text-neutral-300">
									<UserCheck className="w-4 h-4" />
								</div>
								<div>
									<h4 className="font-semibold text-xs text-white">Partner Decision Makers</h4>
									<p className="text-[11px] text-neutral-400">Verified partner emails & leads</p>
								</div>
							</div>

							<div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/[0.08] flex items-center gap-3.5">
								<div className="p-2.5 rounded-xl bg-white/[0.04] text-neutral-300">
									<Layers className="w-4 h-4" />
								</div>
								<div>
									<h4 className="font-semibold text-xs text-white">13-Stage Deal Room</h4>
									<p className="text-[11px] text-neutral-400">
										From initial outreach to SHA closing
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
