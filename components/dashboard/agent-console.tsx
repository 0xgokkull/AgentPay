"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentLoader } from "./agent-loader";
import { 
  ArrowRight, 
  Bot, 
  Settings, 
  Terminal as TerminalIcon, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Hash, 
  CheckCircle2, 
  ChevronRight,
  Database,
  Coins,
  History,
  ExternalLink
} from "lucide-react";

import { useAppStore, AgentType, ApiResult, EXPLORER_URL } from "@/state/useAppStore";

const PRESET_COMMANDS: Record<AgentType, string> = {
  payment:
    "Pay 1000000000000000000 to service 0x2222222222222222222222222222222222222222 using SplitPayRouter",
  registration: "",
  treasury:
    "Deposit into vault deposit 500000000000000000 for 0x3333333333333333333333333333333333333333 and check total assets",
};

export function AgentConsole() {
  const { 
    wallet,
    agent,
    setAgent,
    setVault,
    execution, 
    startExecution, 
    finishExecution, 
    failExecution, 
    resetExecution 
  } = useAppStore();
  
  const [agentType, setAgentType] = useState<AgentType>("payment");
  const [command, setCommand] = useState(PRESET_COMMANDS.payment);
  const [address, setAddress] = useState(
    wallet?.address || "0x1111111111111111111111111111111111111111",
  );

  const isRunning = execution.status === "running";
  const result = execution.result;
  const error = execution.error;

  const placeholder = useMemo(() => {
    if (agentType === "payment") return PRESET_COMMANDS.payment;
    if (agentType === "treasury") return PRESET_COMMANDS.treasury;
    return "Registration uses address only.";
  }, [agentType]);

  useEffect(() => {
    let mounted = true;
    async function fetchStatus() {
      const addr = wallet?.address;
      if (!addr) return;
      try {
        const res = await fetch(`/api/agent/status?address=${addr}`);
        const data = await res.json();
        if (!mounted) return;
        if (res.ok && data.ok) {
          if (data.registered) {
            setAgent({ id: addr, name: "Agent wallet", status: "active" });
          }
          if (data.totalAssets) {
            setVault({ balance: Number(data.totalAssets) / 1e18 });
          }
        }
      } catch (e) {
        console.error("Failed to fetch agent status:", e);
      }
    }

    fetchStatus();
    return () => {
      mounted = false;
    };
  }, [wallet?.address, setAgent, setVault]);

  async function runAgent() {
    startExecution(agentType);

    try {
      if (agentType === "payment" && !agent?.id) {
        failExecution("No agent registered. Register an agent first.");
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

      if (!res.ok || !data.ok) {
        failExecution(data.error || "Failed to run agent");
        return;
      }
      
      if (data.agentType === "registration" && data.ok) {
        setAgent({ id: address, name: "Agent wallet", status: "active" });
      }

      if (data.agentType === "treasury" && data.ok && data.executedActions) {
        const vaultAction = data.executedActions.find(
          (a) => a.function?.toString().toLowerCase().includes("totalassets")
        );
        if (vaultAction && vaultAction.result != null) {
          const raw = vaultAction.result as any;
          const totalStr = raw.totalAssets || raw.total || String(raw);
          const asNumber = Number(totalStr);
          if (!Number.isNaN(asNumber)) {
            setVault({ balance: asNumber / 1e18, currency: "DOT" });
          }
        }
      }

      finishExecution(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      failExecution(message);
    }
  }

  function onChangeAgent(next: AgentType) {
    setAgentType(next);
    resetExecution();
    setCommand(PRESET_COMMANDS[next]);
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-cyan-500/80">Agent Interface</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">Agent Console</h2>
            <p className="mt-1 text-sm text-slate-500 font-medium max-w-md">
              Synchronize with autonomous financial nodes for cross-chain execution.
            </p>
          </div>
          
          <div className="flex items-center gap-3 rounded-2xl bg-slate-950/60 p-1.5 border border-slate-800/60 self-start">
             {[
               { id: "payment", label: "Payment", icon: Coins },
               { id: "registration", label: "Registry", icon: ShieldCheck },
               { id: "treasury", label: "Treasury", icon: Database }
             ].map((t) => (
               <button
                 key={t.id}
                 onClick={() => onChangeAgent(t.id as AgentType)}
                 className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-300 ${
                   agentType === t.id ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
                 }`}
               >
                 {agentType === t.id && (
                   <motion.div
                     layoutId="agent-tab-active"
                     className="absolute inset-0 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
                     transition={{ type: "spring", stiffness: 400, damping: 30 }}
                   />
                 )}
                 <t.icon className={`relative z-10 h-3.5 w-3.5 transition-transform duration-300 ${agentType === t.id ? "scale-110" : ""}`} />
                 <span className="relative z-10 tracking-wide uppercase">{t.label}</span>
               </button>
             ))}
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <div className="relative group">
            <div className="absolute -top-3 left-4 flex items-center gap-2 px-2 bg-slate-900 z-10">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {agentType === "registration" ? "Node Identity" : "Instruction Set"}
              </span>
              <div className="flex items-center gap-1.5 rounded-full bg-slate-950 px-2 py-0.5 border border-slate-800">
                <Cpu className="h-2.5 w-2.5 text-cyan-500" />
                <span className="text-[8px] font-bold text-slate-400">LLAMA-3-70B</span>
              </div>
            </div>
            
            {agentType === "registration" ? (
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                  <Hash className="h-4 w-4" />
                </div>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700/50 bg-slate-950/40 py-5 pl-11 pr-5 text-sm font-mono text-cyan-50 transition-all focus:border-cyan-500/50 focus:bg-slate-950/80 focus:ring-4 focus:ring-cyan-500/5 outline-none"
                />
              </div>
            ) : (
              <div className="relative">
                <textarea
                  rows={4}
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder={placeholder}
                  className="w-full rounded-2xl border border-slate-700/50 bg-slate-950/40 p-5 text-sm font-medium leading-relaxed text-slate-200 transition-all focus:border-cyan-500/50 focus:bg-slate-950/80 focus:ring-4 focus:ring-cyan-500/5 outline-none placeholder:text-slate-700 scrollbar-hide"
                />
                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                  Ready for Sync
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={runAgent}
              disabled={isRunning}
              className={`relative flex h-12 w-full sm:w-48 items-center justify-center gap-2 rounded-2xl font-bold transition-all shadow-xl shadow-cyan-500/10 ${
                isRunning 
                  ? "bg-slate-900 text-cyan-500 border border-cyan-500/30 overflow-hidden" 
                  : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              }`}
            >
              {isRunning && (
                <motion.div
                   className="absolute inset-0 bg-cyan-500/10"
                   animate={{ x: ["-100%", "100%"] }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              )}
              <Zap className={`relative z-10 h-4 w-4 ${isRunning ? "animate-pulse" : ""}`} />
              <span className="relative z-10 tracking-wide uppercase text-xs">
                {isRunning ? "Synchronizing" : "Execute Agent"}
              </span>
            </motion.button>
            <div className="flex items-center gap-2 text-slate-500">
               <div className="h-1 w-1 rounded-full bg-slate-700" />
               <p className="text-[11px] font-medium italic tracking-tight">Utilizing autonomous planning engine for cross-chain routing.</p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isRunning && (
          <motion.div 
            key="loader"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="rounded-3xl border border-cyan-500/30 bg-slate-950/60 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            <AgentLoader />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-cyan-500/5 to-transparent" />
          </motion.div>
        )}

        {error && !isRunning && (
          <motion.div 
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 rounded-3xl border border-rose-500/30 bg-rose-500/5 p-6 backdrop-blur-xl"
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
               <Zap className="h-5 w-5 rotate-180" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">Execution Error</p>
              <p className="text-sm font-medium text-rose-200/80 leading-relaxed">{error}</p>
            </div>
          </motion.div>
        )}

        {result && !isRunning && (
          <motion.div 
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group relative flex gap-6"
            >
              <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                 <Bot className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-white uppercase tracking-tight">Autonomous Agent</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] border-l border-slate-800 pl-3">Response Protocol</span>
                 </div>
                 <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl relative transition-all group-hover:bg-slate-900/60">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200 font-medium italic">
                      {result.response}
                    </p>
                    <div className="absolute -left-2 top-4 h-4 w-4 rotate-45 border-l border-b border-slate-800/80 bg-slate-900/40 transition-all group-hover:bg-slate-900/60" />
                 </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 px-2">
                 <ShieldCheck className="h-4 w-4 text-emerald-400" />
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Chain Verification Proof</h4>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {result.executedActions.length === 0 ? (
                  <div className="md:col-span-2 rounded-3xl border border-slate-800/60 bg-slate-950/40 px-6 py-8 text-center border-dashed">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">No state mutations recorded for this cycle.</p>
                  </div>
                ) : (
                  result.executedActions.map((action, idx) => (
                    <motion.div
                      key={`${action.contract}-${action.function}-${idx}`}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md hover:border-emerald-500/40 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                               <Zap className="h-5 w-5" />
                            </div>
                            <div>
                               <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Contract Proxy</p>
                               <h5 className="text-sm font-bold text-white">{action.contract}</h5>
                            </div>
                         </div>
                         <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">SUCCESS</span>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-slate-500 uppercase tracking-widest">Function Index</span>
                            <span className="text-cyan-400 font-mono tracking-tight">{action.function}</span>
                         </div>
                         <div className="space-y-2 rounded-2xl bg-slate-950/60 p-3 border border-slate-800/60">
                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Payload Manifest</p>
                            <div className="max-h-20 overflow-auto scrollbar-hide">
                               <pre className="text-[10px] text-slate-400 leading-tight font-mono">
                                 {JSON.stringify(action.params, null, 2)}
                               </pre>
                            </div>
                         </div>
                          {action.transactionHash && (
                            <a 
                              href={`${EXPLORER_URL}${action.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/40 group/link"
                            >
                               <div className="flex items-center gap-2 overflow-hidden">
                                 <History className="h-3 w-3 text-slate-600 group-hover/link:text-cyan-500 transition-colors" />
                                 <p className="font-mono text-[9px] text-slate-500 truncate group-hover/link:text-cyan-400 transition-colors">
                                   {action.transactionHash}
                                 </p>
                               </div>
                               <ExternalLink className="h-2.5 w-2.5 text-slate-700 group-hover/link:text-cyan-500 transition-colors shrink-0" />
                            </a>
                          )}
                      </div>
                      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col rounded-3xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4 bg-slate-900/20">
                <div className="flex items-center gap-3">
                  <TerminalIcon className="h-4 w-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest">Protocol Execution Monitor</h4>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => <div key={i} className="h-1 w-1 rounded-full bg-slate-800" />)}
                </div>
              </div>

              <div className="p-6 h-60 overflow-auto scrollbar-hide font-mono text-xs">
                 <div className="space-y-3">
                    {result.logs.map((log, i) => (
                      <div key={`${i}-${log}`} className="flex gap-4 group">
                         <span className="shrink-0 text-slate-700 font-bold">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                         <p className="text-slate-400 leading-relaxed group-hover:text-cyan-300 transition-colors">{log}</p>
                      </div>
                    ))}
                 </div>
              </div>
              
              <div className="border-t border-slate-800/80 px-6 py-3 bg-slate-900/40 flex items-center justify-between">
                 <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Autonomous Sync Completed // No further actions required</p>
                 <span className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-widest animate-pulse">Live // Synced</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
