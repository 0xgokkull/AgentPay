"use client";

import * as React from "react";
import { ThemeProvider } from "./theme-provider";
import { ReactQueryProvider } from "./query-provider";
import { WalletProvider } from "./wallet-provider";
import { WagmiRootProvider } from "./wagmi-provider";

type RootProvidersProps = {
  children: React.ReactNode;
};

export function RootProviders({ children }: RootProvidersProps) {
  return (
    <ThemeProvider>
      <WagmiRootProvider>
        <ReactQueryProvider>
          <WalletProvider>{children}</WalletProvider>
        </ReactQueryProvider>
      </WagmiRootProvider>
    </ThemeProvider>
  );
}

