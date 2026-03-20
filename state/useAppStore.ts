import { create } from "zustand";

export const EXPLORER_URL = "https://blockscout-testnet.polkadot.io/tx/";

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

export type AgentType = "payment" | "registration" | "treasury";

export type ExecutedAction = {
  contract: string;
  function: string;
  params: Record<string, unknown>;
  result: unknown;
  transactionHash?: string;
};

export type ApiResult = {
  ok: boolean;
  agentType: AgentType;
  response: string;
  executedActions: ExecutedAction[];
  logs: string[];
  error?: string;
};

export type ExecutionState = {
  status: "idle" | "running" | "success" | "error";
  agentType: AgentType | null;
  result: ApiResult | null;
  error: string | null;
};

type AppState = {
  wallet: WalletState;
  agent: AgentState;
  vault: VaultState;
  execution: ExecutionState;
  setWallet: (wallet: Partial<WalletState>) => void;
  setAgent: (agent: Partial<AgentState>) => void;
  setVault: (vault: Partial<VaultState>) => void;
  setExecution: (execution: Partial<ExecutionState>) => void;
  startExecution: (agentType: AgentType) => void;
  finishExecution: (result: ApiResult) => void;
  failExecution: (error: string) => void;
  resetExecution: () => void;
  reset: () => void;
};

const initialState: Omit<AppState, "setWallet" | "setAgent" | "setVault" | "setExecution" | "startExecution" | "finishExecution" | "failExecution" | "resetExecution" | "reset"> = {
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
  execution: {
    status: "idle",
    agentType: null,
    result: null,
    error: null,
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
  setExecution: (execution) =>
    set((state) => ({
      execution: { ...state.execution, ...execution },
    })),
  startExecution: (agentType) =>
    set({
      execution: {
        status: "running",
        agentType,
        result: null,
        error: null,
      },
    }),
  finishExecution: (result) =>
    set({
      execution: {
        status: "success",
        agentType: result.agentType,
        result,
        error: null,
      },
    }),
  failExecution: (error) =>
    set((state) => ({
      execution: {
        ...state.execution,
        status: "error",
        error,
      },
    })),
  resetExecution: () =>
    set({
      execution: initialState.execution,
    }),
  reset: () => set(initialState),
}));
