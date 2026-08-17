/**
 * The mark is the argument the product makes: three rules of decreasing width,
 * for narrowing 7,033 firms down to the few that lead your round. Monochrome,
 * legible at 14px, and it means something — unlike a sparkle in a gradient box.
 */
export function Mark({ className = "w-4 h-4" }) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
			<rect x="2" y="5" width="20" height="2.6" rx="1.3" />
			<rect x="2" y="10.7" width="12" height="2.6" rx="1.3" />
			<rect x="2" y="16.4" width="6" height="2.6" rx="1.3" />
		</svg>
	);
}

export default function Wordmark({ className = "", size = "text-base" }) {
	return (
		<span className={`inline-flex items-center gap-2.5 ${className}`}>
			<Mark className="w-4 h-4 text-emerald-400 shrink-0" />
			<span className={`font-bold ${size} tracking-tight text-white`}>InvestorIQ</span>
		</span>
	);
}
