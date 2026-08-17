import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQS = [
	{
		q: "How does InvestorIQ help founders find the right lead investors faster?",
		a: "Instead of wasting months reaching out to mismatched funds, InvestorIQ uses 768-dimensional AI embeddings to match your company’s exact industry, traction, and round size with Tier-1 venture funds that have active allocation mandates and verified check sizes in your category. You focus 100% of your energy on high-conviction leads.",
	},
	{
		q: "How does the 13-stage Deal Room prevent fundraising momentum from stalling?",
		a: "Fundraising deals often stall due to fragmented email threads and unclear next steps. The canonical 13-stage Deal Room structures your entire pipeline, from first pitch to diligence, term sheet negotiations, and SHA closing, giving your team complete visibility over every active investor conversation.",
	},
	{
		q: "How do we identify the exact partner with check-writing authority at each fund?",
		a: "InvestorIQ maps sector specialisations and lead roles across 7,033 investor firms, 4,329 of which have at least one named partner attached. You get direct visibility into which specific partner leads investments in your space (e.g. Enterprise AI, Cloud SaaS, FinTech), ensuring your story reaches the true decision-maker rather than getting lost in general inboxes.",
	},
	{
		q: "How does InvestorIQ prepare founders for due diligence and term sheet negotiations?",
		a: "InvestorIQ standardizes institutional readiness with clear milestone tracking across commercial diligence, customer reference calls, and legal documentation. By keeping diligence materials organized and proactive, founders compress round-closing timelines from months to weeks.",
	},
	{
		q: "Can founders connect AI agents and internal workflows via MCP?",
		a: "Yes. With native Model Context Protocol (MCP) support, founders and operators can connect tools like Claude Code, Cursor, or custom AI assistants to query matching funds, draft personalized partner briefs, and advance deal room stages directly from their everyday workflow.",
	},
];

export default function FAQAccordion() {
	const [openIdx, setOpenIdx] = useState(0);

	return (
		<section id="faq" className="py-24 relative z-10 bg-[#070C0A] border-t border-white/[0.06]">
			<div className="max-w-6xl mx-auto px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center mb-16">
					<h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
						Frequently Asked Questions
					</h2>
					<p className="mt-4 text-neutral-400 text-base leading-relaxed">
						Everything you need to know about accelerating your fundraise, finding the right lead
						partners, and closing rounds faster.
					</p>
				</div>

				{/* FAQ Accordion List */}
				<div className="space-y-3">
					{FAQS.map((faq, idx) => {
						const isOpen = openIdx === idx;
						return (
							<div
								key={faq.q}
								className="rounded-2xl glass-panel border border-white/[0.07] overflow-hidden transition-all"
							>
								<button
									type="button"
									onClick={() => setOpenIdx(isOpen ? null : idx)}
									className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 group"
								>
									<span className="font-semibold text-sm sm:text-base text-white group-hover:text-white transition-colors">
										{faq.q}
									</span>
									<div
										className={`p-1.5 rounded-xl bg-white/5 transition-transform duration-200 ${isOpen ? "rotate-180 text-neutral-400" : "text-neutral-400"}`}
									>
										<ChevronDown className="w-4 h-4" />
									</div>
								</button>

								<AnimatePresence initial={false}>
									{isOpen && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											transition={{ duration: 0.25 }}
											className="overflow-hidden"
										>
											<div className="px-5 sm:px-6 pb-6 pt-1 text-neutral-400 text-xs sm:text-sm leading-relaxed border-t border-white/[0.04]">
												{faq.a}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
