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
  agentRunning: boolean;
  vaultRunning: boolean;
  setWallet: (wallet: Partial<WalletState>) => void;
  setAgent: (agent: Partial<AgentState>) => void;
  setVault: (vault: Partial<VaultState>) => void;
  setAgentRunning: (v: boolean) => void;
  setVaultRunning: (v: boolean) => void;
  reset: () => void;
};

const initialState: Omit<
  AppState,
  | "setWallet"
  | "setAgent"
  | "setVault"
  | "setAgentRunning"
  | "setVaultRunning"
  | "reset"
> = {
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
  agentRunning: false,
  vaultRunning: false,
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
  setAgentRunning: (v: boolean) =>
    set((state) => ({ ...state, agentRunning: v })),
  setVaultRunning: (v: boolean) =>
    set((state) => ({ ...state, vaultRunning: v })),
  reset: () => set(initialState),
}));
