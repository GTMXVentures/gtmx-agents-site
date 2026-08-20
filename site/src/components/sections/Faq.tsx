import { type ReactElement, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { FAQS } from "@/data/faq";

/**
 * FAQ — a disclosure list, not an accordion widget.
 *
 * Built on <details>/<summary> rather than buttons plus state: the browser
 * gives keyboard operation, the correct ARIA and in-page find for free, and an
 * unopened answer still exists in the DOM for crawlers. The only React state
 * here is which item is open, so opening one closes the others.
 *
 * The chevron is a CSS-rotated span rather than an icon import — one element,
 * no bundle cost, and it cannot drift out of sync with the open state because
 * it is driven by the same attribute.
 */
export function Faq(): ReactElement {
	const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

	return (
		<section aria-labelledby="faq-heading" id="faq" className="scroll-mt-4 border-line border-t">
			<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
				<div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
					<Reveal>
						<p className="eyebrow">Questions</p>
						<h2
							id="faq-heading"
							className="mt-5 text-balance font-display font-bold text-[clamp(2rem,4.5vw,3.25rem)] text-ink leading-[1] tracking-[-0.03em]"
						>
							How it actually works.
						</h2>
					</Reveal>

					<Reveal delay={80} className="border-line border-t">
						{FAQS.map((item) => {
							const open = item.id === openId;
							return (
								<details
									key={item.id}
									className="group border-line border-b"
									open={open}
									onToggle={(event) => {
										// Controlled so only one stays open. The guard matters: closing
										// the open item fires a toggle with open=false, and without it
										// the item would immediately re-open itself.
										if (event.currentTarget.open) setOpenId(item.id);
										else if (open) setOpenId(null);
									}}
								>
									<summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display font-medium text-ink transition-colors duration-200 hover:text-accent [&::-webkit-details-marker]:hidden">
										{item.question}
										<span
											aria-hidden="true"
											className="shrink-0 text-ink-subtle transition-transform duration-200 group-open:rotate-45"
										>
											+
										</span>
									</summary>
									<p className="max-w-2xl pb-6 text-ink-muted leading-[1.7]">{item.answer}</p>
								</details>
							);
						})}
					</Reveal>
				</div>
			</div>
		</section>
	);
}
