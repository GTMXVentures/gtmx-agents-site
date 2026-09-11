import type { ReactElement } from "react";
import { Shell } from "@/components/Shell";
import { Agents } from "@/components/sections/Agents";
import { Clients } from "@/components/sections/Clients";
import { Database } from "@/components/sections/Database";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Waitlist } from "@/components/sections/Waitlist";

/**
 * The home page ("/"). All chrome — ambient spotlight, skip link, header,
 * footer, smooth scroll — lives in Shell and is shared with every other entry
 * point, so the header cannot drift between pages.
 */
export default function App(): ReactElement {
	return (
		<Shell
			current="/"
			sections={[
				{ href: "#agents", label: "Agents" },
				{ href: "#database", label: "Database" },
			]}
		>
			<Hero />
			<Clients />
			<Problem />
			<Agents />
			<Database />
			<Faq />
			<Waitlist />
		</Shell>
	);
}
