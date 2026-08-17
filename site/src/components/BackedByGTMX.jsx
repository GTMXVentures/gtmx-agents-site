import { ArrowUpRight, Compass, Network, Rocket } from "lucide-react";
import CardSpotlight from "./CardSpotlight";

export default function BackedByGTMX() {
	return (
		<section
			id="backed-by"
			className="py-24 relative z-10 bg-[#040705] border-t border-white/[0.06]"
		>
			<div className="max-w-6xl mx-auto px-6 lg:px-8">
				{/* Single, non-repetitive clean showcase card */}
				<CardSpotlight className="p-8 sm:p-12 glass-panel border border-white/[0.08] text-center relative overflow-hidden">
					{/* Ambient Background Aura */}
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />

					<div className="relative z-10 max-w-2xl mx-auto">
						{/* Official Logo Display */}
						<div className="flex justify-center mb-6">
							<div className="p-3.5 px-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-2xl inline-flex items-center justify-center">
								<img
									src="https://cdn.prod.website-files.com/67715481d488bf6feb9c37a5/68badd25ac9bac7308c475a1_ventures%20logo.svg"
									alt="GTMX Ventures"
									className="h-9 sm:h-10 w-auto object-contain brightness-105"
								/>
							</div>
						</div>

						{/* Concise, non-repetitive copy */}
						<p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-8 font-normal max-w-xl mx-auto">
							InvestorIQ is incubated within the GTMX Ventures portfolio to build next-generation
							autonomous software for venture capital, founder fundraising, and institutional deal
							syndication.
						</p>

						{/* 3 Concise Value Pillars */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 border-t border-white/[0.06] text-left">
							<div className="p-4 rounded-xl bg-black/40 border border-white/5">
								<div className="flex items-center gap-2 mb-1.5">
									<Rocket className="w-3.5 h-3.5 text-neutral-400" />
									<span className="text-[11px] text-neutral-400 font-semibold uppercase">
										Incubation
									</span>
								</div>
								<span className="text-xs text-neutral-300 font-medium block">
									Purpose-built for high-growth tech founders
								</span>
							</div>

							<div className="p-4 rounded-xl bg-black/40 border border-white/5">
								<div className="flex items-center gap-2 mb-1.5">
									<Network className="w-3.5 h-3.5 text-neutral-400" />
									<span className="text-[11px] text-neutral-400 font-semibold uppercase">
										Syndicate
									</span>
								</div>
								<span className="text-xs text-neutral-300 font-medium block">
									Cross-border Tier-1 venture network
								</span>
							</div>

							<div className="p-4 rounded-xl bg-black/40 border border-white/5">
								<div className="flex items-center gap-2 mb-1.5">
									<Compass className="w-3.5 h-3.5 text-neutral-400" />
									<span className="text-[11px] text-neutral-400 font-semibold uppercase">
										Advisory
									</span>
								</div>
								<span className="text-xs text-neutral-300 font-medium block">
									Integrated GTM & fundraising readiness
								</span>
							</div>
						</div>

						{/* External Link */}
						<div className="mt-8">
							<a
								href="https://gtmxventures.com"
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white font-medium transition-colors"
							>
								<span>Learn more at gtmxventures.com</span>
								<ArrowUpRight className="w-3.5 h-3.5" />
							</a>
						</div>
					</div>
				</CardSpotlight>
			</div>
		</section>
	);
}
