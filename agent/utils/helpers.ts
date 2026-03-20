/**
 * Agent System Utilities
 * 
 * Helper functions for agent operations
 */

import { AgentMessage } from "./groqClient";

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate amount format
 */
export function isValidAmount(amount: string | number): boolean {
  try {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return num > 0;
  } catch {
    return false;
  }
}

/**
 * Format amount with decimals
 */
export function formatAmount(amount: bigint | number, decimals = 18): string {
  const divisor = BigInt(10) ** BigInt(decimals);
  const bigAmount = typeof amount === "bigint" ? amount : BigInt(amount);
  const whole = bigAmount / divisor;
  const fraction = ((bigAmount % divisor) * BigInt(1000)) / divisor;
  return `${whole}.${fraction.toString().padStart(3, "0")}`;
}

/**
 * Parse amount to bigint with decimals
 */
export function parseAmount(amount: string | number, decimals = 18): bigint {
  const num =
    typeof amount === "string"
      ? parseFloat(amount)
      : amount;
  return BigInt(Math.floor(num * Math.pow(10, decimals)));
}

/**
 * Shorten address for display
 */
export function shortenAddress(address: string): string {
  if (!isValidAddress(address)) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Create a standardized log message
 */
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

/**
 * Format conversation history for display
 */
export function formatConversationHistory(
  history: AgentMessage[]
): string {
  return history
    .map((msg) => {
      const role = msg.role.charAt(0).toUpperCase() + msg.role.slice(1);
      return `${role}: ${msg.content}`;
    })
    .join("\n");
}

/**
 * Extract parameters from natural language
 */
export function extractParameters(
  text: string
): Record<string, unknown> {
  const params: Record<string, unknown> = {};

  // Extract addresses
  const addressPattern = /0x[a-fA-F0-9]{40}/g;
  const addresses = text.match(addressPattern);
  if (addresses) {
    params.addresses = addresses;
  }

  // Extract numbers
  const numberPattern = /\d+(\.\d+)?/g;
  const numbers = text.match(numberPattern);
  if (numbers) {
    params.amounts = numbers.map((n) => parseFloat(n));
  }

  // Extract contract names
  const contractPattern =
    /(AgentRegistry|AgentVault|SplitPayRouter|ReceiptNFT|WrappedNative)/g;
  const contracts = text.match(contractPattern);
  if (contracts) {
    params.contracts = [...new Set(contracts)];
  }

  // Extract function-like patterns
  const functionPattern = /([a-zA-Z]+)\s*\(/g;
  const functions = text.match(functionPattern);
  if (functions) {
    params.functions = functions.map((f) => f.replace(/\s*\($/, ""));
  }

  return params;
}

/**
 * Wait for a specified duration
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function multiple times
 */
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

/**
 * Format execution result for display
 */
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
