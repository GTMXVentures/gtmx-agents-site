import { type FormEvent, type ReactElement, useId, useState } from "react";
import { PulseDot } from "@/components/PulseDot";

/**
 * Waitlist — the only interactive element on the page.
 *
 * ⚠️ `/api/waitlist` DOES NOT EXIST YET. The Worker (site/worker/index.ts)
 * answers every `/api/*` path with a JSON 404 by design — that 404 is also the
 * canary that `assets.run_worker_first` is still routing API paths to the Worker
 * rather than to the asset server. So the failure branch below is the branch
 * that runs in production today, and it must degrade to something useful rather
 * than to a dead form: a mailto fallback. When the endpoint lands (see the
 * TODO(waitlist) in worker/index.ts) the success branch starts firing on its own
 * with no change here.
 *
 * Every non-2xx AND every network/parse throw funnels into the same `error`
 * state on purpose — from the visitor's side "the server said no" and "the
 * request never arrived" have the identical remedy.
 */
type Status = "idle" | "submitting" | "success" | "error";

const CONTACT_EMAIL = "hello@gtmxagents.com";

export function Waitlist(): ReactElement {
	// useId, not a hard-coded string: keeps label/input association correct if the
	// section is ever rendered twice (and in React 19 it is SSR-safe).
	const emailFieldId = useId();
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<Status>("idle");

	async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
		event.preventDefault();
		setStatus("submitting");

		try {
			const response = await fetch("/api/waitlist", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ email }),
			});

			if (!response.ok) {
				throw new Error(`Waitlist endpoint responded ${response.status}`);
			}

			setStatus("success");
			setEmail("");
		} catch {
			setStatus("error");
		}
	}

	return (
		<section
			aria-labelledby="waitlist-heading"
			id="waitlist"
			className="scroll-mt-4 border-line border-t bg-mantle"
		>
			<div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
				<div className="rounded-card border border-line bg-surface p-8 sm:p-14">
					<div className="max-w-xl">
						<p className="flex items-center gap-2 font-mono text-[0.6875rem] text-accent uppercase tracking-[0.16em]">
							<PulseDot />
							Pre-launch · first cohort forming
						</p>
						<h2
							id="waitlist-heading"
							className="mt-5 text-balance font-display font-bold text-[clamp(2rem,4.5vw,3.25rem)] text-ink leading-[1] tracking-[-0.03em]"
						>
							Put the agents on your raise.
						</h2>
						<p className="mt-5 text-ink-muted leading-[1.7]">
							Access opens in cohorts while the agents are still being tuned against live rounds.
							Leave an address and we will send yours when it is ready.
						</p>

						<form onSubmit={handleSubmit} className="mt-10">
							<label htmlFor={emailFieldId} className="eyebrow block">
								Work email
							</label>
							<div className="mt-3 flex flex-col gap-3 sm:flex-row">
								<input
									id={emailFieldId}
									name="email"
									type="email"
									required
									autoComplete="email"
									placeholder="you@company.com"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									className="min-w-0 flex-1 rounded-control border border-line bg-base px-4 py-3 text-ink placeholder:text-ink-subtle focus-visible:border-accent"
								/>
								<button
									type="submit"
									disabled={status === "submitting"}
									className="rounded-control bg-primary px-6 py-3 font-display font-medium text-primary-foreground text-sm transition-colors duration-200 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
								>
									{status === "submitting" ? "Sending…" : "Talk to us"}
								</button>
							</div>

							{/* role="status" (polite live region) is rendered unconditionally so
							    screen readers announce the message when it appears — a live
							    region mounted at the same time as its text is often missed. */}
							<p role="status" className="mt-4 min-h-6 text-sm leading-[1.6]">
								{status === "success" ? (
									<span className="text-accent">
										Thanks. We will come back to you before the first cohort opens.
									</span>
								) : null}
								{status === "error" ? (
									<span className="text-ink-muted">
										Not wired up to take this yet — reach us at{" "}
										<a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
											{CONTACT_EMAIL}
										</a>
									</span>
								) : null}
							</p>
						</form>

						<p className="mt-5 text-ink-subtle text-sm">
							One email when we open access. No newsletter, no sharing your address.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
