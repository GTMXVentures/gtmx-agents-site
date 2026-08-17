import { AnimatePresence, motion } from "framer-motion";
import { Building2, CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";

const SECTORS = [
	"AI / ML",
	"B2B SaaS",
	"Fintech",
	"DeepTech",
	"Healthcare",
	"Consumer / D2C",
	"ClimateTech / CleanTech",
];

const STAGES = ["Seed", "Pre-Series A", "Series A"];

// Live counts, queried from the production database on 17 August 2026.
// [ firms claiming that sector at that stage, firms with a reachable partner ]
const COVERAGE = {
	"AI / ML": { Seed: [1797, 653], "Pre-Series A": [311, 149], "Series A": [1297, 525] },
	"B2B SaaS": { Seed: [1756, 642], "Pre-Series A": [331, 175], "Series A": [1267, 528] },
	Fintech: { Seed: [1547, 633], "Pre-Series A": [306, 162], "Series A": [1261, 542] },
	DeepTech: { Seed: [1004, 399], "Pre-Series A": [184, 99], "Series A": [700, 309] },
	Healthcare: { Seed: [979, 429], "Pre-Series A": [208, 113], "Series A": [766, 373] },
	"Consumer / D2C": { Seed: [976, 402], "Pre-Series A": [210, 118], "Series A": [642, 330] },
	"ClimateTech / CleanTech": {
		Seed: [571, 249],
		"Pre-Series A": [124, 67],
		"Series A": [394, 190],
	},
};

export default function MatchSimulator() {
	const [selectedSector, setSelectedSector] = useState("AI / ML");
	const [selectedStage, setSelectedStage] = useState("Series A");

	const [funds, reachable] = COVERAGE[selectedSector][selectedStage];
	const share = Math.round((reachable / funds) * 100);

	return (
		<section
			id="simulator"
			className="py-24 relative z-10 bg-[#080D0A] border-t border-white/[0.06]"
		>
			<div className="max-w-6xl mx-auto px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center max-w-3xl mx-auto mb-14">
					<h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
						Check the database before you pitch
					</h2>
					<p className="mt-4 text-neutral-400 text-base leading-relaxed">
						Pick your sector and stage. These are counts from the live database, the same query the
						product runs. No sample data.
					</p>
				</div>

				<div className="w-full rounded-2xl glass-panel p-6 sm:p-10 shadow-2xl border border-white/[0.08]">
					{/* Filter Bar */}
					<div className="space-y-6 mb-8 pb-8 border-b border-white/[0.08]">
						<div>
							<span className="text-xs font-semibold text-neutral-400 block mb-3">
								1. Target Industry
							</span>
							<div className="flex flex-wrap gap-2">
								{SECTORS.map((sector) => (
									<button
										type="button"
										key={sector}
										onClick={() => setSelectedSector(sector)}
										className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
											selectedSector === sector
												? "bg-emerald-500/12 border border-emerald-400/40 text-emerald-300 shadow-sm"
												: "bg-white/[0.03] border border-white/[0.06] text-neutral-300 hover:bg-white/[0.06]"
										}`}
									>
										{sector}
									</button>
								))}
							</div>
						</div>

						<div>
							<span className="text-xs font-semibold text-neutral-400 block mb-3">
								2. Funding Stage
							</span>
							<div className="flex flex-wrap gap-2">
								{STAGES.map((stage) => (
									<button
										type="button"
										key={stage}
										onClick={() => setSelectedStage(stage)}
										className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
											selectedStage === stage
												? "bg-white text-neutral-950 font-semibold shadow-sm"
												: "bg-white/[0.03] border border-white/[0.06] text-neutral-300 hover:bg-white/[0.06]"
										}`}
									>
										{stage}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Results */}
					<div>
						<div className="flex flex-wrap items-center justify-between gap-3 mb-5 text-xs font-medium text-neutral-400">
							<span>
								Coverage for <strong className="text-white">{selectedSector}</strong> (
								{selectedStage})
							</span>
							<span className="text-neutral-400 flex items-center gap-1 font-semibold">
								<CheckCircle2 className="w-3.5 h-3.5" /> Counted in the live database
							</span>
						</div>

						<AnimatePresence mode="wait">
							<motion.div
								key={`${selectedSector}-${selectedStage}`}
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2 }}
							>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<div className="p-5 rounded-2xl bg-neutral-900/40 border border-white/[0.06]">
										<div className="flex items-center gap-2 text-[11px] text-neutral-400 font-semibold tracking-wider">
											<Building2 className="w-3.5 h-3.5 text-neutral-500" /> Firms in scope
										</div>
										<div className="mt-2 font-mono tabular-nums text-3xl sm:text-4xl font-semibold text-white tracking-tight">
											{funds.toLocaleString("en-US")}
										</div>
										<p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
											say they invest in {selectedSector} at {selectedStage}
										</p>
									</div>

									<div className="p-5 rounded-2xl bg-neutral-900/40 border border-white/15">
										<div className="flex items-center gap-2 text-[11px] text-neutral-400 font-semibold tracking-wider">
											<Mail className="w-3.5 h-3.5 text-emerald-400" /> Reachable today
										</div>
										<div className="mt-2 font-mono tabular-nums text-3xl sm:text-4xl font-semibold text-emerald-300 tracking-tight">
											{reachable.toLocaleString("en-US")}
										</div>
										<p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
											have a named partner with a verified email
										</p>
									</div>
								</div>

								{/* Proportion */}
								<div className="mt-5 p-5 rounded-2xl bg-black/40 border border-white/5">
									<div className="flex justify-between text-xs text-neutral-400 mb-2">
										<span>Share you can actually contact</span>
										<span className="font-semibold text-white">{share}%</span>
									</div>
									<div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden">
										<motion.div
											initial={{ width: 0 }}
											animate={{ width: `${share}%` }}
											transition={{ duration: 0.5 }}
											className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"
										/>
									</div>
									<p className="mt-3 text-[11px] text-neutral-500 leading-relaxed">
										The rest are on file without a partner contact yet. Nightly enrichment keeps
										working on them.
									</p>
								</div>
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</div>
		</section>
	);
}
