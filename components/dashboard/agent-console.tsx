"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/state/useAppStore";

type AgentType = "payment" | "registration" | "treasury";

type ExecutedAction = {
  contract: string;
  function: string;
  params: Record<string, unknown>;
  result: unknown;
  transactionHash?: string;
};

type ApiResult = {
  ok: boolean;
  agentType: AgentType;
  response: string;
  executedActions: ExecutedAction[];
  logs: string[];
  error?: string;
};

const PRESET_COMMANDS: Record<AgentType, string> = {
  payment:
    "Pay 1000000000000000000 to service 0x2222222222222222222222222222222222222222 using SplitPayRouter",
  registration: "",
  treasury:
    "Deposit into vault deposit 500000000000000000 for 0x3333333333333333333333333333333333333333 and check total assets",
};

export function AgentConsole() {
  const { setAgent, setVault, setAgentRunning, setVaultRunning, agent } =
    useAppStore();
  const [agentType, setAgentType] = useState<AgentType>("payment");
  const [command, setCommand] = useState(PRESET_COMMANDS.payment);
  const [address, setAddress] = useState(
    "0x1111111111111111111111111111111111111111",
  );
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const placeholder = useMemo(() => {
    if (agentType === "payment") return PRESET_COMMANDS.payment;
    if (agentType === "treasury") return PRESET_COMMANDS.treasury;
    return "Registration uses address only.";
  }, [agentType]);

  async function runAgent() {
    setIsRunning(true);
    if (agentType === "registration") setAgentRunning(true);
    if (agentType === "treasury") setVaultRunning(true);
    setError(null);

    try {
      if (agentType === "payment" && !agent?.id) {
        setResult(null);
        setError("No agent registered. Register an agent first.");
        return;
      }
      const payload =
        agentType === "registration"
          ? { agentType, address }
          : { agentType, command };

      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as ApiResult & { error?: string };

      if (!res.ok) {
        setResult(null);
        setError(data.error || "Failed to run agent");
        return;
      }

      setResult(data);

      if (data.agentType === "registration" && data.ok) {
        setAgent({ id: address, name: "Agent wallet", status: "active" });
      }
      // If treasury run returned vault total assets, update global vault
      if (data.agentType === "treasury" && data.ok && data.executedActions) {
        const vaultAction = data.executedActions.find(
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
              setVault({ balance: asNumber / 1e18, currency: "DOT" });
            }
          } catch (e) {
            // ignore parse errors
          }
        }
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setResult(null);
      setError(message);
    } finally {
      setIsRunning(false);
      if (agentType === "registration") setAgentRunning(false);
      if (agentType === "treasury") setVaultRunning(false);
    }
  }

  function onChangeAgent(next: AgentType) {
    setAgentType(next);
    setResult(null);
    setError(null);
    setCommand(PRESET_COMMANDS[next]);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Agent Console</h2>
          {isRunning && (
            <span className="ml-2 inline-block animate-pulse text-sm text-slate-400">
              {agentType === "registration"
                ? "Registering..."
                : "Processing..."}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Run one agent at a time from the frontend and inspect called contract
          functions.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={() => onChangeAgent("payment")}
            className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
              agentType === "payment"
                ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                : "border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-600"
            }`}
          >
            Payment Agent
          </button>
          <button
            type="button"
            onClick={() => onChangeAgent("registration")}
            className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
              agentType === "registration"
                ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                : "border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-600"
            }`}
          >
            Registration Agent
          </button>
          <button
            type="button"
            onClick={() => onChangeAgent("treasury")}
            className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
              agentType === "treasury"
                ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                : "border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-600"
            }`}
          >
            Treasury Agent
          </button>
        </div>

        {agentType === "registration" ? (
          <div className="mt-4 space-y-2">
            <label
              htmlFor="agentAddress"
              className="text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Agent Address
            </label>
            <input
              id="agentAddress"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/40 placeholder:text-slate-500 focus:ring"
            />
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            <label
              htmlFor="agentCommand"
              className="text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Command
            </label>
            <textarea
              id="agentCommand"
              rows={4}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/40 placeholder:text-slate-500 focus:ring"
            />
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={runAgent}
            disabled={isRunning || (agentType === "payment" && !agent?.id)}
            className="inline-flex items-center rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRunning ? "Running..." : "Run Agent"}
          </button>
          <span className="text-xs text-slate-500">
            Tip: default commands include test data for contract execution.
          </span>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Agent Response
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">
              {result.response}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Executed Actions
            </p>
            <div className="mt-3 space-y-3">
              {result.executedActions.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No actions were executed.
                </p>
              ) : (
                result.executedActions.map((action, idx) => (
                  <div
                    key={`${action.contract}-${action.function}-${idx}`}
                    className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-3"
                  >
                    <p className="text-sm font-medium text-cyan-300">
                      {action.contract}.{action.function}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      params: {JSON.stringify(action.params)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      result: {JSON.stringify(action.result)}
                    </p>
                    {action.transactionHash && (
                      <p className="mt-1.5 font-mono text-[10px] text-cyan-500/70">
                        tx: {action.transactionHash}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Execution Logs
            </p>
            <div className="mt-2 max-h-56 space-y-1 overflow-auto rounded-xl border border-slate-700/70 bg-slate-950/50 p-3">
              {result.logs.length === 0 ? (
                <p className="text-sm text-slate-500">No logs yet.</p>
              ) : (
                result.logs.map((log, i) => (
                  <p
                    key={`${i}-${log}`}
                    className="font-mono text-xs text-slate-300"
                  >
                    {log}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
