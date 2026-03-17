"use client";

import { Wallet } from "lucide-react";
import { useAppStore } from "@/state/useAppStore";
import { useAccount, useConnect, useDisconnect } from "wagmi";

type Props = {
  size?: "sm" | "md";
};

export function ConnectWalletButton({ size = "md" }: Props) {
  const { connector } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { setWallet } = useAppStore();

  const handleClick = async () => {
    if (connector) {
      disconnect();
      setWallet({ connected: false, address: null });
      return;
    }

    const first = connectors[0];
    if (!first) return;

    connect({ connector: first });
  };

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 text-slate-950 font-medium shadow-[0_14px_40px_rgba(8,47,73,0.8)] transition hover:-translate-y-0.5 hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";

  const padding = size === "sm" ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm";

  return (
    <button type="button" className={`${base} ${padding}`} onClick={handleClick}>
      <Wallet className="h-4 w-4" />
      {connector ? (isPending ? "Connecting..." : "Disconnect wallet") : "Connect wallet"}
    </button>
  );
}

