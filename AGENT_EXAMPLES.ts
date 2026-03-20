/**
 * AgentPay AI Agents - Quick Start Guide
 * 
 * This file provides quick examples for using the agent system.
 */

import {
  AgentPaymentAgent,
  AgentRegistrationAgent,
  TreasuryManagementAgent,
} from "./agent/agents/agentPaymentAgent";

export async function quickStartExamples() {
  // ============= Example 1: Register an Agent =============
  console.log("Example 1: Register a new AI Agent\n");

  const registrationAgent = new AgentRegistrationAgent();
  const newAgentAddress = "0x1111111111111111111111111111111111111111";

  const registrationResult = await registrationAgent.registerAgent(
    newAgentAddress
  );

  console.log("Registration Response:", registrationResult.response);
  console.log("Token ID:", registrationResult.tokenId);
  console.log("---\n");

  // ============= Example 2: Execute a Payment =============
  console.log("Example 2: Execute a payment transaction\n");

  const paymentAgent = new AgentPaymentAgent();

  const paymentCommand =
    "Process a payment of 500 tokens to service provider 0x2222222222222222222222222222222222222222 using the SplitPayRouter";

  const paymentResult = await paymentAgent.executeCommand(paymentCommand);

  console.log("Payment Response:", paymentResult.response);
  console.log("Executed Actions:", paymentResult.executedActions);
  console.log("---\n");

  // ============= Example 3: Manage Treasury =============
  console.log("Example 3: Manage treasury and vault\n");

  const treasuryAgent = new TreasuryManagementAgent();

  const treasuryCommand =
    "Deposit 1000 NATIVE tokens into the AgentVault for address 0x3333333333333333333333333333333333333333";

  const treasuryResult = await treasuryAgent.manageTreasury(treasuryCommand);

  console.log("Treasury Response:", treasuryResult.response);
  console.log("Executed Actions:", treasuryResult.executedActions);
  console.log("---\n");

  // ============= Example 4: Complex Multi-step Transaction =============
  console.log(
    "Example 4: Complex multi-step transaction (agents track context)\n"
  );

  const complexAgent = new AgentPaymentAgent();

  // First command
  const step1 = await complexAgent.executeCommand(
    "I want to set up a new payment route. First, update the treasury address to 0x4444444444444444444444444444444444444444."
  );

  console.log("Step 1 Response:", step1.response);
  console.log("Step 1 Actions:", step1.executedActions);

  // Second command (agent remembers context)
  const step2 = await complexAgent.executeCommand(
    "Now set the yield recipient to 0x5555555555555555555555555555555555555555."
  );

  console.log("Step 2 Response:", step2.response);
  console.log("Step 2 Actions:", step2.executedActions);
  console.log("---\n");

  // ============= Example 5: Query Information =============
  console.log("Example 5: Query vault information\n");

  const infoAgent = new TreasuryManagementAgent();

  const infoCommand = "Check the total assets in the AgentVault.";

  const infoResult = await infoAgent.manageTreasury(infoCommand);

  console.log("Info Response:", infoResult.response);
  console.log("---\n");
}

/**
 * Natural Language Command Examples:
 *
 * Payment Agent:
 * - "Execute a 1000 token payment to 0x..."
 * - "Pause the payment router"
 * - "Set treasury to 0x..."
 * - "Configure yield recipient to 0x..."
 * - "Mint receipt for payment to 0x..."
 *
 * Registration Agent:
 * - "Register new AI agent at 0x..."
 * - "Mint identity NFT for agent 0x..."
 *
 * Treasury Agent:
 * - "Deposit 100 tokens for 0x..."
 * - "Check vault balance"
 * - "Withdraw 50 shares"
 * - "Update treasury settings"
 *
 * The AI automatically understands context and converts natural language
 * commands into smart contract function calls!
 */
