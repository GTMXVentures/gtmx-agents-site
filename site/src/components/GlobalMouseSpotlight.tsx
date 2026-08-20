import { type ReactElement, useEffect, useRef } from "react";

/**
 * Global ambient cursor-following radial gradient overlay.
 *
 * Casts a smooth, organic ambient green glow that moves fluidly with the mouse
 * across all cards and sections at 120 FPS.
 */
export function GlobalMouseSpotlight(): ReactElement {
	const lightRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let rafId: number;
		let targetX = -1000;
		let targetY = -1000;
		let currentX = -1000;
		let currentY = -1000;

		const handleMouseMove = (e: MouseEvent) => {
			targetX = e.clientX;
			targetY = e.clientY;
		};

		const update = () => {
			currentX += (targetX - currentX) * 0.15;
			currentY += (targetY - currentY) * 0.15;

			if (lightRef.current) {
				lightRef.current.style.transform = `translate3d(${currentX - 300}px, ${currentY - 300}px, 0)`;
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
				className="pointer-events-none absolute top-0 left-0 size-[600px] rounded-full will-change-transform"
				style={{
					background:
						"radial-gradient(circle at center, rgb(72 224 138 / 0.12) 0%, rgb(72 224 138 / 0.04) 45%, transparent 70%)",
				}}
			/>
		</div>
	);
}
