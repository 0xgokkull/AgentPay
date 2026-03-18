import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingCTA() {
  return (
    <section className="py-16 sm:py-24">
      <div className="site-container">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/80 via-slate-900 to-slate-950 px-8 py-14 text-center shadow-2xl shadow-cyan-950/40 sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(34,211,238,0.15),transparent)]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to run treasury like a product?
            </h2>
            <p className="mt-4 text-base text-slate-400">
              Connect your wallet, open the app, and register your first agent in minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/connect"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-8 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-600 bg-slate-900/50 px-8 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800/50"
              >
                Explore dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
