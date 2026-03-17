"use client";

import { motion } from "framer-motion";
import { Wallet, ShieldAlert, Network } from "lucide-react";
import { useAppStore } from "@/state/useAppStore";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";

export default function ConnectPage() {
  const { wallet } = useAppStore();

  return (
    <main className="flex min-h-screen flex-col">
      <div className="page-grid">
        <div className="section-card flex flex-col gap-6 bg-slate-950/80 md:flex-row md:items-center">
          <div className="flex-1 space-y-4">
            <p className="pill">Step 1 · Connect wallet</p>
            <h1 className="text-xl font-semibold tracking-tight text-slate-50 md:text-2xl">
              Connect to Polkadot Hub and prepare your agent vault.
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300">
              AgentPay requires a Polkadot-compatible wallet. We validate you are
              on the Hub network before letting your agents register and move
              funds.
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Network className="h-3.5 w-3.5 text-cyan-300" />
                <span>Expected network: Polkadot Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-300" />
                <span>No signing yet — this step is read-only.</span>
              </div>
            </div>
          </div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="section-card glass-panel space-y-4 bg-slate-900/80">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-cyan-300" />
                  Wallet connection
                </span>
                <span className="text-[11px] text-slate-400">
                  {wallet.connected ? "Connected" : "Not connected"}
                </span>
              </div>

              <div className="mt-1">
                <ConnectWalletButton />
              </div>

              <p className="text-[11px] leading-relaxed text-slate-400">
                This is a UX shell only — we&apos;ll wire this button to your
                preferred Polkadot wallet extension or signer when connecting to
                real contracts.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

