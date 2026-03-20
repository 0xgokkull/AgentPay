"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";
import { PageLoader } from "@/components/ui/page-loader";

const TRUST = [
  "Pre-tx split simulation",
  "Policy-gated payouts",
  "NFT receipts per payment",
];

export function LandingHero() {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const handleAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };
  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24 lg:pt-16 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[480px] w-[min(100%,800px)] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="site-container">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="section-eyebrow"
          >
            Agent-native treasury
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.06]"
          >
            Pay and treasury{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
              built for agents
            </span>
            —not multisigs.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            Register an AI agent, fund a vault, set spending rules, and execute payments with
            simulated splits and on-chain receipts—on Polkadot Hub.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4"
          >
            <button
              onClick={handleAppClick}
              className="inline-flex h-12 min-w-[200px] items-center justify-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-slate-100 hover:shadow-cyan-500/20 cursor-pointer"
            >
              Open app
              <ArrowRight className="h-4 w-4" />
            </button>
            <ConnectWalletButton size="md" />
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-400"
          >
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-500/80" />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Product preview card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/60 shadow-2xl shadow-black/40 backdrop-blur-sm sm:rounded-3xl">
            <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-950/80 px-4 py-3 sm:px-5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-4 font-mono text-[11px] text-slate-500">
                app.agentpay.io / dashboard
              </span>
            </div>
            <div className="grid gap-px bg-slate-800/50 sm:grid-cols-12">
              <div className="bg-slate-950/90 p-5 sm:col-span-4 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Agent
                </p>
                <p className="mt-2 font-mono text-sm text-cyan-400">vault-ai.agentpay</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Active
                </div>
              </div>
              <div className="bg-slate-950/70 p-5 sm:col-span-4 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Vault
                </p>
                <p className="mt-2 text-2xl font-bold text-white">4,230.18</p>
                <p className="text-xs text-slate-500">DOT · +4.2% yield</p>
              </div>
              <div className="bg-slate-950/70 p-5 sm:col-span-4 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Next payment
                </p>
                <p className="mt-2 text-lg font-semibold text-white">12.5 DOT</p>
                <p className="text-xs text-slate-500">70 / 20 / 10 split</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <PageLoader isVisible={isNavigating} />
    </section>
  );
}
