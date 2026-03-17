import { ShieldCheck, Vault, Workflow, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    label: "Policy enforcement",
    title: "Guardrails baked into every payment",
    body: "Define fine-grained spending rules, whitelists, and emergency stops so your agents can move fast without ever going rogue.",
  },
  {
    icon: Vault,
    label: "Agent vaults",
    title: "Yield-aware agent-native treasuries",
    body: "Manage a single cross-chain vault per agent with ERC4626-style deposits, withdrawals, and transparent yield tracking.",
  },
  {
    icon: Workflow,
    label: "Deterministic flows",
    title: "Pre-simulated, XCM-first routing",
    body: "Preview routes, splits, and fees before committing on-chain, with end-to-end visibility from intent to receipt.",
  },
  {
    icon: Sparkles,
    label: "Receipts as NFTs",
    title: "Every payment leaves a story",
    body: "Mint an auditable NFT for each executed payment, capturing who paid, how it was split, and which agent approved it.",
  },
];

export function LandingFeatures() {
  return (
    <section className="page-grid pt-0">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="pill mb-3">Why builders use AgentPay</p>
          <h2 className="text-sm font-medium tracking-tight text-slate-50 md:text-base">
            Agent-centric UX across the entire treasury surface.
          </h2>
        </div>
        <p className="hidden max-w-sm text-xs text-slate-400 md:block">
          From wallet connection to receipt NFTs, every surface is designed around
          how you actually operate agents: observe, simulate, enforce, then pay.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <article
            key={feature.title}
            className="section-card group flex flex-col justify-between bg-slate-950/70 transition hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-slate-950/90"
          >
            <div className="mb-4 flex items-center justify-between text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-2">
                <feature.icon className="h-3.5 w-3.5 text-cyan-300" />
                {feature.label}
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium tracking-tight text-slate-50">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                {feature.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

