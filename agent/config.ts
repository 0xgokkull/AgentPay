/**
 * Agent System Configuration
 * 
 * This configuration file contains settings for the AgentPay AI agent system.
 */

export const AGENT_CONFIG = {
  // Groq API Configuration
  groq: {
     model: "gemma-7b-it",
    temperature: 1,
    maxTokens: 1024,
  },

  // Contract Configuration
  contracts: {
    WRAPPED_NATIVE: "0x7832bf2C0EdeDc97C072D5e1F667c22838B06671",
    AGENT_REGISTRY: "0x75cB78a83008D3Ac23aF6545E12d53776fe1e3fF",
    AGENT_VAULT: "0xc3409d7b5Ae1eAf88C676Ec69cb36E2e448CE5ee",
    SPLIT_PAY_ROUTER: "0x39F81a420F2B8E461812566Ef70327Cd508c85f7",
    RECEIPT_NFT: "0x932Ec73B37735d6e62d5926a463dC67657413d63",
  },

  // Agent Types
  agents: {
    PAYMENT: "AgentPaymentAgent",
    REGISTRATION: "AgentRegistrationAgent",
    TREASURY: "TreasuryManagementAgent",
  },

  // Debug mode
  debug: process.env.DEBUG === "true",
};

// Payment split percentages
export const PAYMENT_SPLIT = {
  SERVICE_BPS: 7000, // 70%
  TREASURY_BPS: 1000, // 10%
  YIELD_BPS: 2000, // 20%
  BPS_DENOMINATOR: 10000,
};
