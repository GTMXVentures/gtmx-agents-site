import type { CSSProperties, ReactElement } from "react";

interface BorderBeamProps {
	/** Length of the travelling light in px. */
	readonly size?: number;
	/** Seconds for one full lap. Slow on purpose — see index.css motion notes. */
	readonly duration?: number;
	/** Seconds before the lap starts, for staggering two beams on one page. */
	readonly delay?: number;
}

/**
 * A light that travels once around its parent's border.
 *
 * Ambient, not reporting — it says nothing about state, which is why it is kept
 * away from figures and status pills (see the motion block in index.css).
 *
 * Implemented with offset-path/offset-distance rather than a rotating conic
 * gradient: the beam then follows the parent's border radius exactly, and only
 * `offset-distance` animates, which the compositor can handle without laying
 * out or painting the parent on every frame. The parent must be `relative` and
 * should clip, or the beam will ride outside the corner radius.
 *
 * `aria-hidden` because there is nothing here to announce, and the reduced-motion
 * block in index.css parks it at the end of its path.
 */
export function BorderBeam({
	size = 220,
	duration = 14,
	delay = 0,
}: BorderBeamProps): ReactElement {
	return (
		<span
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
		>
			<span
				className="absolute aspect-square animate-border-beam bg-gradient-to-l from-accent via-accent/40 to-transparent"
				style={
					{
						width: size,
						offsetPath: "rect(0 auto auto 0 round var(--radius-card))",
						animationDuration: `${duration}s`,
						animationDelay: `${delay}s`,
					} as CSSProperties
				}
			/>
		</span>
	);
}
