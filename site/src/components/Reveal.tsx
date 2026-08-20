import { type ReactElement, type ReactNode, useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
 * A single shared scroll watcher for every <Reveal> on the page.
 *
 * The obvious implementation is one IntersectionObserver per element, and it
 * has a failure mode that is worth writing down because it is invisible in
 * casual testing: an observer only reports CHANGES in intersection. If an
 * element crosses the whole viewport inside one frame — an anchor jump, Cmd+End,
 * a restored scroll position — its ratio is 0 before and 0 after, no callback
 * fires, and the element stays at opacity 0 permanently. A reveal effect whose
 * worst case is "the section is never visible again" is not worth having.
 *
 * So: one passive scroll listener, rAF-throttled, walking a Set of pending
 * nodes and revealing everything at or above the trigger line. Position is
 * absolute rather than differential, so it cannot miss a transition no matter
 * how far the page moved between frames. The listener detaches itself when the
 * Set empties, which on this page is a few seconds after load.
 * ------------------------------------------------------------------------- */

type Pending = { readonly node: Element; readonly show: () => void };

const pending = new Set<Pending>();
let watching = false;
let frame = 0;

function sweep(): void {
	frame = 0;
	const limit = window.innerHeight * 0.88;
	for (const entry of pending) {
		if (entry.node.getBoundingClientRect().top <= limit) {
			entry.show();
			pending.delete(entry);
		}
	}
	if (pending.size === 0) stopWatching();
}

function onScroll(): void {
	if (frame) return;
	frame = requestAnimationFrame(sweep);
}

function startWatching(): void {
	if (watching) return;
	watching = true;
	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onScroll, { passive: true });
}

function stopWatching(): void {
	if (!watching) return;
	watching = false;
	window.removeEventListener("scroll", onScroll);
	window.removeEventListener("resize", onScroll);
}

interface RevealProps {
	readonly children: ReactNode;
	/** Stagger within a group, in ms. Keep under ~240 or the page feels slow. */
	readonly delay?: number;
	readonly className?: string;
	/** Render as something other than a div where a div would be invalid. */
	readonly as?: "div" | "li" | "section";
}

/**
 * Fades and lifts its children the first time they scroll into view, once.
 *
 * Replaying on the way back up is what makes scroll animation feel like a toy,
 * so a revealed element is removed from the watcher and never hidden again.
 *
 * The hidden state is applied by JS, never shipped in the HTML: if the script
 * failed, markup carrying `opacity-0` would render the page blank. Starting
 * visible means the worst case is no animation rather than no content.
 */
export function Reveal({
	children,
	delay = 0,
	className = "",
	as: Tag = "div",
}: RevealProps): ReactElement {
	const ref = useRef<HTMLElement>(null);
	const [shown, setShown] = useState(true);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		// Already on screen at mount — leave alone rather than hiding and
		// re-showing something the visitor is looking at.
		if (node.getBoundingClientRect().top <= window.innerHeight * 0.88) return;

		setShown(false);
		const entry: Pending = { node, show: () => setShown(true) };
		pending.add(entry);
		startWatching();
		// One sweep on the next frame catches a scroll position restored or
		// anchor-jumped after mount, where no scroll event will ever fire.
		onScroll();

		return () => {
			pending.delete(entry);
			if (pending.size === 0) stopWatching();
		};
	}, []);

	return (
		<Tag
			ref={ref as never}
			className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
				shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
			} ${className}`}
			style={{ transitionDelay: `${delay}ms` }}
		>
			{children}
		</Tag>
	);
}
