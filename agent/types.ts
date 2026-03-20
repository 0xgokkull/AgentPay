/**
 * Agent System Types and Interfaces
 */

export interface ContractFunctionCall {
  contract: string;
  function: string;
  params: Record<string, unknown>;
}

export interface AgentExecutionResult {
  success: boolean;
  response: string;
  executedActions: Array<{
    contract: string;
    function: string;
    params: Record<string, unknown>;
    result: unknown;
  }>;
  error?: string;
}

export interface ContractABI {
  name: string;
  functions: Array<{
    name: string;
    inputs: Array<{
      name: string;
      type: string;
    }>;
    outputs?: Array<{
      type: string;
    }>;
    stateMutability: string;
  }>;
}

export interface AgentState {
  conversationHistory: Array<{
    role: string;
    content: string;
  }>;
  executedFunctions: ContractFunctionCall[];
  lastExecution?: Date;
}

export interface PaymentSplit {
  total: bigint;
  serviceShare: bigint;
  treasuryShare: bigint;
  yieldShare: bigint;
}

export interface Receipt {
  payer: string;
  service: string;
  amount: bigint;
  timestamp: number;
  tokenId: number;
}
