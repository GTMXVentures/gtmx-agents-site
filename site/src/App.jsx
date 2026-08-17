import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { useEffect } from "react";
import AllocationCalculator from "./components/AllocationCalculator";
import AnimatedBeamPipeline from "./components/AnimatedBeamPipeline";
import BackedByGTMX from "./components/BackedByGTMX";
import BentoGrid from "./components/BentoGrid";
import CTASection from "./components/CTASection";
import DealRoomStepper from "./components/DealRoomStepper";
import FAQAccordion from "./components/FAQAccordion";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import InvestorMarquee from "./components/InvestorMarquee";
import MatchSimulator from "./components/MatchSimulator";
import McpProtocolInspector from "./components/McpProtocolInspector";
import Navbar from "./components/Navbar";
import NetworkCanvas from "./components/NetworkCanvas";
import Stats from "./components/Stats";

export default function App() {
	// Initialize Lenis Smooth Scroll (skipped when reduced motion is requested)
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
			orientation: "vertical",
			gestureOrientation: "vertical",
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2,
		});

		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			lenis.destroy();
		};
	}, []);

	return (
		<MotionConfig reducedMotion="user">
			<div className="min-h-screen bg-[#070B09] text-neutral-100 selection:bg-emerald-500/25 selection:text-neutral-200 relative overflow-x-hidden">
				{/* Background Interactive Particle Node Mesh */}
				<NetworkCanvas />

				{/* Background Subtle Grid */}
				<div className="fixed inset-0 subtle-grid opacity-40 pointer-events-none z-0" />

				{/* Main Content Layout (Ordered strictly to match Navbar sequence) */}
				<div className="relative z-10 flex flex-col min-h-screen">
					<Navbar />

					<main className="flex-grow">
						<Hero />
						<InvestorMarquee />
						<AnimatedBeamPipeline />
						<BentoGrid />
						<DealRoomStepper />
						<MatchSimulator />
						<AllocationCalculator />
						<McpProtocolInspector />
						<Stats />
						<BackedByGTMX />
						<FAQAccordion />
						<CTASection />
					</main>

					<Footer />
				</div>
			</div>
		</MotionConfig>
	);
}
