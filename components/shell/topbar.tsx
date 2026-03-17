import { useAppStore } from "@/state/useAppStore";
import { Bot, CircleUserRound } from "lucide-react";

export function Topbar() {
  const { wallet, agent } = useAppStore();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/80 px-4 py-3 backdrop-blur-xl md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-900">
            <Bot className="h-4 w-4 text-cyan-300" />
          </div>
          <div>
            <p className="font-medium text-slate-100">
              {agent.name ?? "No agent registered"}
            </p>
            <p className="text-[11px] text-slate-400">
              {agent.id ? agent.id : "Register an agent to unlock flows"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="text-right">
            <p className="font-medium">
              {wallet.connected && wallet.address
                ? `${wallet.address.slice(0, 6)}…${wallet.address.slice(-4)}`
                : "Wallet not connected"}
            </p>
            <p className="text-[11px] text-slate-400">
              {wallet.network ?? "Network unknown"}
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-900">
            <CircleUserRound className="h-4 w-4 text-slate-200" />
          </div>
        </div>
      </div>
    </header>
  );
}

