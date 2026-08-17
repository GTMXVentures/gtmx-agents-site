import { Building2 } from "lucide-react";

// Sector coverage, counted in the production database on 17 August 2026.
// "reachable" = firms with at least one named partner with a verified email.
const SECTOR_COVERAGE = [
	{ name: "B2B SaaS", firms: "2,204", reachable: "754" },
	{ name: "AI / ML", firms: "2,179", reachable: "734" },
	{ name: "Fintech", firms: "2,090", reachable: "862" },
	{ name: "Enterprise Tech", firms: "1,556", reachable: "589" },
	{ name: "Healthcare", firms: "1,382", reachable: "569" },
	{ name: "DeepTech", firms: "1,331", reachable: "462" },
	{ name: "Consumer / D2C", firms: "1,299", reachable: "515" },
	{ name: "ClimateTech / CleanTech", firms: "856", reachable: "313" },
];

const MARQUEE_ITEMS = [
	...SECTOR_COVERAGE.map((sector) => ({ ...sector, key: `first-${sector.name}` })),
	...SECTOR_COVERAGE.map((sector) => ({ ...sector, key: `second-${sector.name}` })),
];

export default function InvestorMarquee() {
	return (
		<div
			id="coverage"
			className="py-12 border-y border-white/[0.06] bg-[#080D0A]/60 relative overflow-hidden"
		>
			{/* Edge Blur Gradients */}
			<div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#070B09] to-transparent z-10 pointer-events-none" />
			<div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#070B09] to-transparent z-10 pointer-events-none" />

			<div className="max-w-6xl mx-auto px-6 lg:px-8 mb-6 text-center">
				<span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
					Sector coverage across 7,033 investor firms
				</span>
			</div>

			{/* Infinite Scrolling Track */}
			<div className="flex gap-4 w-max animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused]">
				{MARQUEE_ITEMS.map((sector) => (
					<div
						key={sector.key}
						className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-neutral-900/50 border border-white/[0.07] hover:border-white/20 transition-colors whitespace-nowrap group"
					>
						<div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-400">
							<Building2 className="w-4 h-4" />
						</div>
						<div>
							<span className="font-semibold text-xs text-white group-hover:text-white transition-colors block">
								{sector.name}
							</span>
							<div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-0.5">
								<span>
									<strong className="text-neutral-200">{sector.firms}</strong> firms
								</span>
								<span>•</span>
								<span>
									<strong className="text-neutral-200">{sector.reachable}</strong> reachable
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
