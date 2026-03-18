import Link from "next/link";
import { BadgeDollarSign } from "lucide-react";

const FOOTER = {
  product: [
    { href: "/#product", label: "Features" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/connect", label: "Connect wallet" },
  ],
  resources: [
    { href: "#", label: "Docs" },
    { href: "#", label: "API" },
    { href: "#", label: "Status" },
  ],
  legal: [
    { href: "#", label: "Privacy" },
    { href: "#", label: "Terms" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90">
      <div className="site-container py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600">
                <BadgeDollarSign className="h-5 w-5 text-slate-950" strokeWidth={2.25} />
              </span>
              <span className="text-lg font-bold text-white">AgentPay</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Treasury, policies, and payments built around your agents—not the other
              way around. Polkadot Hub–ready.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Product
              </p>
              <ul className="mt-4 space-y-3">
                {FOOTER.product.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-400 transition hover:text-cyan-400"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Resources
              </p>
              <ul className="mt-4 space-y-3">
                {FOOTER.resources.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-400 transition hover:text-cyan-400"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Legal
              </p>
              <ul className="mt-4 space-y-3">
                {FOOTER.legal.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-400 transition hover:text-cyan-400"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-800/80 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} AgentPay. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built for deterministic, agent-centric on-chain finance.
          </p>
        </div>
      </div>
    </footer>
  );
}
