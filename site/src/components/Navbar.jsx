import { motion } from "framer-motion";
import { ArrowRight, Blocks, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Wordmark from "./Mark";

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// IntersectionObserver against a sentinel at the top of the document, rather
	// than a scroll listener firing on every frame.
	useEffect(() => {
		const sentinel = document.createElement("div");
		sentinel.setAttribute("aria-hidden", "true");
		sentinel.style.cssText =
			"position:absolute;top:0;left:0;width:1px;height:20px;pointer-events:none;";
		document.body.prepend(sentinel);

		const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
			threshold: 0,
		});
		observer.observe(sentinel);

		return () => {
			observer.disconnect();
			sentinel.remove();
		};
	}, []);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled
					? "py-3 bg-[#070B09]/85 backdrop-blur-xl border-b border-white/[0.07] shadow-xl"
					: "py-4 bg-transparent"
			}`}
		>
			<div className="max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between">
				{/* Brand Logo */}
				<a href="/" className="flex items-center">
					<Wordmark />
				</a>

				{/* Desktop Nav Links (Ordered Exactly Top-to-Bottom as sections appear on page) */}
				<nav className="hidden lg:flex items-center gap-6 text-sm text-neutral-300 font-medium">
					<a href="#pipeline" className="hover:text-white transition-colors">
						Pipeline
					</a>
					<a href="#features" className="hover:text-white transition-colors">
						Platform
					</a>
					<a href="#deal-room" className="hover:text-white transition-colors">
						Deal Room
					</a>
					<a href="#simulator" className="hover:text-white transition-colors">
						Coverage
					</a>
					<a href="#calculator" className="hover:text-white transition-colors">
						Liquidity
					</a>
					<a href="#mcp" className="hover:text-white transition-colors flex items-center gap-1">
						<Blocks className="w-3.5 h-3.5 text-neutral-400" />
						<span>MCP Protocol</span>
					</a>
					<a href="#backed-by" className="hover:text-white transition-colors">
						Backed By
					</a>
				</nav>

				{/* Action Controls */}
				<div className="flex items-center gap-3">
					<a
						href="#mcp"
						className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-all shadow-sm"
					>
						<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
						<span>MCP Server</span>
					</a>

					<motion.a
						href="#cta"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="px-4 py-2 rounded-xl bg-white text-neutral-950 font-semibold text-xs hover:bg-neutral-100 transition-all shadow-sm flex items-center gap-1.5"
					>
						<span>Request Access</span>
						<ArrowRight className="w-3.5 h-3.5" />
					</motion.a>

					{/* Mobile Menu Button */}
					<button
						type="button"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="lg:hidden p-2 text-neutral-400 hover:text-white rounded-xl bg-white/5 border border-white/10"
					>
						{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
					</button>
				</div>
			</div>

			{/* Mobile Drawer */}
			{mobileMenuOpen && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					onClickCapture={(event) => {
						if (event.target instanceof HTMLAnchorElement) {
							setMobileMenuOpen(false);
						}
					}}
					className="lg:hidden bg-[#070B09]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-3.5 text-sm font-medium"
				>
					<a href="#pipeline" className="block text-neutral-200 hover:text-white">
						Pipeline
					</a>
					<a href="#features" className="block text-neutral-200 hover:text-white">
						Platform
					</a>
					<a href="#deal-room" className="block text-neutral-200 hover:text-white">
						Deal Room
					</a>
					<a href="#simulator" className="block text-neutral-200 hover:text-white">
						Coverage
					</a>
					<a href="#calculator" className="block text-neutral-200 hover:text-white">
						Liquidity Estimator
					</a>
					<a href="#mcp" className="block text-neutral-200 hover:text-neutral-200 font-semibold">
						MCP Protocol Access
					</a>
					<a href="#backed-by" className="block text-neutral-200 hover:text-white">
						Backed by GTMX
					</a>
					<a
						href="#cta"
						className="w-full text-center block py-2.5 rounded-xl bg-white text-neutral-950 font-bold mt-2"
					>
						Request Access →
					</a>
				</motion.div>
			)}
		</header>
	);
}
