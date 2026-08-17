import { useEffect, useRef } from "react";

export default function NetworkCanvas() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		let animationFrameId;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		let width = canvas.width;
		let height = canvas.height;

		const handleResize = () => {
			if (!canvas) return;
			width = canvas.width = window.innerWidth;
			height = canvas.height = window.innerHeight;
		};
		window.addEventListener("resize", handleResize);

		// Particle nodes representing investment firms
		const particleCount = Math.min(Math.floor(window.innerWidth / 25), 45);
		const particles = [];

		for (let i = 0; i < particleCount; i++) {
			particles.push({
				x: Math.random() * width,
				y: Math.random() * height,
				vx: (Math.random() - 0.5) * 0.4,
				vy: (Math.random() - 0.5) * 0.4,
				radius: Math.random() * 1.5 + 1,
				alpha: Math.random() * 0.5 + 0.2,
			});
		}

		const mouse = { x: -1000, y: -1000 };
		const handleMouseMove = (e) => {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
		};
		window.addEventListener("mousemove", handleMouseMove);

		const render = () => {
			ctx.clearRect(0, 0, width, height);

			// Draw connections
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const dist = Math.sqrt(dx * dx + dy * dy);

					if (dist < 130) {
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.strokeStyle = `rgba(53, 200, 138, ${0.12 * (1 - dist / 130)})`;
						ctx.lineWidth = 0.75;
						ctx.stroke();
					}
				}

				// Mouse connection
				const mdx = particles[i].x - mouse.x;
				const mdy = particles[i].y - mouse.y;
				const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
				if (mdist < 160) {
					ctx.beginPath();
					ctx.moveTo(particles[i].x, particles[i].y);
					ctx.lineTo(mouse.x, mouse.y);
					ctx.strokeStyle = `rgba(53, 200, 138, ${0.25 * (1 - mdist / 160)})`;
					ctx.lineWidth = 1;
					ctx.stroke();
				}

				// Draw particle
				ctx.beginPath();
				ctx.arc(particles[i].x, particles[i].y, particles[i].radius, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(53, 200, 138, ${particles[i].alpha})`;
				ctx.fill();

				// Move
				particles[i].x += particles[i].vx;
				particles[i].y += particles[i].vy;

				if (particles[i].x < 0 || particles[i].x > width) particles[i].vx *= -1;
				if (particles[i].y < 0 || particles[i].y > height) particles[i].vy *= -1;
			}

			animationFrameId = requestAnimationFrame(render);
		};

		render();

		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("mousemove", handleMouseMove);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
}
