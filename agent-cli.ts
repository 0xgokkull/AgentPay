#!/usr/bin/env ts-node

/**
 * AgentPay AI Agent CLI
 * 
 * Interactive command-line interface for the AgentPay AI agent system.
 * 
 * Usage: npx ts-node agent-cli.ts
 */

import * as readline from "readline";
import {
  AgentPaymentAgent,
  AgentRegistrationAgent,
  TreasuryManagementAgent,
} from "./agent/agents/agentPaymentAgent";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function runCLI() {
  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║           AgentPay AI Agent - Interactive CLI                   ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  console.log("Available Commands:");
  console.log("  1) Payment - Execute payments and manage payment routing");
  console.log("  2) Registry - Register AI agents");
  console.log("  3) Treasury - Manage vault and treasury");
  console.log("  4) Help - Show help information");
  console.log("  5) Exit - Close CLI\n");

  const paymentAgent = new AgentPaymentAgent();
  const registrationAgent = new AgentRegistrationAgent();
  const treasuryAgent = new TreasuryManagementAgent();

  let running = true;

  while (running) {
    const mode = await prompt(
      "Select agent (1-5): "
    );

    switch (mode.trim()) {
      case "1":
        await handlePaymentAgent(paymentAgent);
        break;

      case "2":
        await handleRegistrationAgent(registrationAgent);
        break;

      case "3":
        await handleTreasuryAgent(treasuryAgent);
        break;

      case "4":
        showHelp();
        break;

      case "5":
        running = false;
        console.log("\nGoodbye! 👋\n");
        break;

      default:
        console.log("Invalid selection. Please try again.\n");
    }
  }

  rl.close();
}

async function handlePaymentAgent(agent: AgentPaymentAgent) {
  console.log(
    "\n📊 Payment Agent - Execute payments and manage payment routing\n"
  );

  console.log("Examples:");
  console.log(
    '  "Execute a 1000 token payment to 0x9876543210987654321098765432109876543210"'
  );
  console.log(
    '  "Pause the SplitPayRouter contract for maintenance"'
  );
  console.log(
    '  "Set treasury address to 0x1111111111111111111111111111111111111111"\n'
  );

  const command = await prompt("Enter your command: ");

  if (command.toLowerCase() === "back") {
    console.log("");
    return;
  }

  try {
    console.log("\n⏳ Processing command...\n");
    const result = await agent.executeCommand(command);

    console.log("🤖 Agent Response:");
    console.log(result.response);

    if (result.executedActions.length > 0) {
      console.log("\n✅ Executed Actions:");
      result.executedActions.forEach((action, i) => {
        console.log(
          `  ${i + 1}. ${action.contract}.${action.function}()`
        );
        console.log(`     Result: ${JSON.stringify(action.result, null, 2)}`);
      });
    }

    console.log("");
  } catch (error) {
    console.error("❌ Error:", error);
    console.log("");
  }
}

async function handleRegistrationAgent(agent: AgentRegistrationAgent) {
  console.log("\n👤 Registration Agent - Register AI agents\n");

  const address = await prompt(
    "Enter agent address to register (0x...): "
  );

  if (address.toLowerCase() === "back") {
    console.log("");
    return;
  }

  try {
    console.log("\n⏳ Registering agent...\n");
    const result = await agent.registerAgent(address);

    console.log("🤖 Agent Response:");
    console.log(result.response);

    if (result.tokenId) {
      console.log(`\n✅ Token ID: ${result.tokenId}`);
    }

    console.log("");
  } catch (error) {
    console.error("❌ Error:", error);
    console.log("");
  }
}

async function handleTreasuryAgent(agent: TreasuryManagementAgent) {
  console.log(
    "\n💰 Treasury Agent - Manage vault and treasury operations\n"
  );

  console.log("Examples:");
  console.log(
    '  "Deposit 500 tokens into the vault for 0x1111111111111111111111111111111111111111"'
  );
  console.log('  "Check total assets in the vault"');
  console.log(
    '  "Withdraw 100 shares from vault for 0x2222222222222222222222222222222222222222"\n'
  );

  const command = await prompt("Enter your command: ");

  if (command.toLowerCase() === "back") {
    console.log("");
    return;
  }

  try {
    console.log("\n⏳ Processing command...\n");
    const result = await agent.manageTreasury(command);

    console.log("🤖 Agent Response:");
    console.log(result.response);

    if (result.executedActions.length > 0) {
      console.log("\n✅ Executed Actions:");
      result.executedActions.forEach((action, i) => {
        console.log(
          `  ${i + 1}. ${action.contract}.${action.function}()`
        );
        console.log(`     Result: ${JSON.stringify(action.result, null, 2)}`);
      });
    }

    console.log("");
  } catch (error) {
    console.error("❌ Error:", error);
    console.log("");
  }
}

function showHelp() {
  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║                      HELP INFORMATION                          ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  console.log("Payment Agent Commands:");
  console.log(
    "  • Execute payments: 'Pay 100 tokens to 0x...'",
    "\n  • Configure treasury: 'Set treasury to 0x...'",
    "\n  • Manage pause state: 'Pause the router' / 'Unpause the router'"
  );

  console.log("\nRegistration Agent Commands:");
  console.log("  • Register agent: Enter agent address when prompted");

  console.log("\nTreasury Agent Commands:");
  console.log(
    "  • Deposit funds: 'Deposit [amount] into vault for 0x...'",
    "\n  • Check balance: 'Check total assets'",
    "\n  • Withdraw funds: 'Withdraw [amount] from vault'"
  );

  console.log("\nSpecial Commands:");
  console.log(
    "  • 'back' - Return to main menu from any agent",
    "\n  • 'exit' - Close the application"
  );

  console.log(
    "\nNote: All commands are processed by AI and converted to smart contract calls."
  );
  console.log("The system understands natural language and context.\n");
}

// Run the CLI
runCLI().catch(console.error);
