import { create } from "zustand";

export type WalletState = {
  address: string | null;
  network: string | null;
  connected: boolean;
};

export type AgentState = {
  id: string | null;
  name: string | null;
  status: "idle" | "active" | "paused";
};

export type VaultState = {
  balance: number;
  currency: string;
  yieldApr: number;
};

type AppState = {
  wallet: WalletState;
  agent: AgentState;
  vault: VaultState;
  setWallet: (wallet: Partial<WalletState>) => void;
  setAgent: (agent: Partial<AgentState>) => void;
  setVault: (vault: Partial<VaultState>) => void;
  reset: () => void;
};

const initialState: Omit<AppState, "setWallet" | "setAgent" | "setVault" | "reset"> = {
  wallet: {
    address: null,
    network: null,
    connected: false,
  },
  agent: {
    id: null,
    name: null,
    status: "idle",
  },
  vault: {
    balance: 0,
    currency: "DOT",
    yieldApr: 4.2,
  },
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  setWallet: (wallet) =>
    set((state) => ({
      wallet: { ...state.wallet, ...wallet },
    })),
  setAgent: (agent) =>
    set((state) => ({
      agent: { ...state.agent, ...agent },
    })),
  setVault: (vault) =>
    set((state) => ({
      vault: { ...state.vault, ...vault },
    })),
  reset: () => set(initialState),
}));

