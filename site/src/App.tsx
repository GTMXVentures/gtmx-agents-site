import Lenis from "lenis";
import { type ReactElement, useEffect } from "react";
import { GlobalMouseSpotlight } from "@/components/GlobalMouseSpotlight";
import { Agents } from "@/components/sections/Agents";
import { BackedBy } from "@/components/sections/BackedBy";
import { Database } from "@/components/sections/Database";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Waitlist } from "@/components/sections/Waitlist";

export default function App(): ReactElement {
	// Initialize High-FPS ProMotion Smooth Scroll using Lerp Interpolation
	useEffect(() => {
		if (typeof window === "undefined" || typeof ResizeObserver === "undefined") {
			return;
		}

		const lenis = new Lenis({
			lerp: 0.09, // 120Hz/60Hz adaptive linear interpolation (Apple/Linear standard)
			wheelMultiplier: 1.0,
			touchMultiplier: 1.8,
			smoothWheel: true,
			syncTouch: false,
			autoResize: true,
		});

		let rafId: number;
		function raf(time: number) {
			lenis.raf(time);
			rafId = requestAnimationFrame(raf);
		}

		rafId = requestAnimationFrame(raf);

		// Handle smooth anchor clicks with offset
		const handleAnchorClick = (e: MouseEvent) => {
			const target = (e.target as HTMLElement).closest("a");
			if (target?.hash && target.origin === window.location.origin) {
				const element = document.querySelector(target.hash);
				if (element) {
					e.preventDefault();
					lenis.scrollTo(element as HTMLElement, { offset: -40, duration: 1.0 });
				}
			}
		};

		document.addEventListener("click", handleAnchorClick);

		return () => {
			document.removeEventListener("click", handleAnchorClick);
			cancelAnimationFrame(rafId);
			lenis.destroy();
		};
	}, []);

	return (
		<div className="relative min-h-dvh antialiased selection:bg-accent selection:text-accent-ink">
			{/* Ambient cursor-following gradient */}
			<GlobalMouseSpotlight />

			<a
				href="#waitlist"
				className="sr-only rounded-control bg-primary px-4 py-2 text-primary-foreground text-sm focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-10"
			>
				Skip to the waitlist
			</a>

			<header className="sticky top-0 z-40 border-line border-b bg-background/85 backdrop-blur-md">
				<div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
					<a
						href="/"
						className="whitespace-nowrap font-display font-bold text-ink text-sm tracking-[-0.01em]"
					>
						GTMX Agents
					</a>

					<nav aria-label="Page sections" className="flex items-center gap-1 sm:gap-2">
						{[
							{ href: "#agents", label: "Agents" },
							{ href: "#database", label: "Database" },
							{ href: "#backed-by", label: "Backed By" },
						].map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="rounded-control px-2 py-2 font-mono text-[0.6875rem] text-ink-subtle uppercase tracking-[0.12em] transition-colors duration-200 hover:text-ink sm:px-3 sm:tracking-[0.16em]"
							>
								{link.label}
							</a>
						))}
						<a
							href="#waitlist"
							className="ml-1 rounded-control bg-primary px-4 py-2 font-display font-medium text-primary-foreground text-sm transition-colors duration-200 hover:bg-primary-hover shadow-sm"
						>
							Talk to us
						</a>
					</nav>
				</div>
			</header>

			<main className="will-change-transform">
				<Hero />
				<Problem />
				<Agents />
				<Database />
				<BackedBy />
				<Faq />
				<Waitlist />
			</main>

			<Footer />
		</div>
	);
}
