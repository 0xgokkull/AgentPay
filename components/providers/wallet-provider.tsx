"use client";

import * as React from "react";
import { useAppStore } from "@/state/useAppStore";

type WalletProviderProps = {
  children: React.ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  const setWallet = useAppStore((s) => s.setWallet);

  React.useEffect(() => {
    // Placeholder for real Polkadot wallet integration.
    // For now we stay disconnected until user connects on the Connect page.
    setWallet({ connected: false });
  }, [setWallet]);

  return children;
}

