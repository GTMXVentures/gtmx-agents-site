import { Building2, Check, Inbox, Layers, UserCheck } from "lucide-react";
import CardSpotlight from "./CardSpotlight";

export default function BentoGrid() {
	return (
		<section
			id="features"
			className="py-24 relative z-10 bg-[#070B09] border-t border-white/[0.06]"
		>
			<div className="max-w-6xl mx-auto px-6 lg:px-8">
				{/* Section Header */}
				<div className="max-w-3xl mb-16">
					<h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
						Engineered for Modern Dealmaking
					</h2>
					<p className="mt-4 text-neutral-400 text-base leading-relaxed">
						InvestorIQ enriches, deduplicates, and validates 7,033 investor firms nightly, so your
						team spends its time on the 4,329 that have a named partner attached.
					</p>
				</div>

				{/* Bento Grid Layout */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Card 1: 2-Column Wide - Firm & Cheque Intelligence */}
					<CardSpotlight className="md:col-span-2 rounded-2xl p-7 sm:p-9 glass-panel relative overflow-hidden transition-all group">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300">
									<Building2 className="w-5 h-5" />
								</div>
								<span className="text-xs font-semibold text-neutral-400">
									Fund & Cheque Intelligence
								</span>
							</div>
							<span className="text-xs font-medium text-neutral-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/10">
								7,033 Investor Firms
							</span>
						</div>

						<h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">
							Confirmed Cheque Bands & Allocation Mandates
						</h3>
						<p className="text-neutral-400 text-sm leading-relaxed max-w-xl mb-6">
							Firms are enriched with cheque citations, stage preferences, fund status, and AUM tier
							where a source exists. 6,058 of 7,033 carry both a sector and a stage; the rest stay
							untagged rather than guessed at.
						</p>

						{/* Clean Tabular Data Box */}
						<div className="rounded-2xl bg-neutral-950/60 border border-white/[0.07] p-4 text-xs space-y-3">
							<div className="flex items-center justify-between pb-2 border-b border-white/5">
								<span className="font-semibold text-white">Growth fund · Mumbai</span>
								<span className="text-neutral-400 text-[11px] font-medium">
									Status: Actively allocating
								</span>
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
								<div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
									<span className="text-[11px] text-neutral-500 block">Typical Cheque</span>
									<span className="font-semibold text-white mt-0.5 block">$15M – $45M</span>
								</div>
								<div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
									<span className="text-[11px] text-neutral-500 block">Stage Focus</span>
									<span className="font-semibold text-neutral-200 mt-0.5 block">
										Series B, Growth
									</span>
								</div>
								<div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
									<span className="text-[11px] text-neutral-500 block">Lead Role</span>
									<span className="font-semibold text-white mt-0.5 block">
										Senior Managing Director
									</span>
								</div>
								<div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
									<span className="text-[11px] text-neutral-500 block">Partner contact</span>
									<span className="font-semibold text-neutral-400 mt-0.5 block">Email on file</span>
								</div>
							</div>
						</div>
					</CardSpotlight>

					{/* Card 2: 1-Column - Firms vs people */}
					<CardSpotlight className="rounded-2xl p-7 sm:p-9 glass-panel relative overflow-hidden transition-all group">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300">
								<UserCheck className="w-5 h-5" />
							</div>
							<span className="text-xs font-semibold text-neutral-400">Firms vs People</span>
						</div>

						<h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">
							Angel vs Firm Separation
						</h3>
						<p className="text-neutral-400 text-sm leading-relaxed mb-6">
							The firm list holds organisations only. Individual angels are routed to Contacts, so a
							person's name never turns up as a fund.
						</p>

						<div className="space-y-2.5 text-xs">
							<div className="p-3 rounded-xl bg-neutral-950/60 border border-white/5 flex items-center justify-between">
								<span className="text-neutral-300">Individual angel</span>
								<span className="text-neutral-400 bg-white/[0.04] px-2 py-0.5 rounded-xl font-medium">
									→ Contacts Directory
								</span>
							</div>
							<div className="p-3 rounded-xl bg-neutral-950/60 border border-white/5 flex items-center justify-between">
								<span className="text-neutral-300">Institutional VC</span>
								<span className="text-neutral-400 bg-white/[0.04] px-2 py-0.5 rounded-xl font-medium">
									→ Firms Directory
								</span>
							</div>
						</div>
					</CardSpotlight>

					{/* Card 3: 1-Column - Inbound Sourcing */}
					<CardSpotlight className="rounded-2xl p-7 sm:p-9 glass-panel relative overflow-hidden transition-all group">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300">
								<Inbox className="w-5 h-5" />
							</div>
							<span className="text-xs font-semibold text-neutral-400">Inbound Automation</span>
						</div>

						<h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">
							Unified Deal Ingestion
						</h3>
						<p className="text-neutral-400 text-sm leading-relaxed mb-6">
							Feed in pitch decks, founder memos, and syndicate links. InvestorIQ normalizes,
							deduplicates, and extracts metadata automatically.
						</p>

						<div className="p-3.5 rounded-xl bg-neutral-950/60 border border-white/5 text-xs space-y-2 text-neutral-300">
							<div className="flex items-center gap-2 text-neutral-400 font-medium">
								<Check className="w-4 h-4" /> Automated Entity Normalization
							</div>
							<div className="flex items-center gap-2 text-neutral-300 font-medium">
								<Check className="w-4 h-4 text-neutral-400" /> Review Staging Queue
							</div>
							<div className="flex items-center gap-2 text-neutral-300 font-medium">
								<Check className="w-4 h-4 text-neutral-400" /> Zero Manual CRM Entry
							</div>
						</div>
					</CardSpotlight>

					{/* Card 4: 2-Column Wide - 13-Stage Deal Room */}
					<CardSpotlight className="md:col-span-2 rounded-2xl p-7 sm:p-9 glass-panel relative overflow-hidden transition-all group">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300">
									<Layers className="w-5 h-5" />
								</div>
								<span className="text-xs font-semibold text-neutral-400">
									Deal Room Orchestration
								</span>
							</div>
							<span className="text-xs font-medium text-neutral-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/10">
								13 Canonical Stages
							</span>
						</div>

						<h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">
							Manage Active Investor Conversations
						</h3>
						<p className="text-neutral-400 text-sm leading-relaxed max-w-xl mb-6">
							Standardize deal pipelines across the 13 canonical stages. Nine move a deal forward.
							Four record how it ended.
						</p>

						{/* Clean Stage Progression Boxes */}
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
							<div className="p-3 rounded-xl bg-neutral-950/60 border border-white/5">
								<span className="text-[10px] text-neutral-500 block uppercase font-medium">
									Stage 01
								</span>
								<span className="font-semibold text-neutral-200 mt-0.5 block">Contacted</span>
							</div>
							<div className="p-3 rounded-xl bg-neutral-950/60 border border-white/15">
								<span className="text-[10px] text-neutral-400 block uppercase font-medium">
									Stage 04
								</span>
								<span className="font-semibold text-white mt-0.5 block">Active Diligence</span>
							</div>
							<div className="p-3 rounded-xl bg-neutral-950/60 border border-white/5">
								<span className="text-[10px] text-neutral-500 block uppercase font-medium">
									Stage 07
								</span>
								<span className="font-semibold text-neutral-200 mt-0.5 block">Term Sheet</span>
							</div>
							<div className="p-3 rounded-xl bg-neutral-950/60 border border-white/15">
								<span className="text-[10px] text-neutral-400 block uppercase font-medium">
									Stage 09
								</span>
								<span className="font-semibold text-neutral-200 font-bold mt-0.5 block">
									SHA Drafting
								</span>
							</div>
						</div>
					</CardSpotlight>
				</div>
			</div>
		</section>
	);
}
