import Wordmark from "./Mark";

const LINKS = [
	["#pipeline", "Pipeline"],
	["#features", "Platform"],
	["#deal-room", "Deal Room"],
	["#simulator", "Coverage"],
	["#mcp", "MCP"],
	["#backed-by", "GTMX Ventures"],
];

export default function Footer() {
	return (
		<footer className="border-t border-white/[0.06] bg-[#040705] text-neutral-400 text-xs py-12 relative z-10">
			<div className="max-w-6xl mx-auto px-6 lg:px-8">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
					<Wordmark size="text-sm" />

					<nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
						{LINKS.map(([href, label]) => (
							<a key={href} href={href} className="hover:text-white transition-colors">
								{label}
							</a>
						))}
					</nav>
				</div>

				<div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-neutral-500">
					<p>© {new Date().getFullYear()} InvestorIQ. Built by GTMX Ventures.</p>
					<p>Figures read from the production database on 17 August 2026.</p>
				</div>
			</div>
		</footer>
	);
}
