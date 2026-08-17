import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

/**
 * The "live" indicator: a solid signal-green dot with a ring expanding out of
 * it. Used wherever the page claims something is currently running — the hero
 * status line, the pre-launch badge, the agent-team panel header.
 *
 * Two stacked spans rather than one element with a box-shadow animation: the
 * ring has to scale past the dot's own bounds, and animating `transform` on a
 * separate absolutely-positioned layer keeps the whole thing on the compositor.
 * A box-shadow keyframe would repaint on every frame, for a decoration that
 * loops forever on every visitor's machine.
 *
 * aria-hidden throughout — this is a redundant rendering of the adjacent text
 * ("agent_team online"), and announcing an unlabelled dot to a screen reader
 * adds noise without adding information. Whatever this dot sits next to must
 * therefore say the status in words.
 */
export function PulseDot({ className }: { className?: string }): ReactElement {
	return (
		<span aria-hidden="true" className={cn("relative inline-flex size-1.5 shrink-0", className)}>
			<span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent" />
			<span className="relative inline-flex size-1.5 rounded-full bg-accent" />
		</span>
	);
}
