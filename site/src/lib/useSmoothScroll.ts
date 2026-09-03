import Lenis from "lenis";
import { useEffect } from "react";

/**
 * High-FPS smooth scroll + offset anchor handling, lifted out of App so every
 * page entry gets identical scroll behaviour rather than the home page alone.
 *
 * Guarded on `window`/`ResizeObserver` because the same component tree is
 * rendered under jsdom in tests, where Lenis's observers are not available.
 */
export function useSmoothScroll(): void {
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

		// Intercept same-origin hash links so they scroll smoothly with a top
		// offset that clears the sticky header. Cross-page links (/product) and
		// external links fall through to the browser untouched.
		const handleAnchorClick = (e: MouseEvent) => {
			const target = (e.target as HTMLElement).closest("a");
			if (target?.hash && target.origin === window.location.origin) {
				// A link like `/#waitlist` from /product is a navigation, not an
				// in-page scroll — only intercept when we are already on that path.
				if (target.pathname !== window.location.pathname) {
					return;
				}
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
}
