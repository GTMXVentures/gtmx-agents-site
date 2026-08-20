import { type ReactElement, useEffect, useRef } from "react";

/**
 * Global ambient mouse-following radial gradient.
 *
 * Tracks the cursor at 120 FPS via requestAnimationFrame and directly sets
 * transform/translate on a single pointer-events-none layer, keeping main-thread
 * React renders completely free.
 */
export function GlobalMouseSpotlight(): ReactElement {
	const lightRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let rafId: number;
		let targetX = -1000;
		let targetY = -1000;
		let currentX = -1000;
		let currentY = -1000;

		const handleMouseMove = (e: globalThis.MouseEvent) => {
			targetX = e.clientX;
			targetY = e.clientY;
		};

		const update = () => {
			// Smooth trailing physics (lerp) for natural organic movement
			currentX += (targetX - currentX) * 0.12;
			currentY += (targetY - currentY) * 0.12;

			if (lightRef.current) {
				lightRef.current.style.transform = `translate3d(${currentX - 350}px, ${currentY - 350}px, 0)`;
			}
			rafId = requestAnimationFrame(update);
		};

		window.addEventListener("mousemove", handleMouseMove, { passive: true });
		rafId = requestAnimationFrame(update);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			cancelAnimationFrame(rafId);
		};
	}, []);

	return (
		<div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
			<div
				ref={lightRef}
				className="pointer-events-none absolute top-0 left-0 size-[700px] rounded-full will-change-transform opacity-70"
				style={{
					background: "radial-gradient(circle, rgb(72 224 138 / 0.05) 0%, transparent 65%)",
				}}
			/>
		</div>
	);
}
