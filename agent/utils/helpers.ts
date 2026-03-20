import { AgentMessage } from "../groqClient";

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidAmount(amount: string | number): boolean {
  try {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return num > 0;
  } catch {
    return false;
  }
}

export function formatAmount(amount: bigint | number, decimals = 18): string {
  const divisor = BigInt(10) ** BigInt(decimals);
  const bigAmount = typeof amount === "bigint" ? amount : BigInt(amount);
  const whole = bigAmount / divisor;
  const fraction = ((bigAmount % divisor) * BigInt(1000)) / divisor;
  return `${whole}.${fraction.toString().padStart(3, "0")}`;
}

export function parseAmount(amount: string | number, decimals = 18): bigint {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return BigInt(Math.floor(num * Math.pow(10, decimals)));
}

export function shortenAddress(address: string): string {
  if (!isValidAddress(address)) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function createLogMessage(
  level: "INFO" | "SUCCESS" | "ERROR" | "WARNING",
  message: string,
  context?: Record<string, unknown>
): string {
  const timestamp = new Date().toISOString();
  const levelEmoji: Record<string, string> = {
    INFO: "ℹ️",
    SUCCESS: "✅",
    ERROR: "❌",
    WARNING: "⚠️",
  };

  const contextStr = context ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] ${levelEmoji[level]} ${message}${contextStr}`;
}

export function formatConversationHistory(history: AgentMessage[]): string {
  return history
    .map((msg) => {
      const role = msg.role.charAt(0).toUpperCase() + msg.role.slice(1);
      return `${role}: ${msg.content}`;
    })
    .join("\n");
}

export function extractParameters(text: string): Record<string, unknown> {
  const params: Record<string, unknown> = {};

  const addressPattern = /0x[a-fA-F0-9]{40}/g;
  const addresses = text.match(addressPattern);
  if (addresses) {
    params.addresses = addresses;
  }

  const numberPattern = /\d+(\.\d+)?/g;
  const numbers = text.match(numberPattern);
  if (numbers) {
    params.amounts = numbers.map((n) => parseFloat(n));
  }

  const contractPattern = /(AgentRegistry|AgentVault|SplitPayRouter|ReceiptNFT|WrappedNative)/g;
  const contracts = text.match(contractPattern);
  if (contracts) {
    params.contracts = [...new Set(contracts)];
  }

  const functionPattern = /([a-zA-Z]+)\s*\(/g;
  const functions = text.match(functionPattern);
  if (functions) {
    params.functions = functions.map((f) => f.replace(/\s*\($/, ""));
  }

  return params;
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000
): Promise<T> {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await wait(delayMs * attempt);
      }
    }
  }

  throw lastError;
}

export function formatExecutionResult(
  success: boolean,
  result?: unknown,
  error?: string
): string {
  if (success) {
    return `✅ Success: ${JSON.stringify(result, null, 2)}`;
  } else {
    return `❌ Failed: ${error}`;
  }
}
