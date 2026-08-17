import confetti from "canvas-confetti";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function CTASection() {
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!email) return;
		setSubmitted(true);
		confetti({
			particleCount: 70,
			spread: 60,
			origin: { y: 0.6 },
			colors: ["#35C88A", "#6EE7B7", "#FFFFFF"],
		});
	};

	return (
		<section id="cta" className="py-24 relative bg-[#070B09] border-t border-white/[0.06]">
			<div className="max-w-6xl mx-auto px-6 lg:px-8">
				<div className="rounded-2xl p-8 sm:p-14 glass-panel relative overflow-hidden text-center shadow-2xl border border-white/[0.08]">
					{/* Subtle Glow Behind Header */}
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />

					<div className="max-w-2xl mx-auto relative z-10">
						<h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
							Ready to Upgrade Your Deal Intelligence?
						</h2>

						<p className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
							Join leading investment teams, venture scouts, and founders running high-conviction
							deal rooms on InvestorIQ.
						</p>

						{/* Email Form */}
						<div className="mt-8 max-w-md mx-auto">
							{submitted ? (
								<div className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 text-neutral-200 text-sm font-medium flex items-center justify-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-neutral-400" />
									Request confirmed. Access credentials will be dispatched.
								</div>
							) : (
								<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
									<input
										type="email"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Enter your work email..."
										className="flex-1 px-4 py-3.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-emerald-400 transition-all"
									/>
									<button
										type="submit"
										className="px-6 py-3.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
									>
										<span>Request Access</span>
										<ArrowRight className="w-4 h-4" />
									</button>
								</form>
							)}
						</div>

						<div className="mt-6 flex items-center justify-center gap-6 text-xs text-neutral-500">
							<span className="flex items-center gap-1.5">
								<ShieldCheck className="w-3.5 h-3.5 text-neutral-400" /> End-to-End Encrypted
							</span>
							<span>•</span>
							<span>No Credit Card Required</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
