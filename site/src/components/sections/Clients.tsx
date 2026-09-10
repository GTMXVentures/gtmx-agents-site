import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import { CLIENTS, LOGO_HEIGHT } from "@/data/clients";

/**
 * Companies GTMX has raised for.
 *
 * Sits directly under the hero: the first thing a founder wants to know is who
 * else trusted this, and proof is more persuasive there than another claim.
 *
 * Marks are normalised to white and lifted to full opacity on hover. The page
 * ground is #050506 and the brands span blue, green, cyan and near-black, so
 * colour marks would read as seven competing palettes and the dark ones would
 * not read at all.
 *
 * Two per-client escapes, both in `data/clients.ts` and both needed because a
 * logo wall is optical, not arithmetic: `noInvert` for a lockup whose filled
 * icon tile inverts to a blank white block, and `logoHeight` because equal box
 * height does not mean equal apparent size when one lockup carries a tagline.
 */
export function Clients(): ReactElement {
	return (
		<section
			aria-labelledby="clients-heading"
			id="clients"
			className="scroll-mt-4 border-line border-t bg-mantle"
		>
			<div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16">
				<Reveal>
					<h2 id="clients-heading" className="eyebrow text-center">
						Used by the best
					</h2>

					<ul className="mt-9 flex flex-wrap items-center justify-center gap-x-10 gap-y-7 sm:gap-x-14">
						{CLIENTS.map((client) => (
							<li key={client.id} data-testid={`client-${client.id}`} className="group">
								{client.logo ? (
									<img
										alt={client.name}
										src={client.logo}
										height={client.logoHeight ?? LOGO_HEIGHT}
										width={client.logoWidth}
										loading="lazy"
										decoding="async"
										// Height is inline because it is per-client and tuned by eye;
										// Tailwind cannot generate a class per value.
										style={{ height: `${client.logoHeight ?? LOGO_HEIGHT}px` }}
										// Unfiltered marks sit at a higher base opacity: the inverted
										// ones resolve to pure white, so 55% on a mid-tone colour mark
										// reads noticeably dimmer than its neighbours.
										className={`w-auto transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none${
											client.noInvert ? " opacity-80" : " opacity-55 brightness-0 invert"
										}`}
									/>
								) : (
									<span className="whitespace-nowrap font-display font-semibold text-[1.0625rem] text-ink-subtle leading-none tracking-[-0.01em] transition-colors duration-300 ease-out group-hover:text-ink motion-reduce:transition-none">
										{client.name}
									</span>
								)}
							</li>
						))}
					</ul>
				</Reveal>
			</div>
		</section>
	);
}
