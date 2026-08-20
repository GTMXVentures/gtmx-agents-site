import { type ReactElement, useEffect, useRef } from "react";

interface MouseSpotlightProps {
	readonly className?: string;
	readonly size?: number;
	readonly opacity?: number;
	readonly color?: string;
}

/**
 * High-performance mouse-following spotlight for cards and containers.
 *
 * Attaches directly to the parent DOM element's pointermove events so cursor
 * interaction is detected reliably even over child text/content, and updates
 * CSS variables without causing React component re-renders.
 */
export function MouseSpotlight({
	className = "",
	size = 450,
	opacity = 0.22,
	color = "72 224 138",
}: MouseSpotlightProps): ReactElement {
	const overlayRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const overlay = overlayRef.current;
		if (!overlay) return;
		const parent = overlay.parentElement;
		if (!parent) return;

		const onPointerMove = (e: PointerEvent) => {
			const rect = parent.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			overlay.style.setProperty("--mouse-x", `${x}px`);
			overlay.style.setProperty("--mouse-y", `${y}px`);
			overlay.style.opacity = "1";
		};

		const onPointerLeave = () => {
			overlay.style.opacity = "0";
		};

		parent.addEventListener("pointermove", onPointerMove);
		parent.addEventListener("pointerleave", onPointerLeave);

		return () => {
			parent.removeEventListener("pointermove", onPointerMove);
			parent.removeEventListener("pointerleave", onPointerLeave);
		};
	}, []);

	return (
		<div
			ref={overlayRef}
			aria-hidden="true"
			className={`pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit] opacity-0 transition-opacity duration-300 ${className}`}
			style={{
				background: `radial-gradient(${size}px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), rgb(${color} / ${opacity}), transparent 70%)`,
			}}
		/>
	);
}
