"use client";

import * as React from "react";
import { useAppStore } from "@/state/useAppStore";
import { useAccount, useChainId } from "wagmi";

type WalletProviderProps = {
  children: React.ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  const setWallet = useAppStore((s) => s.setWallet);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  React.useEffect(() => {
    setWallet({
      connected: isConnected,
      address: address ?? null,
      network: isConnected ? String(chainId) : null,
    });
  }, [address, chainId, isConnected, setWallet]);

  return children;
}
