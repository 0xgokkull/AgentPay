"use client";

import { useAppStore } from "@/state/useAppStore";
import { Bot, CircleUserRound } from "lucide-react";
import { useAccount } from "wagmi";

export function Topbar() {
  const { agent } = useAppStore();
  const { address, isConnected } = useAccount();

  const short =
    address && isConnected
      ? `${address.slice(0, 6)}…${address.slice(-4)}`
      : "Not connected";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/90 px-5 py-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center justify-between gap-6">
        <div className="min-w-0 flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 ring-1 ring-slate-700/50">
            <Bot className="h-5 w-5 text-cyan-400" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {agent.name ?? "No agent yet"}
            </p>
            <p className="truncate text-xs text-slate-500">
              {agent.id ? agent.id : "Register an agent from the sidebar"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="font-mono text-sm font-medium text-slate-200">{short}</p>
            <p className="text-xs text-slate-500">Wallet</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800/80 ring-1 ring-slate-700/50">
            <CircleUserRound className="h-5 w-5 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
