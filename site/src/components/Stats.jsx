import CardSpotlight from "./CardSpotlight";

// Counts read from the production database on 17 August 2026.
const STATS_DATA = [
	{
		value: "7,033",
		label: "Investor Firms",
		desc: "Institutional VCs, growth funds, and family offices",
	},
	{
		value: "22,402",
		label: "Named Partners",
		desc: "4,329 firms have at least one partner attached",
	},
	{
		value: "8,959",
		label: "Verified Emails",
		desc: "Partners you can reach directly today",
	},
	{
		value: "13 Stages",
		label: "Canonical Deal Room",
		desc: "Standardized funnel from outreach to SHA closing",
	},
];

export default function Stats() {
	return (
		<section id="stats" className="py-24 relative bg-[#070B09] border-t border-white/[0.06]">
			<div className="max-w-6xl mx-auto px-6 lg:px-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{STATS_DATA.map((item) => (
						<CardSpotlight
							key={item.label}
							className="p-7 rounded-2xl glass-panel relative overflow-hidden transition-all group"
						>
							<div className="font-mono tabular-nums text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-1">
								{item.value}
							</div>
							<div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
								{item.label}
							</div>
							<p className="text-xs text-neutral-400 leading-relaxed font-normal">{item.desc}</p>
						</CardSpotlight>
					))}
				</div>
			</div>
		</section>
	);
}
