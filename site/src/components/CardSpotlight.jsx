import { useRef, useState } from "react";

export default function CardSpotlight({ children, className = "" }) {
	const divRef = useRef(null);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [opacity, setOpacity] = useState(0);

	const handleMouseMove = (e) => {
		if (!divRef.current) return;

		const div = divRef.current;
		const rect = div.getBoundingClientRect();

		setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
	};

	const handleMouseEnter = () => {
		setOpacity(1);
	};

	const handleMouseLeave = () => {
		setOpacity(0);
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: mouse movement only drives a decorative spotlight.
		<div
			ref={divRef}
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className={`relative rounded-2xl border border-white/[0.08] bg-[#0B120E]/80 p-7 overflow-hidden transition-all duration-300 ${className}`}
		>
			{/* Subtle Spotlight Glow Overlay */}
			<div
				className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
				style={{
					opacity,
					background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(53, 200, 138, 0.08), transparent 80%)`,
				}}
			/>
			{/* Border Spotlight */}
			<div
				className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300"
				style={{
					opacity,
					border: "1px solid rgba(53, 200, 138, 0.3)",
					maskImage: `radial-gradient(200px circle at ${position.x}px ${position.y}px, black 40%, transparent 100%)`,
					WebkitMaskImage: `radial-gradient(200px circle at ${position.x}px ${position.y}px, black 40%, transparent 100%)`,
				}}
			/>
			<div className="relative z-10">{children}</div>
		</div>
	);
}
