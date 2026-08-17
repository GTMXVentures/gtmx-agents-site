import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowRight,
	Blocks,
	CheckCircle2,
	Layers,
	Search,
	ShieldCheck,
	UserCheck,
} from "lucide-react";
import { useState } from "react";
import BorderBeam from "./BorderBeam";

const TABS = [
	{ id: "matches", label: "Smart Investor Matches" },
	{ id: "partners", label: "Partner Matrix" },
	{ id: "dealroom", label: "13-Stage Deal Room" },
];

export default function Hero() {
	const [activeTab, setActiveTab] = useState("matches");

	return (
		<section className="relative pt-24 pb-20 md:pt-24 md:pb-28 overflow-hidden">
			{/* Background Soft Glow & Grid */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[550px] hero-glow pointer-events-none" />
			<div className="absolute inset-0 subtle-grid opacity-60 pointer-events-none" />

			<div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
				{/* Hero Title & Subheader */}
				<div className="text-center max-w-4xl mx-auto">
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] text-balance"
					>
						Venture Capital Intelligence That{" "}
						<span className="text-gradient-subtle block sm:inline">Closes Deals Faster</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="mt-6 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed"
					>
						Search 7,033 investor firms and 22,402 named partners, narrowed to the funds that back
						your sector at your stage.
					</motion.p>

					{/* Action CTAs */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
					>
						<a
							href="#simulator"
							className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 font-semibold text-sm transition-all shadow-md shadow-white/5 flex items-center justify-center gap-2 group"
						>
							<span>Explore Match Simulator</span>
							<ArrowRight className="w-4 h-4 text-neutral-950 group-hover:translate-x-0.5 transition-transform" />
						</a>

						<a
							href="#mcp"
							className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-200 font-medium text-sm transition-all flex items-center justify-center gap-2"
						>
							<Blocks className="w-4 h-4 text-neutral-400" />
							<span>Connect MCP Agent</span>
						</a>
					</motion.div>

					{/* Social Proof Line */}
					<div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 font-medium">
						<span className="flex items-center gap-1.5">
							<CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" /> 7,033 Investor Firms
						</span>
						<span className="flex items-center gap-1.5">
							<CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" /> 22,402 Named Partners
						</span>
						<span className="flex items-center gap-1.5">
							<CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" /> 8,959 Verified Emails
						</span>
					</div>
				</div>

				{/* Impressive Dashboard Preview with Animated Border Beam */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className="mt-14 w-full relative"
				>
					{/* Floating Pill Card 1: Top Right */}
					<div className="hidden lg:flex absolute -top-6 -right-6 z-20 p-3.5 rounded-2xl glass-panel shadow-2xl items-center gap-3 animate-float-1">
						<div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-400">
							<ShieldCheck className="w-5 h-5" />
						</div>
						<div className="text-left">
							<span className="text-xs font-semibold text-white block">8,959 Verified Emails</span>
							<span className="text-[11px] text-neutral-400">Partners reachable today</span>
						</div>
					</div>

					{/* Floating Pill Card 2: Bottom Left */}
					<div className="hidden lg:flex absolute -bottom-6 -left-6 z-20 p-3.5 rounded-2xl glass-panel shadow-2xl items-center gap-3 animate-float-2">
						<div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-400">
							<Layers className="w-5 h-5" />
						</div>
						<div className="text-left">
							<span className="text-xs font-semibold text-white block">
								13-Stage Pipeline Active
							</span>
							<span className="text-[11px] text-neutral-400">Term Sheet & SHA Tracking</span>
						</div>
					</div>

					{/* Main Interactive Product Shell with BorderBeam */}
					<div className="rounded-2xl glass-panel p-4 sm:p-7 overflow-hidden shadow-2xl relative border border-white/[0.08]">
						<BorderBeam size={250} duration={14} delay={2} />

						{/* Top Toolbar */}
						<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-4 mb-5">
							{/* Window Dots & Tab Switcher with Spring layoutId */}
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-1.5 hidden sm:flex">
									<div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
									<div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
									<div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
								</div>

								<div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 relative">
									{TABS.map((t) => (
										<button
											type="button"
											key={t.id}
											onClick={() => setActiveTab(t.id)}
											className={`relative px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
												activeTab === t.id
													? "text-white font-semibold"
													: "text-neutral-400 hover:text-neutral-200"
											}`}
										>
											{activeTab === t.id && (
												<motion.div
													layoutId="activeHeroTabIndicator"
													transition={{ type: "spring", stiffness: 450, damping: 32 }}
													className="absolute inset-0 bg-white/10 rounded-xl shadow-sm border border-white/10"
												/>
											)}
											<span className="relative z-10">{t.label}</span>
										</button>
									))}
								</div>
							</div>

							{/* Status Indicator */}
							<div className="flex items-center gap-2 text-xs text-neutral-400">
								<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
								<span>Live Matching Engine Online</span>
							</div>
						</div>

						{/* Dynamic Tab Content */}
						<AnimatePresence mode="wait">
							{activeTab === "matches" && (
								<motion.div
									key="matches"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.25 }}
									className="space-y-3 text-left"
								>
									<div className="p-3.5 rounded-xl bg-black/50 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
										<div className="flex items-center gap-2 text-neutral-300">
											<Search className="w-4 h-4 text-neutral-400 shrink-0" />
											<span className="text-white font-medium">Query:</span>
											<span className="text-neutral-300">AI and SaaS funds that lead Series A</span>
										</div>
										<div className="flex items-center gap-2 text-[11px] text-neutral-400">
											<span className="px-2.5 py-0.5 rounded-xl bg-white/[0.04] text-neutral-200 border border-white/10 font-medium">
												3 of 525 shown
											</span>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
										{[
											{
												name: "Enterprise AI fund",
												type: "Series A lead",
												cheque: "$2M – $7M",
												partnerRole: "Partner, Enterprise Software",
												score: "Email on file",
											},
											{
												name: "Global software fund",
												type: "Series A lead",
												cheque: "$3M – $8M",
												partnerRole: "General Partner, AI",
												score: "Email on file",
											},
											{
												name: "Multi-stage fund",
												type: "Series A lead",
												cheque: "$4M – $10M",
												partnerRole: "Managing Director",
												score: "Email on file",
											},
										].map((firm) => (
											<div
												key={firm.name}
												className="p-4 rounded-2xl bg-neutral-900/40 border border-white/[0.06] hover:border-white/20 transition-all"
											>
												<div className="flex items-start justify-between">
													<div>
														<span className="text-[11px] text-neutral-400">{firm.type}</span>
														<h4 className="font-semibold text-sm text-white mt-0.5">{firm.name}</h4>
													</div>
													<span className="text-xs font-semibold text-neutral-400 bg-white/[0.04] px-2 py-0.5 rounded-xl border border-white/10">
														{firm.score}
													</span>
												</div>
												<div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
													<span className="text-neutral-300 truncate max-w-[140px]">
														{firm.partnerRole}
													</span>
													<span className="text-white font-medium">{firm.cheque}</span>
												</div>
											</div>
										))}
									</div>
								</motion.div>
							)}

							{activeTab === "partners" && (
								<motion.div
									key="partners"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.25 }}
									className="space-y-2.5 text-left text-xs"
								>
									<div className="grid grid-cols-12 py-2 px-3 text-neutral-400 font-semibold border-b border-white/5">
										<span className="col-span-4">Partner Role</span>
										<span className="col-span-4">Fund</span>
										<span className="col-span-2">Contact Mandate</span>
										<span className="col-span-2 text-right">Verification</span>
									</div>

									{[
										{
											role: "Managing Partner, Software",
											entity: "Growth fund · Mumbai",
											mandate: "Series B+ Lead",
											status: "Email verified",
										},
										{
											role: "General Partner, AI",
											entity: "Enterprise fund · Bengaluru",
											mandate: "Series A Lead",
											status: "Email verified",
										},
										{
											role: "Managing Director",
											entity: "Multi-stage fund · Singapore",
											mandate: "Multi-Stage Lead",
											status: "Email verified",
										},
									].map((row) => (
										<div
											key={row.role}
											className="grid grid-cols-12 py-3 px-3 rounded-xl bg-neutral-900/30 border border-white/[0.04] items-center"
										>
											<span className="col-span-4 font-semibold text-white flex items-center gap-2">
												<UserCheck className="w-3.5 h-3.5 text-neutral-400" />
												{row.role}
											</span>
											<span className="col-span-4 text-neutral-300">{row.entity}</span>
											<span className="col-span-2 text-neutral-400">{row.mandate}</span>
											<span className="col-span-2 text-right text-neutral-400 font-medium">
												{row.status}
											</span>
										</div>
									))}
								</motion.div>
							)}

							{activeTab === "dealroom" && (
								<motion.div
									key="dealroom"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.25 }}
									className="space-y-3 text-left"
								>
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
										<div className="p-3.5 rounded-2xl bg-neutral-900/40 border border-white/5">
											<span className="text-[11px] text-neutral-400 block mb-1">
												Stage 02 - Contacted
											</span>
											<span className="font-semibold text-white">14 firms</span>
										</div>
										<div className="p-3.5 rounded-2xl bg-neutral-900/40 border border-white/15">
											<span className="text-[11px] text-neutral-400 block mb-1">
												Stage 05 - Active Diligence
											</span>
											<span className="font-semibold text-white">4 Funds Active</span>
										</div>
										<div className="p-3.5 rounded-2xl bg-neutral-900/40 border border-white/5">
											<span className="text-[11px] text-neutral-400 block mb-1">
												Stage 07 - Term Sheet
											</span>
											<span className="font-semibold text-white">2 Proposals</span>
										</div>
										<div className="p-3.5 rounded-2xl bg-neutral-900/40 border border-white/15">
											<span className="text-[11px] text-neutral-400 block mb-1">
												Stage 09 - SHA Drafting
											</span>
											<span className="font-semibold text-neutral-200 font-bold">
												1 Deal Closing
											</span>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
