import { motion } from "framer-motion";
import { Bot, Braces, Check, Copy, Play } from "lucide-react";
import { useState } from "react";

const MCP_SNIPPETS = {
	mcp_json: `{
  "mcpServers": {
    "investoriq": {
      "command": "npx",
      "args": ["-y", "@investoriq/mcp@latest"],
      "env": {
        "INVESTORIQ_API_KEY": "iq_live_98a4d..."
      }
    }
  }
}`,
	claude_agent: `// Claude Code & Agent Tool Call
const toolResult = await mcp.useTool("investoriq", "query_matched_funds", {
  sector: "AI & DeepTech",
  target_stage: "Series A",
  cheque_min_usd: 2000000,
  require_lead_partner: true
});

console.log(toolResult.matches);`,
	python_agent: `from fastmcp import FastMCPClient

client = FastMCPClient("investoriq")
async with client:
    deal_matches = await client.call_tool(
        "match_investors",
        arguments={
            "sector": "AI & DeepTech",
            "stage": "Series A",
            "target_raise": 5_000_000,
            "dedup_entities": True
        }
    )`,
};

const SAMPLE_MCP_RESPONSE = `{
  "content": [
    {
      "type": "text",
      "text": "525 reachable firms. Top 3 by thesis similarity:"
    },
    {
      "type": "resource",
      "resource": {
        "uri": "investoriq://firms/5857",
        "mimeType": "application/json",
        "data": {
          "firm_name": "<firm on file>",
          "vc_type": "Institutional VC",
          "cheque_band": "$2,000,000 – $7,000,000",
          "lead_role": "Partner, Enterprise Software",
          "partner_email": "verified",
          "similarity": 0.84,
          "thesis_citation": "Leads Series A in DeepTech and AI infrastructure"
        }
      }
    }
  ]
}`;

export default function McpProtocolInspector() {
	const [activeTab, setActiveTab] = useState("mcp_json");
	const [copied, setCopied] = useState(false);
	const [isExecuting, setIsExecuting] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(MCP_SNIPPETS[activeTab]);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleTestExecution = () => {
		setIsExecuting(true);
		setTimeout(() => setIsExecuting(false), 300);
	};

	return (
		<section id="mcp" className="py-24 relative z-10 bg-[#070C0A] border-t border-white/[0.06]">
			<div className="max-w-6xl mx-auto px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
						Connect InvestorIQ to Any AI Agent
					</h2>
					<p className="mt-4 text-neutral-400 text-base leading-relaxed">
						Give Claude Code, Cursor, Windsurf, and custom autonomous agents native real-time tool
						access to 7,033 investor firms, 8,959 verified partner emails, and 13-stage Deal Room
						pipelines.
					</p>
				</div>

				{/* Metal.so-Style Interactive MCP Workbench */}
				<div className="w-full rounded-2xl glass-panel border border-white/[0.08] overflow-hidden shadow-2xl">
					{/* Top Tabs Bar */}
					<div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 bg-black/60 border-b border-white/[0.08] gap-4">
						{/* Tab Buttons */}
						<div className="flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/5 relative">
							{[
								{ id: "mcp_json", label: "mcp.json (Cursor / Claude)" },
								{ id: "claude_agent", label: "TypeScript Agent" },
								{ id: "python_agent", label: "Python FastMCP" },
							].map((t) => (
								<button
									type="button"
									key={t.id}
									onClick={() => setActiveTab(t.id)}
									className={`relative px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
										activeTab === t.id
											? "text-white font-semibold"
											: "text-neutral-400 hover:text-neutral-200"
									}`}
								>
									{activeTab === t.id && (
										<motion.div
											layoutId="activeMcpTabPill"
											transition={{ type: "spring", stiffness: 450, damping: 32 }}
											className="absolute inset-0 bg-white/10 rounded-xl shadow-sm border border-white/10"
										/>
									)}
									<span className="relative z-10">{t.label}</span>
								</button>
							))}
						</div>

						{/* Test Tool & Copy Action Buttons */}
						<div className="flex items-center gap-3">
							<motion.button
								type="button"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={handleTestExecution}
								className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/15 text-neutral-200 text-xs font-medium hover:bg-white/[0.08] transition-all shadow-sm shadow-black/40"
							>
								<Play className="w-3 h-3 text-neutral-400 fill-neutral-300" />
								<span>{isExecuting ? "Tool Call Sent" : "Simulate Tool Call"}</span>
							</motion.button>

							<button
								type="button"
								onClick={handleCopy}
								className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors p-1.5 rounded-xl bg-white/5 border border-white/5"
							>
								{copied ? (
									<Check className="w-3.5 h-3.5 text-neutral-400" />
								) : (
									<Copy className="w-3.5 h-3.5" />
								)}
								<span className="text-[11px] font-medium">{copied ? "Copied" : "Copy"}</span>
							</button>
						</div>
					</div>

					{/* Metal.so Split Code Pane */}
					<div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08] font-mono text-xs">
						{/* Left Config / Tool Call */}
						<div className="p-6 sm:p-8 bg-[#080D0A] overflow-x-auto">
							<div className="flex items-center justify-between text-[11px] text-neutral-500 mb-4 font-semibold">
								<span className="flex items-center gap-1.5">
									<Bot className="w-3.5 h-3.5 text-neutral-400" /> Agent Config
								</span>
								<span className="text-neutral-600">UTF-8</span>
							</div>
							<pre className="text-neutral-300 leading-relaxed overflow-x-auto whitespace-pre">
								<code>{MCP_SNIPPETS[activeTab]}</code>
							</pre>
						</div>

						{/* Right Live MCP Response Resource */}
						<div className="p-6 sm:p-8 bg-[#070B09] overflow-x-auto">
							<div className="flex items-center justify-between text-[11px] text-neutral-500 mb-4 font-semibold">
								<span className="flex items-center gap-1.5">
									<Braces className="w-3.5 h-3.5 text-neutral-400" /> Tool Response Payload
								</span>
								<span className="text-neutral-400 font-mono">STATUS: 200 OK</span>
							</div>
							{/* The answer the agent actually gets, lifted out of the payload */}
							<div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-400/30">
								<div className="flex items-baseline gap-2 flex-wrap">
									<span className="font-mono tabular-nums text-2xl font-semibold text-emerald-300">
										525
									</span>
									<span className="text-[11px] text-neutral-300 font-sans">
										firms invest in AI / ML at Series A and have a partner you can email
									</span>
								</div>
								<p className="mt-1.5 text-[11px] text-neutral-500 font-sans">
									Returned to the agent in one call, ranked by thesis similarity.
								</p>
							</div>

							<pre className="text-neutral-500 leading-relaxed overflow-x-auto whitespace-pre text-[11px]">
								<code>{SAMPLE_MCP_RESPONSE}</code>
							</pre>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
