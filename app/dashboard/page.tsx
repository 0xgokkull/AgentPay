"use client";

import { useEffect, useMemo, useState } from "react";
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
  const {
    wallet,
    agent,
    vault,
    setAgent,
    setVault,
    agentRunning,
    vaultRunning,
    setAgentRunning,
    setVaultRunning,
  } = useAppStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVaultRunning, setIsVaultRunning] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [status, setStatus] = useState<string>("No actions yet.");
  const [logs, setLogs] = useState<string[]>([]);

  const connectedAddress =
    wallet.address ?? "0x1111111111111111111111111111111111111111";

  const logPreview = useMemo(() => logs.slice(0, 8), [logs]);

  async function handleRegister() {
    setIsRegistering(true);
    setAgentRunning(true);
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
      try {
        localStorage.setItem("agent.id", connectedAddress);
      } catch {}
      setStatus("Agent registered successfully.");
      setLogs(data.logs || []);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setIsRegistering(false);
      setAgentRunning(false);
    }
  }

  async function handleVault() {
    setIsVaultRunning(true);
    setVaultRunning(true);
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

      const vaultAction = data.executedActions?.find(
        (a) =>
          a.contract?.toString().toLowerCase().includes("vault") &&
          a.function?.toString().toLowerCase().includes("totalassets"),
      );
      if (vaultAction && vaultAction.result != null) {
        try {
          const raw = vaultAction.result as unknown;
          const asNumber =
            typeof raw === "number"
              ? raw
              : typeof raw === "string"
                ? Number(raw)
                : Number(String(raw));
          if (!Number.isNaN(asNumber)) {
            setVault({ balance: asNumber / 1e18 });
          }
        } catch (e) {
          console.error("Failed to parse vault total assets result:", e);
        }
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setIsVaultRunning(false);
      setVaultRunning(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    async function fetchStatus() {
      const addr = wallet.address;
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("agent.id") : null;
      const queryAddr = addr || stored;
      if (!queryAddr) return;
      setIsStatusLoading(true);
      try {
        const res = await fetch(`/api/agent/status?address=${queryAddr}`);
        const data = await res.json();
        if (!mounted) return;
        if (res.ok && data.ok) {
          if (data.registered) {
            setAgent({ id: queryAddr, name: "Agent wallet", status: "active" });
          }
          if (data.totalAssets) {
            setVault({ balance: Number(data.totalAssets) / 1e18 });
          }
        }
      } catch (e) {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : String(e);
        setStatus(`Failed to fetch status: ${message}`);
      } finally {
        if (mounted) setIsStatusLoading(false);
      }
    }

    fetchStatus();
    return () => {
      mounted = false;
    };
  }, [wallet.address, setAgent, setVault]);

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
            {(isRegistering || agentRunning) && (
              <span className="ml-2 inline-block animate-pulse text-xs text-slate-400">
                Registering...
              </span>
            )}
          </p>
          <p className="mt-1 text-lg font-semibold text-white">
            {agent?.id
              ? `${agent.name ?? agent.id} — ${agent.status}`
              : "Not registered"}
            {(isRegistering || agentRunning) && (
              <span className="ml-2 text-sm text-slate-400">(processing)</span>
            )}
          </p>
          <Link
            href="/dashboard/agent"
            className="mt-4 mr-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300"
          >
            Open console <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            disabled={isRegistering || !!agent?.id}
            onClick={handleRegister}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {agent?.id ? "Registered" : "Register"}{" "}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <WalletCards className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Vault
            {isStatusLoading && (
              <span className="ml-2 inline-block animate-pulse text-xs text-slate-400">
                Checking...
              </span>
            )}
            {(isVaultRunning || vaultRunning) && (
              <span className="ml-2 inline-block animate-pulse text-xs text-slate-400">
                Processing...
              </span>
            )}
          </p>
          <p className="mt-1 text-lg font-semibold text-white">
            {vault && vault.balance > 0
              ? `${vault.balance.toFixed(4)} ${vault.currency}`
              : `— ${vault.currency}`}
          </p>
          <button
            type="button"
            disabled={isVaultRunning || vaultRunning}
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
