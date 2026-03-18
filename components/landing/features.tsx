import { ShieldCheck, Vault, Workflow, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    label: "Policy enforcement",
    title: "Guardrails on every payment",
    body: "Whitelists, caps, emergency pause—your agents move fast within rules you define.",
    className: "sm:col-span-2 lg:col-span-2",
  },
  {
    icon: Vault,
    label: "Agent vaults",
    title: "One treasury per agent",
    body: "Deposits, withdrawals, and yield in one place—ERC-4626-style clarity.",
    className: "sm:col-span-1",
  },
  {
    icon: Workflow,
    label: "Deterministic flows",
    title: "Simulate before you sign",
    body: "See splits, routes, and fees before anything hits the chain.",
    className: "sm:col-span-1",
  },
  {
    icon: Sparkles,
    label: "Receipt NFTs",
    title: "Proof that sticks",
    body: "Every payment mints an auditable receipt NFT—who, how much, how it split.",
    className: "sm:col-span-2 lg:col-span-2",
  },
];

export function LandingFeatures() {
  return (
    <section id="product" className="scroll-mt-24 py-16 sm:py-24">
      <div className="site-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Product</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything an agent needs to spend responsibly
          </h2>
          <p className="mt-4 text-base text-slate-400">
            One surface from identity to receipt—no duct-tape between wallets, spreadsheets, and
            explorers.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className={`group rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 transition hover:border-cyan-500/30 hover:bg-slate-900/70 hover:shadow-lg hover:shadow-cyan-500/5 lg:p-8 ${f.className}`}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition group-hover:bg-cyan-500/15">
                <f.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-500/80">
                {f.label}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
