import Link from "next/link";
import { ArrowRight, Bot, WalletCards, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Overview
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Snapshot of your agent, vault, and recent activity. Connect a wallet and register an
          agent to unlock the full flow.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Bot className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Agent
          </p>
          <p className="mt-1 text-lg font-semibold text-white">Not registered</p>
          <Link
            href="/dashboard/agent/register"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300"
          >
            Register <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <WalletCards className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Vault
          </p>
          <p className="mt-1 text-lg font-semibold text-white">— DOT</p>
          <Link
            href="/dashboard/vault"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300"
          >
            Manage vault <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Activity className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Activity
          </p>
          <p className="mt-1 text-sm text-slate-400">No events yet.</p>
          <Link
            href="/dashboard/activity"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300"
          >
            View log <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/20 p-8 text-center">
        <p className="text-sm text-slate-400">
          Agent summary, vault widget, and live activity feed will appear here as you connect data
          sources.
        </p>
      </div>
    </div>
  );
}
