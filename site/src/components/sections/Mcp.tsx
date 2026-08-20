import type { ReactElement } from "react";
import { BorderBeam } from "@/components/BorderBeam";
import { COVERAGE, formatCount } from "@/data/coverage";

/**
 * MCP — the seam for founders who already run their own agents.
 *
 * Deliberately the quietest section on the page. Most visitors do not know what
 * the Model Context Protocol is and do not need to; the ones who do will read
 * two code blocks and stop. So it states the capability, shows the config and
 * the shape of a response, and gets out of the way.
 *
 * The config is illustrative and says so — the API key is a placeholder and the
 * firm in the response is redacted rather than invented, because a fabricated
 * firm name in a sample payload is the kind of detail that gets quoted back as
 * if it were a customer.
 */
const MCP_CONFIG = `{
  "mcpServers": {
    "gtmx-agents": {
      "command": "npx",
      "args": ["-y", "@gtmxagents/mcp@latest"],
      "env": { "GTMX_API_KEY": "<your key>" }
    }
  }
}`;

const MCP_RESPONSE = `{
  "query": { "sector": "AI / ML", "stage": "Series A" },
  "in_scope": 1301,
  "reachable": 525,
  "top_match": {
    "firm": "<firm on file>",
    "vc_type": "Institutional VC",
    "lead_role": "Partner, Enterprise Software",
    "partner_email": "verified",
    "similarity": 0.84
  }
}`;

export function Mcp(): ReactElement {
	return (
		<section aria-labelledby="mcp-heading" id="mcp" className="scroll-mt-4 border-line border-t">
			<div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
				<div className="max-w-2xl">
					<p className="eyebrow">Model Context Protocol</p>
					<h2
						id="mcp-heading"
						className="mt-5 text-balance font-display font-bold text-[clamp(2rem,4.5vw,3.25rem)] text-ink leading-[1] tracking-[-0.03em]"
					>
						Point your own agents at it.
					</h2>
					<p className="mt-5 text-ink-muted leading-[1.7]">
						The same database the GTMX agents work from is exposed over MCP. Claude Code, Cursor or
						an agent you wrote yourself can run the searches and read the deal-room state directly.
					</p>
				</div>

				<div className="mt-12 grid gap-4 lg:grid-cols-2">
					<div className="overflow-hidden rounded-card border border-line bg-surface">
						<div className="flex items-center justify-between border-line border-b px-6 py-4">
							<p className="eyebrow">mcp.json</p>
							<p className="eyebrow">Client config</p>
						</div>
						<pre className="overflow-x-auto px-6 py-6 font-mono text-ink-muted text-xs leading-[1.7]">
							<code>{MCP_CONFIG}</code>
						</pre>
					</div>

					<div className="relative overflow-hidden rounded-card border border-line bg-surface">
						<BorderBeam duration={18} />
						<div className="flex items-center justify-between border-line border-b px-6 py-4">
							<p className="eyebrow">Response</p>
							<p className="eyebrow">200 OK</p>
						</div>

						{/* The answer lifted out of the payload. A founder scanning this
						    section should get the point without reading JSON. */}
						<div className="border-line border-b px-6 py-5">
							<p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
								<span className="font-display font-bold text-3xl text-accent tabular-nums leading-none">
									{formatCount(525)}
								</span>
								<span className="text-ink-muted text-sm">
									firms invest in AI / ML at Series A and have a partner you can email
								</span>
							</p>
						</div>

						<pre className="overflow-x-auto px-6 py-6 font-mono text-ink-subtle text-xs leading-[1.7]">
							<code>{MCP_RESPONSE}</code>
						</pre>
					</div>
				</div>

				<p className="mt-6 text-ink-subtle text-sm">
					Reads cover all {formatCount(COVERAGE.firms)} firms. Writes to a deal room are scoped to
					the account that owns it.
				</p>
			</div>
		</section>
	);
}
