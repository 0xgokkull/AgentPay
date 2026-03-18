"use client";

import { Wallet } from "lucide-react";
import { useAppStore } from "@/state/useAppStore";
import { useAccount, useConnect, useDisconnect } from "wagmi";

type Props = {
  size?: "sm" | "md";
  className?: string;
};

export function ConnectWalletButton({ size = "md", className = "" }: Props) {
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
    "inline-flex items-center justify-center gap-2 bg-cyan-400 text-slate-950 font-semibold shadow-lg shadow-cyan-500/15 transition hover:bg-cyan-300 hover:shadow-cyan-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

  const padding =
    size === "sm"
      ? "rounded-full px-4 py-2 text-xs"
      : "min-h-[3rem] rounded-xl px-8 text-sm";

  return (
    <button
      type="button"
      className={`${base} ${padding} ${className}`.trim()}
      onClick={handleClick}
    >
      <Wallet className="h-4 w-4" />
      {connector ? (isPending ? "Connecting..." : "Disconnect wallet") : "Connect wallet"}
    </button>
  );
}

