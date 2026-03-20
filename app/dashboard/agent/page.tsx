"use client";

import { useEffect } from "react";
import { AgentConsole } from "@/components/dashboard/agent-console";
import { useAppStore } from "@/state/useAppStore";

export default function AgentConsolePage() {
  const { wallet, setAgent, setVault } = useAppStore();

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Agent Integration
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Frontend integration for running payment, registration, and treasury
          agents one by one.
        </p>
      </div>

      <AgentConsole />
    </div>
  );
}
