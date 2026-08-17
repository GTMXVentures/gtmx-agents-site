import { type FormEvent, type ReactElement, useId, useState } from "react";

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
			className="scroll-mt-8 border-line/70 border-b bg-mantle"
		>
			<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
				<div className="max-w-xl">
					<p className="eyebrow">Pre-launch</p>
					<h2
						id="waitlist-heading"
						className="mt-5 text-balance font-display font-medium text-[clamp(1.875rem,4vw,3rem)] text-ink-display leading-[1.05] tracking-[-0.015em]"
					>
						Join the waitlist.
					</h2>
					<p className="mt-5 text-ink-muted leading-[1.7]">
						We are onboarding a first group of founders raising now, and the advisory teams running
						rounds alongside them. Tell us where to reach you.
					</p>

					<form onSubmit={handleSubmit} className="mt-10" noValidate={false}>
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
								className="rounded-control bg-accent px-6 py-3 font-medium text-accent-ink text-sm transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
							>
								{status === "submitting" ? "Sending…" : "Join the waitlist"}
							</button>
						</div>

						{/* role="status" (polite live region) is rendered unconditionally so
						    screen readers announce the message when it appears — a live
						    region mounted at the same time as its text is often missed. */}
						<p role="status" className="mt-4 min-h-6 text-sm leading-[1.6]">
							{status === "success" ? (
								<span className="text-success">
									You are on the list. We will be in touch before the first cohort opens.
								</span>
							) : null}
							{status === "error" ? (
								<span className="text-ink-muted">
									Waitlist opens soon — reach us at{" "}
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
		</section>
	);
}
