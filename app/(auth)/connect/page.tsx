"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Wallet, ShieldAlert, Network, ArrowLeft } from "lucide-react";
import { useAppStore } from "@/state/useAppStore";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";

export default function ConnectPage() {
  const { wallet } = useAppStore();

  return (
    <div className="site-container flex flex-1 flex-col py-10 sm:py-16">
      <Link
        href="/"
        className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-2 lg:gap-14 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <p className="section-eyebrow">Onboarding</p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Connect your wallet
          </h1>
          <p className="text-base leading-relaxed text-slate-400">
            We&apos;ll validate your network before you register an agent or move funds. This step
            is read-only until you approve in your wallet.
          </p>
          <ul className="space-y-4 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                <Network className="h-4 w-4" />
              </span>
              <span>
                <strong className="text-white">Expected network:</strong> Polkadot Hub (or your
                configured chain).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <ShieldAlert className="h-4 w-4" />
              </span>
              <span>
                <strong className="text-white">No transactions yet</strong> — connect only
                establishes your session.
              </span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-8 shadow-xl shadow-black/20 backdrop-blur-sm sm:p-10"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-6">
            <span className="flex items-center gap-3 text-sm font-medium text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                <Wallet className="h-5 w-5" />
              </span>
              Wallet
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                wallet.connected
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {wallet.connected ? "Connected" : "Not connected"}
            </span>
          </div>
          <div className="pt-8">
            <ConnectWalletButton />
            <p className="mt-6 text-xs leading-relaxed text-slate-500">
              Uses wagmi-compatible wallets (e.g. MetaMask). After connecting, continue to the app
              to register your agent.
            </p>
            <Link
              href="/dashboard"
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl border border-slate-600 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/50"
            >
              Continue to dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
