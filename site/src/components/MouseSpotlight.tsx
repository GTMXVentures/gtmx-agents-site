import { type MouseEvent, type ReactElement, useRef, useState } from "react";

interface MouseSpotlightProps {
	readonly className?: string;
	readonly size?: number;
	readonly opacity?: number;
}

/**
 * High-performance mouse-following gradient spotlight for cards and containers.
 *
 * Uses direct CSS custom properties (--mouse-x, --mouse-y) on mousemove to
 * achieve silky 120 FPS tracking without triggering React component re-renders.
 */
export function MouseSpotlight({
	className = "",
	size = 450,
	opacity = 0.12,
}: MouseSpotlightProps): ReactElement {
	const containerRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
		const target = containerRef.current;
		if (!target) return;
		const rect = target.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		target.style.setProperty("--mouse-x", `${x}px`);
		target.style.setProperty("--mouse-y", `${y}px`);
	};

	return (
		<div
			ref={containerRef}
			onMouseMove={handleMouseMove}
			onMouseEnter={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}
			aria-hidden="true"
			className={`pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit] ${className}`}
		>
			<div
				className="pointer-events-none absolute inset-0 transition-opacity duration-300"
				style={{
					opacity: visible ? 1 : 0,
					background: `radial-gradient(${size}px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgb(72 224 138 / ${opacity}), transparent 75%)`,
				}}
			/>
		</div>
	);
}
