"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bot, WalletCards } from "lucide-react";
import { useAppStore } from "@/state/useAppStore";

type ActionResult = {
  ok: boolean;
  response?: string;
  logs?: string[];
  executedActions?: Array<{
    contract: string;
    function: string;
    params: Record<string, unknown>;
    result: unknown;
  }>;
  error?: string;
};


export default function DashboardPage() {
  const { wallet, setAgent } = useAppStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVaultRunning, setIsVaultRunning] = useState(false);
  const [status, setStatus] = useState<string>("No actions yet.");
  const [logs, setLogs] = useState<string[]>([]);

  const connectedAddress =
    wallet.address ?? "0x1111111111111111111111111111111111111111";

  const logPreview = useMemo(() => logs.slice(0, 8), [logs]);

  async function handleRegister() {
    setIsRegistering(true);
    try {
      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentType: "registration",
          address: connectedAddress,
          useLocalPlanner: true,
        }),
      });

      const data = (await res.json()) as ActionResult;
      if (!res.ok || !data.ok) {
        setStatus(data.error || "Register failed");
        return;
      }

      setAgent({
        id: connectedAddress,
        name: "Agent wallet",
        status: "active",
      });
      setStatus("Agent registered successfully.");
      setLogs(data.logs || []);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setIsRegistering(false);
    }
  }

  async function handleVault() {
    setIsVaultRunning(true);
    try {
      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentType: "treasury",
          command:
            "Deposit into vault deposit 500000000000000000 for 0x3333333333333333333333333333333333333333 and check total assets",
          useLocalPlanner: true,
        }),
      });
      const data = (await res.json()) as ActionResult;
      if (!res.ok || !data.ok) {
        setStatus(data.error || "Vault action failed");
        return;
      }
      setStatus("Vault action completed.");
      setLogs(data.logs || []);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setIsVaultRunning(false);
    }
  }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Overview
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Snapshot of your agent, vault, and recent activity. Connect a wallet
          and register an agent to unlock the full flow.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Bot className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Agent
          </p>
          <p className="mt-1 text-lg font-semibold text-white">
            Not registered
          </p>
          <Link
            href="/dashboard/agent"
            className="mt-4 mr-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300"
          >
            Open console <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            disabled={isRegistering}
            onClick={handleRegister}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Register <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <WalletCards className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Vault
          </p>
          <p className="mt-1 text-lg font-semibold text-white">— DOT</p>
          <button
            type="button"
            disabled={isVaultRunning}
            onClick={handleVault}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Manage vault <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/20 p-6">
        <p className="text-sm font-medium text-slate-300">Status: {status}</p>
        <div className="mt-4 max-h-48 overflow-auto rounded-xl border border-slate-800 bg-slate-950/40 p-3">
          {logPreview.length === 0 ? (
            <p className="text-xs text-slate-500">No logs yet.</p>
          ) : (
            logPreview.map((line, idx) => (
              <p
                key={`${idx}-${line}`}
                className="font-mono text-xs text-slate-300"
              >
                {line}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
