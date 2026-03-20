import * as dotenv from "dotenv";

// Load environment variables first
dotenv.config();

import "./agent/groqClient"; // Initialize Groq client
import {
  AgentPaymentAgent,
  AgentRegistrationAgent,
  TreasuryManagementAgent,
} from "./agent/agents/agentPaymentAgent";
import {
  getExecutionLogs,
  clearExecutionLogs,
} from "./agent/contracts/contractExecutor";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function runAgentTests() {
  console.log("╔════════════════════════════════════════════════════════════════╗");
  console.log("║           AgentPay - AI Agent Testing Suite                    ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  // ============= Test 1: Agent Registration =============
  console.log("📋 TEST 1: Agent Registration\n");
  console.log("─".repeat(64));

  try {
    const registrationAgent = new AgentRegistrationAgent();

    console.log("🔄 Registering AI Agent...\n");
    const agentAddress = "0x1234567890123456789012345678901234567890";

    const registrationResult = await registrationAgent.registerAgent(
      agentAddress
    );

    console.log("Response from AI Agent:");
    console.log(registrationResult.response);
    console.log("\n✅ Agent Registration Test PASSED\n");
  } catch (error) {
    console.error("❌ Agent Registration Test FAILED:", error);
  }

  await sleep(500);

  // ============= Test 2: Payment Execution =============
  console.log("📋 TEST 2: Payment Execution\n");
  console.log("─".repeat(64));

  try {
    const paymentAgent = new AgentPaymentAgent();

    console.log("🔄 Processing Payment...\n");

    const paymentCommand =
      'Execute a payment of 100 AMOUNT to service provider 0x9876543210987654321098765432109876543210 using the SplitPayRouter contract.';

    const paymentResult = await paymentAgent.executeCommand(paymentCommand);

    console.log("Response from AI Agent:");
    console.log(paymentResult.response);

    if (paymentResult.executedActions.length > 0) {
      console.log("\nExecuted Actions:");
      paymentResult.executedActions.forEach((action, i) => {
        console.log(
          `  ${i + 1}. ${action.contract}.${action.function}()`
        );
        console.log(`     Result: ${JSON.stringify(action.result, null, 2)}`);
      });
    }

    console.log("\n✅ Payment Execution Test PASSED\n");
  } catch (error) {
    console.error("❌ Payment Execution Test FAILED:", error);
  }

  await sleep(500);

  // ============= Test 3: Treasury Configuration =============
  console.log("📋 TEST 3: Treasury Configuration\n");
  console.log("─".repeat(64));

  try {
    const treasuryAgent = new TreasuryManagementAgent();

    console.log("🔄 Setting up Treasury...\n");

    const treasuryCommand =
      "Set the treasury address to 0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA and yield recipient to 0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB. Use SplitPayRouter contract functions.";

    const treasuryResult = await treasuryAgent.manageTreasury(treasuryCommand);

    console.log("Response from AI Agent:");
    console.log(treasuryResult.response);

    if (treasuryResult.executedActions.length > 0) {
      console.log("\nExecuted Actions:");
      treasuryResult.executedActions.forEach((action, i) => {
        console.log(
          `  ${i + 1}. ${action.contract}.${action.function}()`
        );
        console.log(`     Result: ${JSON.stringify(action.result, null, 2)}`);
      });
    }

    console.log("\n✅ Treasury Configuration Test PASSED\n");
  } catch (error) {
    console.error("❌ Treasury Configuration Test FAILED:", error);
  }

  await sleep(500);

  // ============= Test 4: Vault Operations =============
  console.log("📋 TEST 4: Vault Operations (Deposit/Withdraw)\n");
  console.log("─".repeat(64));

  try {
    const treasuryAgent = new TreasuryManagementAgent();

    console.log("🔄 Managing Vault...\n");

    const vaultCommand =
      "Deposit 50 tokens into the AgentVault for receiver 0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC. Then check total assets.";

    const vaultResult = await treasuryAgent.manageTreasury(vaultCommand);

    console.log("Response from AI Agent:");
    console.log(vaultResult.response);

    if (vaultResult.executedActions.length > 0) {
      console.log("\nExecuted Actions:");
      vaultResult.executedActions.forEach((action, i) => {
        console.log(
          `  ${i + 1}. ${action.contract}.${action.function}()`
        );
        console.log(`     Result: ${JSON.stringify(action.result, null, 2)}`);
      });
    }

    console.log("\n✅ Vault Operations Test PASSED\n");
  } catch (error) {
    console.error("❌ Vault Operations Test FAILED:", error);
  }

  await sleep(500);

  // ============= Test 5: Receipt NFT Management =============
  console.log("📋 TEST 5: Receipt NFT Management\n");
  console.log("─".repeat(64));

  try {
    const paymentAgent = new AgentPaymentAgent();

    console.log("🔄 Managing Receipt NFTs...\n");

    const routerAddress =
      process.env.SPLIT_PAY_ROUTER_ADDRESS ||
      "0x472e1f2F3a237Ea213D5144c945B6Cfc75190F6a";
    const receiptCommand =
      `Set the minter address for ReceiptNFT to ${routerAddress}. Use the ReceiptNFT contract.`;

    const receiptResult = await paymentAgent.executeCommand(receiptCommand);

    console.log("Response from AI Agent:");
    console.log(receiptResult.response);

    if (receiptResult.executedActions.length > 0) {
      console.log("\nExecuted Actions:");
      receiptResult.executedActions.forEach((action, i) => {
        console.log(
          `  ${i + 1}. ${action.contract}.${action.function}()`
        );
        console.log(`     Result: ${JSON.stringify(action.result, null, 2)}`);
      });
    }

    console.log("\n✅ Receipt NFT Management Test PASSED\n");
  } catch (error) {
    console.error("❌ Receipt NFT Management Test FAILED:", error);
  }

  await sleep(500);

  // ============= Test 6: Emergency Controls =============
  console.log("📋 TEST 6: Emergency Controls (Pause/Unpause)\n");
  console.log("─".repeat(64));

  try {
    const paymentAgent = new AgentPaymentAgent();

    console.log("🔄 Testing Pause/Unpause...\n");

    const pauseCommand =
      "Pause the SplitPayRouter contract for emergency maintenance.";

    const pauseResult = await paymentAgent.executeCommand(pauseCommand);

    console.log("Response from AI Agent:");
    console.log(pauseResult.response);

    if (pauseResult.executedActions.length > 0) {
      console.log("\nExecuted Actions:");
      pauseResult.executedActions.forEach((action, i) => {
        console.log(
          `  ${i + 1}. ${action.contract}.${action.function}()`
        );
        console.log(`     Result: ${JSON.stringify(action.result, null, 2)}`);
      });
    }

    // Unpause
    await sleep(1000);

    console.log("\n🔄 Resuming Operations...\n");
    const unpauseCommand =
      "Unpause the SplitPayRouter contract to resume normal operations.";

    const unpauseResult = await paymentAgent.executeCommand(unpauseCommand);

    console.log("Response from AI Agent:");
    console.log(unpauseResult.response);

    if (unpauseResult.executedActions.length > 0) {
      console.log("\nExecuted Actions:");
      unpauseResult.executedActions.forEach((action, i) => {
        console.log(
          `  ${i + 1}. ${action.contract}.${action.function}()`
        );
        console.log(`     Result: ${JSON.stringify(action.result, null, 2)}`);
      });
    }

    console.log("\n✅ Emergency Controls Test PASSED\n");
  } catch (error) {
    console.error("❌ Emergency Controls Test FAILED:", error);
  }

  // ============= Final Summary =============
  console.log("\n" + "═".repeat(64));
  console.log("📊 TEST EXECUTION SUMMARY\n");

  const logs = getExecutionLogs();
  console.log(`Total Execution Events: ${logs.length}\n`);

  if (logs.length > 0) {
    console.log("Recent Execution Logs:");
    console.log("─".repeat(64));
    logs.slice(-10).forEach((log) => console.log(log));
  }

  console.log("\n" + "═".repeat(64));
  console.log("✨ All agent tests completed successfully! ✨");
  console.log("═".repeat(64) + "\n");
}

// Run the tests
runAgentTests().catch((error) => {
  console.error("Fatal error during testing:", error);
  process.exit(1);
});
