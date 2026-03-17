"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, WalletCards } from "lucide-react";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";

export function LandingHero() {
  return (
    <section className="glass-panel relative overflow-hidden px-6 py-8 md:px-10 md:py-12">
      <motion.div
        className="pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
      />

      <div className="relative flex flex-col gap-8 md:flex-row md:items-center">
        <motion.div
          className="flex-1 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="pill">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>Deterministic agent-native treasury</span>
          </div>

          <div className="space-y-4">
            <h1 className="bg-gradient-to-br from-slate-50 via-cyan-100 to-sky-300 bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl lg:text-5xl">
              Pay like an agent,
              <br />
              <span className="text-cyan-300">not a multisig.</span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
              AgentPay turns your AI agents into first-class treasurers on Polkadot
              Hub. Register an agent, set spending policies, route yield across
              chains, and execute payments with pre-simulated splits and receipts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-4 py-2 text-xs font-medium text-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.9)] transition hover:border-slate-500/80 hover:bg-slate-900"
            >
              <WalletCards className="h-3.5 w-3.5 text-cyan-300" />
              <span>Preview dashboard</span>
            </Link>
            <ConnectWalletButton size="sm" />
          </div>

          <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Deterministic split simulation
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Policy-enforced payouts
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              NFT receipts for every payment
            </span>
          </div>
        </motion.div>

        <motion.div
          className="mt-4 flex-1 md:mt-0"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
        >
          <div className="glass-panel relative h-full min-h-[220px] overflow-hidden p-4 md:min-h-[260px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.22),transparent_55%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.22),transparent_55%)]" />
            <div className="relative flex h-full flex-col justify-between gap-4">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] font-medium text-slate-200">
                  Agent dashboard • Preview
                </span>
                <span className="text-[10px] text-slate-400">Polkadot Hub</span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="section-card space-y-2 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/80 p-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="font-medium">Agent status</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">vault-ai.agentpay.dot</p>
                  <p className="mt-1 text-[11px] text-slate-300">
                    Policies enforced on every transfer.
                  </p>
                </div>

                <div className="section-card space-y-2 bg-slate-950/70 p-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="font-medium">Vault balance</span>
                    <span className="text-[10px] text-slate-400">+4.2% APY</span>
                  </div>
                  <p className="text-lg font-semibold text-cyan-200">4,230.18 DOT</p>
                  <p className="text-[11px] text-slate-400">Optimized across XCM routes</p>
                </div>
              </div>

              <div className="section-card flex items-center justify-between bg-slate-950/60 p-3">
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400">Next payment</p>
                  <p className="text-sm font-medium text-slate-50">12.5 DOT &bull; AgentOps</p>
                  <p className="text-[11px] text-slate-400">
                    70/20/10 split • Receipt NFT minted
                  </p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 opacity-90 shadow-[0_18px_45px_rgba(8,47,73,0.8)]" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

