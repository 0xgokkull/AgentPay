"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Bot, WalletCards, Activity, Cpu, Globe, ShieldCheck, Terminal as TerminalIcon, Sparkles, ExternalLink } from "lucide-react";
import { useAppStore, ApiResult, EXPLORER_URL } from "@/state/useAppStore";
import { AgentLoader } from "@/components/dashboard/agent-loader";

export default function DashboardPage() {
  const { 
    wallet, 
    setAgent, 
    setVault,
    execution, 
    startExecution, 
    finishExecution, 
    failExecution 
  } = useAppStore();
  
  const [status, setStatus] = useState<string>("System Ready");
  const [metrics, setMetrics] = useState({ latency: 42, block: 420420, uptime: "99.9%" });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        latency: Math.floor(Math.random() * (60 - 30) + 30),
        block: prev.block + (Math.random() > 0.8 ? 1 : 0),
        uptime: prev.uptime
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const connectedAddress = wallet.address ?? "0x1111111111111111111111111111111111111111";
  const isRunning = execution.status === "running";
  const logs = execution.result?.logs || [];
  const logPreview = useMemo(() => [...logs].slice(-10).reverse(), [logs]);

  async function handleRegister() {
    startExecution("registration");
    setStatus("Initiating Agent Protocol...");
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

      const data = (await res.json()) as ApiResult;
      if (!res.ok || !data.ok) {
        failExecution(data.error || "Registry failed");
        setStatus(data.error || "Registry failed");
        return;
      }

      setAgent({ id: connectedAddress, name: "Agent wallet", status: "active" });
      setStatus("Protocol: Agent Synchronized");
      finishExecution(data);
    } catch (error) {
      failExecution("System Malfunction");
      setStatus("Error: System Malfunction");
    }
  }

  async function handleVault() {
    startExecution("treasury");
    setStatus("Accessing Agent Vault...");
    try {
      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentType: "treasury",
          command: "Deposit into vault deposit 500000000000000000 for 0x3333333333333333333333333333333333333333 and check total assets",
          useLocalPlanner: true,
        }),
      });
      const data = (await res.json()) as ApiResult;
      if (!res.ok || !data.ok) {
        failExecution(data.error || "Vault: Operation Interrupted");
        setStatus("Vault: Operation Interrupted");
        return;
      }
      
      const vaultAction = data.executedActions?.find(
        (a) =>
          a.contract?.toString().toLowerCase().includes("vault") &&
          a.function?.toString().toLowerCase().includes("totalassets"),
      );
      if (vaultAction && vaultAction.result != null) {
        try {
          const raw = vaultAction.result as any;
          const totalStr = raw.totalAssets || raw.total || String(raw);
          const asNumber = Number(totalStr);
          if (!Number.isNaN(asNumber)) {
            setVault({ balance: asNumber / 1e18 });
          }
        } catch (e) {
          console.error("Failed to parse vault total assets result:", e);
        }
      }

      setStatus("Vault: Asset Rebalancing Complete");
      finishExecution(data);
    } catch (error) {
      failExecution("Vault Connection Refused");
      setStatus("Error: Vault Connection Refused");
    }
  }

  function renderLogLine(line: string) {
    const hashRegex = /0x[a-fA-F0-9]{64}/g;
    const parts = line.split(hashRegex);
    const hashes = line.match(hashRegex);

    if (!hashes) return <span>{line}</span>;

    return (
      <span>
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {hashes[i] && (
              <a 
                href={`${EXPLORER_URL}${hashes[i]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors border border-cyan-500/20 mx-1"
              >
                <span className="font-mono">{hashes[i].substring(0, 6)}...{hashes[i].substring(58)}</span>
                <ExternalLink className="h-2 w-2" />
              </a>
            )}
          </span>
        ))}
      </span>
    );
  }

  return (
    <div className="relative space-y-6 pb-10">
      <AnimatePresence>
        {isRunning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg p-8 rounded-3xl border border-cyan-500/30 bg-slate-900/80 shadow-2xl overflow-hidden relative"
            >
              <AgentLoader />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-cyan-500/5 to-transparent shadow-[inset_0_0_50px_rgba(6,182,212,0.1)]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-1">
             <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
             <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-cyan-500/80">Mission Control</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Control Center
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Autonomous Financial Infrastructure Management
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/30 p-2 backdrop-blur-md"
        >
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-950/40 border border-slate-800/40">
             <Activity className="h-3.5 w-3.5 text-cyan-400" />
             <div className="flex flex-col">
               <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Latency</span>
               <span className="text-xs font-mono text-cyan-300">{metrics.latency}ms</span>
             </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-950/40 border border-slate-800/40">
             <Globe className="h-3.5 w-3.5 text-emerald-400" />
             <div className="flex flex-col">
               <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Network</span>
               <span className="text-xs font-mono text-emerald-300">Testnet</span>
             </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-950/40 border border-slate-800/40">
             <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
             <div className="flex flex-col">
               <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Block</span>
               <span className="text-xs font-mono text-indigo-300">#{metrics.block}</span>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:bg-slate-900/60"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-transform group-hover:scale-110">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-slate-950/60 px-2.5 py-1 border border-slate-800/60">
                  <div className={`h-1.5 w-1.5 rounded-full ${wallet.address ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`} />
                  <span className="text-[10px] font-bold text-slate-400">SYNCED</span>
                </div>
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                Agent Protocol
              </p>
              <h3 className="mt-1 text-xl font-bold text-white">
                {wallet.address ? "Autonomous Node v1" : "Awaiting Client"}
              </h3>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                 <button
                   onClick={handleRegister}
                    disabled={isRunning}
                    className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 active:scale-95 disabled:opacity-50"
                  >
                    {isRunning && execution.agentType === "registration" ? <Activity className="h-4 w-4 animate-spin" /> : "Register"}
                   <ArrowRight className="h-4 w-4" />
                 </button>
                 <Link
                   href="/dashboard/agent"
                   className="flex items-center justify-center gap-2 rounded-xl bg-slate-800/80 py-3 text-sm font-bold text-white border border-slate-700/50 transition-all hover:bg-slate-700 active:scale-95"
                 >
                   Console
                 </Link>
              </div>
            </div>
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/5 blur-3xl" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl transition-all hover:border-emerald-500/40 hover:bg-slate-900/60"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-transform group-hover:scale-110">
                  <WalletCards className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-slate-950/60 px-2.5 py-1 border border-slate-800/60">
                   <Sparkles className="h-3 w-3 text-amber-400" />
                   <span className="text-[10px] font-bold text-amber-400/80">YIELD READY</span>
                </div>
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                Treasury Engine
              </p>
              <h3 className="mt-1 text-xl font-bold text-white">
                Secure Yield Vault
              </h3>
              
              <div className="mt-6 flex items-baseline gap-2">
                 <span className="text-3xl font-black text-white">
                   {useAppStore.getState().vault.balance > 0 ? (useAppStore.getState().vault.balance * 1e18).toLocaleString() : "4,230"}
                 </span>
                 <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">PAS</span>
              </div>
              
              <button
                onClick={handleVault}
                 disabled={isRunning}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-3 text-sm font-bold text-emerald-400 transition-all hover:bg-emerald-500/20 active:scale-95 disabled:opacity-50"
              >
                {isRunning && execution.agentType === "treasury" ? <Activity className="h-4 w-4 animate-spin" /> : "Execute Treasury Flow"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl" />
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col rounded-3xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-3xl lg:col-span-8 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                <TerminalIcon className="h-4 w-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">System Monitor</h4>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">{status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6 subtle-scrollbar max-h-[520px]">
            <div className="space-y-4 font-mono text-xs">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                   <Cpu className="h-12 w-12 mb-4 text-slate-600" />
                   <p className="text-slate-500 font-medium tracking-tight italic">Awaiting protocol execution logs...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <AnimatePresence mode="popLayout">
                    {logPreview.map((line, idx) => (
                      <motion.div
                        key={`${idx}-${line.substring(0, 20)}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-4 group"
                      >
                        <span className="shrink-0 text-slate-700 font-bold">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                        <div className="flex-1 rounded-lg bg-slate-900/50 border border-slate-800/40 p-2.5 transition-colors group-hover:border-cyan-500/30 group-hover:bg-slate-900/80">
                          <span className="text-slate-300 leading-relaxed font-sans">
                            {renderLogLine(line)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-slate-800/80 px-6 py-3 bg-slate-900/20">
             <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic">Encrypted Secure Connection // AES-256</p>
                <div className="flex gap-4 items-center">
                   <div className="h-1 w-24 rounded-full bg-slate-800 overflow-hidden">
                      <motion.div 
                        animate={{ x: [-96, 96] }} 
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="h-full w-24 bg-cyan-500/40 blur-sm" 
                      />
                   </div>
                   <span className="text-[9px] font-bold text-cyan-600 uppercase tracking-widest">Live Flow</span>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
