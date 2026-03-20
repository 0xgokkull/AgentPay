import { executeAgentPrompt, type AgentMessage } from "../groqClient";
import { executeContractFunction } from "../contracts/contractExecutor";

const SYSTEM_PROMPT = `You are an AI agent specialized in managing payments and financial transactions on the AgentPay platform. 

You have access to the following smart contracts:
1. **AgentRegistry** - Manages AI agent identity NFTs
   - mintAgent(to): Register a new AI agent

2. **SplitPayRouter** - Routes payments with automatic splits
   - pay(service): Execute payment with 70/20/10 split (service/treasury/yield)
   - setTreasury(address): Set treasury address
   - setYieldRecipient(address): Set yield recipient
   - setReceiptNFT(address): Set receipt NFT contract
   - pause(): Pause the router
   - unpause(): Unpause the router

3. **AgentVault** - Treasury vault for agent funds
   - deposit(assets, receiver): Deposit funds
   - withdraw(shares, receiver, owner): Withdraw funds
   - totalAssets(): Get total assets

4. **ReceiptNFT** - Payment receipt NFTs
   - setMinter(address): Set the minter address

5. **WrappedNative** - Wrapped native token
   - deposit(): Deposit native tokens
   - withdraw(amount): Withdraw native tokens

Required Parameter Names (Keys) for CALL_FUNCTION:
- AgentRegistry.mintAgent: {"to": address}
- SplitPayRouter.pay: {"service": address, "amount": value}
- SplitPayRouter.setTreasury: {"treasury": address}
- SplitPayRouter.setYieldRecipient: {"recipient": address}
- SplitPayRouter.setReceiptNFT: {"receiptNFT": address}
- AgentVault.deposit: {"assets": amount, "receiver": address}
- AgentVault.withdraw: {"shares": amount, "receiver": address, "owner": address}
- ReceiptNFT.setMinter: {"minter": address}
- WrappedNative.deposit: (no params)
- WrappedNative.withdraw: {"amount": value}

When the user asks you to perform an action, analyze the request and respond with the appropriate function calls using this format:
CALL_FUNCTION(ContractName.functionName, {"param1": value1, "param2": value2})

IMPORTANT: All addresses MUST be valid 40-character hexadecimal strings starting with "0x". NEVER use placeholders like "0x1234567890abcdef" or "0x ReceiptNFTContractAddress". If an address is unknown, ask the user for it instead of guessing.`;

export class AgentPaymentAgent {
  private conversationHistory: AgentMessage[] = [];

  async executeCommand(userCommand: string): Promise<{
    response: string;
    executedActions: Array<{
      contract: string;
      function: string;
      params: Record<string, unknown>;
      result: unknown;
    }>;
  }> {
    const agentResponse = await executeAgentPrompt(
      SYSTEM_PROMPT,
      userCommand,
      this.conversationHistory
    );

    this.conversationHistory.push(
      { role: "user", content: userCommand },
      { role: "assistant", content: agentResponse.content }
    );

    const executedActions = [];

    if (agentResponse.functionCalls && agentResponse.functionCalls.length > 0) {
      for (const call of agentResponse.functionCalls) {
        const [contractName, functionName] = call.function.split(".");

        if (contractName && functionName) {
          const result = await executeContractFunction(
            contractName,
            functionName,
            call.params
          );

          executedActions.push({
            contract: contractName,
            function: functionName,
            params: call.params,
            result: result.result || result.error,
            transactionHash: result.transactionHash,
          });
        }
      }
    }

    return {
      response: agentResponse.content,
      executedActions,
    };
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

export class AgentRegistrationAgent {
  private conversationHistory: AgentMessage[] = [];

  async registerAgent(agentAddress: string): Promise<{
    response: string;
    tokenId?: number;
    transactionHash?: string;
  }> {
    const command = `Register a new AI agent at address ${agentAddress} using AgentRegistry.mintAgent.`;

    if (!/^0x[a-fA-F0-9]{40}$/.test(agentAddress)) {
      const response = "Registration failed: invalid address format. Expected a 0x-prefixed 40-hex-character address.";
      this.conversationHistory.push(
        { role: "user", content: command },
        { role: "assistant", content: response }
      );
      return { response };
    }

    let tokenId: number | undefined;

    const result = await executeContractFunction(
      "AgentRegistry",
      "mintAgent",
      { to: agentAddress }
    );

    if (result.result && typeof result.result === "object" && "tokenId" in result.result) {
      const id = (result.result as { tokenId?: unknown }).tokenId;
      if (typeof id === "number") {
        tokenId = id;
      }
      if (typeof id === "string" && /^\d+$/.test(id)) {
        const parsed = Number(id);
        if (Number.isSafeInteger(parsed)) {
          tokenId = parsed;
        }
      }
    }

    const response = result.success
      ? tokenId !== undefined
        ? `Agent registered successfully via AgentRegistry.mintAgent. Token ID: ${tokenId}.`
        : "Agent registered successfully via AgentRegistry.mintAgent."
      : `Registration failed: ${result.error ?? "unknown error"}`;

    this.conversationHistory.push(
      { role: "user", content: command },
      { role: "assistant", content: response }
    );

    return {
      response,
      tokenId,
      transactionHash: result.transactionHash,
    };
  }
}

export class TreasuryManagementAgent {
  private conversationHistory: AgentMessage[] = [];

  async manageTreasury(instruction: string): Promise<{
    response: string;
    executedActions: Array<{
      contract: string;
      function: string;
      params: Record<string, unknown>;
      result: unknown;
    }>;
  }> {
    const systemPrompt = `You are a treasury management AI agent. Your role is to manage the AgentPay treasury and vault operations.

Available operations:
- deposit(assets, receiver): Deposit funds into the vault (params: "assets", "receiver")
- withdraw(shares, receiver, owner): Withdraw funds from the vault (params: "shares", "receiver", "owner")
- setTreasury(address): Update treasury address (param: "treasury")
- setYieldRecipient(address): Update yield recipient (param: "recipient")
- totalAssets(): Check vault balance (no params)

IMPORTANT: All addresses MUST be valid 40-character hexadecimal strings starting with "0x". NEVER use shortened placeholders or dummy strings. If you don't have a valid address for a required parameter, stop and ask the user to provide one.

Respond with function calls when needed using: CALL_FUNCTION(ContractName.functionName, {params})`;

    const agentResponse = await executeAgentPrompt(
      systemPrompt,
      instruction,
      this.conversationHistory
    );

    this.conversationHistory.push(
      { role: "user", content: instruction },
      { role: "assistant", content: agentResponse.content }
    );

    const executedActions = [];

    if (agentResponse.functionCalls && agentResponse.functionCalls.length > 0) {
      for (const call of agentResponse.functionCalls) {
        const [contractName, functionName] = call.function.split(".");

        if (contractName && functionName) {
          const result = await executeContractFunction(
            contractName,
            functionName,
            call.params
          );

          executedActions.push({
            contract: contractName,
            function: functionName,
            params: call.params,
            result: result.result || result.error,
            transactionHash: result.transactionHash,
          });
        }
      }
    }

    return {
      response: agentResponse.content,
      executedActions,
    };
  }
}
