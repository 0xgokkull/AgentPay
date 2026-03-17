import Link from "next/link";

export function LandingCTA() {
  return (
    <section className="page-grid pt-0">
      <div className="section-card flex flex-col items-start justify-between gap-4 bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-slate-950/90 md:flex-row md:items-center">
        <div className="space-y-2">
          <p className="pill mb-2">Start in three steps</p>
          <h2 className="text-sm font-medium tracking-tight text-slate-50 md:text-base">
            Connect a wallet, register an agent, wire your first policy.
          </h2>
          <p className="max-w-xl text-xs leading-relaxed text-slate-400">
            We guide you from wallet connection all the way to your first on-chain
            payment, with deterministic state and clear feedback at each step.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-xs text-slate-300 md:text-sm">
          <ol className="space-y-1">
            <li>1. Connect on Polkadot Hub</li>
            <li>2. Register your AI agent (NFT)</li>
            <li>3. Fund the vault and configure rules</li>
          </ol>
          <Link
            href="/app/(auth)/connect"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-slate-50 px-4 py-2 text-xs font-medium text-slate-900 shadow-[0_14px_40px_rgba(15,23,42,0.9)] transition hover:-translate-y-0.5 hover:bg-slate-200"
          >
            Go to AgentPay app
          </Link>
        </div>
      </div>
    </section>
  );
}

