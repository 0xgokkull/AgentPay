import * as dotenv from "dotenv";

dotenv.config();
process.env.AGENT_FORCE_LOCAL = "true";

import {
  AgentPaymentAgent,
  AgentRegistrationAgent,
  TreasuryManagementAgent,
} from "./agent/agents/agentPaymentAgent";
import {
  clearExecutionLogs,
  getExecutionLogs,
  executeContractFunction,
} from "./agent/contracts/contractExecutor";

type TestResult = {
  name: string;
  passed: boolean;
  details: string;
};

async function runFiveContractsCoverageTest() {
  clearExecutionLogs();
  const results: TestResult[] = [];

  const registrationAgent = new AgentRegistrationAgent();
  const paymentAgent = new AgentPaymentAgent();
  const treasuryAgent = new TreasuryManagementAgent();

  // 1) AgentRegistry
  const register = await registrationAgent.registerAgent(
    "0x1111111111111111111111111111111111111111"
  );
  results.push({
    name: "AgentRegistry.mintAgent via AgentRegistrationAgent",
    passed: typeof register.tokenId === "number",
    details: `tokenId=${String(register.tokenId)}`,
  });

  // 2) SplitPayRouter
  const payment = await paymentAgent.executeCommand(
    "Pay 1000000000000000000 to service 0x2222222222222222222222222222222222222222 using SplitPayRouter"
  );
  const hasSplitPay = payment.executedActions.some(
    (a) => a.contract === "SplitPayRouter" && a.function === "pay"
  );
  results.push({
    name: "SplitPayRouter.pay via AgentPaymentAgent",
    passed: hasSplitPay,
    details: `actions=${payment.executedActions.length}`,
  });

  // 3) AgentVault
  const treasury = await treasuryAgent.manageTreasury(
    "Deposit into vault deposit 500000000000000000 for 0x3333333333333333333333333333333333333333 and check total assets"
  );
  const hasVaultDeposit = treasury.executedActions.some(
    (a) => a.contract === "AgentVault" && a.function === "deposit"
  );
  const hasVaultTotalAssets = treasury.executedActions.some(
    (a) => a.contract === "AgentVault" && a.function === "totalAssets"
  );
  results.push({
    name: "AgentVault.deposit via TreasuryManagementAgent",
    passed: hasVaultDeposit,
    details: `actions=${treasury.executedActions.length}`,
  });
  results.push({
    name: "AgentVault.totalAssets via TreasuryManagementAgent",
    passed: hasVaultTotalAssets,
    details: `actions=${treasury.executedActions.length}`,
  });

  // 4) ReceiptNFT
  const receipt = await paymentAgent.executeCommand(
    "Set minter 0x39F81a420F2B8E461812566Ef70327Cd508c85f7 in receipt minter"
  );
  const hasReceipt = receipt.executedActions.some(
    (a) => a.contract === "ReceiptNFT" && a.function === "setMinter"
  );
  results.push({
    name: "ReceiptNFT.setMinter via AgentPaymentAgent",
    passed: hasReceipt,
    details: `actions=${receipt.executedActions.length}`,
  });

  // 5) WrappedNative
  const wrap = await paymentAgent.executeCommand(
    "Wrap 100000000000000000 and then unwrap 50000000000000000"
  );
  const hasWrapDeposit = wrap.executedActions.some(
    (a) => a.contract === "WrappedNative" && a.function === "deposit"
  );
  const hasWrapWithdraw = wrap.executedActions.some(
    (a) => a.contract === "WrappedNative" && a.function === "withdraw"
  );
  results.push({
    name: "WrappedNative.deposit via AgentPaymentAgent",
    passed: hasWrapDeposit,
    details: `actions=${wrap.executedActions.length}`,
  });
  results.push({
    name: "WrappedNative.withdraw via AgentPaymentAgent",
    passed: hasWrapWithdraw,
    details: `actions=${wrap.executedActions.length}`,
  });

  // Confirm logs include all 5 contracts.
  const logs = getExecutionLogs();
  const expectedContracts = [
    "AgentRegistry",
    "SplitPayRouter",
    "AgentVault",
    "ReceiptNFT",
    "WrappedNative",
  ];

  const coverage = expectedContracts.map((c) => ({
    contract: c,
    seen: logs.some((line) => line.includes(`Executing ${c}.`)),
  }));

  coverage.forEach((entry) => {
    results.push({
      name: `Coverage log for ${entry.contract}`,
      passed: entry.seen,
      details: entry.seen ? "seen" : "missing",
    });
  });

  // Validate each simulated execution path returns success directly.
  const directChecks = await Promise.all([
    executeContractFunction("AgentRegistry", "mintAgent", {
      to: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    }),
    executeContractFunction("SplitPayRouter", "pay", {
      service: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      amount: "1000000000000000000",
    }),
    executeContractFunction("AgentVault", "totalAssets", {}),
    executeContractFunction("ReceiptNFT", "setMinter", {
      _minter: "0xcccccccccccccccccccccccccccccccccccccccc",
    }),
    executeContractFunction("WrappedNative", "deposit", {
      amount: "250000000000000000",
    }),
  ]);

  directChecks.forEach((check, index) => {
    const names = [
      "Direct AgentRegistry",
      "Direct SplitPayRouter",
      "Direct AgentVault",
      "Direct ReceiptNFT",
      "Direct WrappedNative",
    ];
    results.push({
      name: `${names[index]} success`,
      passed: check.success,
      details: check.success ? "ok" : String(check.error),
    });
  });

  const failed = results.filter((r) => !r.passed);

  console.log("\n=== AGENT FIVE-CONTRACT COVERAGE TEST ===\n");
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.passed ? "PASS" : "FAIL"} - ${r.name} (${r.details})`);
  });

  const finalLogs = getExecutionLogs();
  console.log("\n=== EXECUTION LOG COUNT ===");
  console.log(finalLogs.length);

  console.log("\n=== SAMPLE EXECUTION LOGS ===");
  finalLogs.slice(0, 10).forEach((l) => console.log(l));

  if (failed.length > 0) {
    throw new Error(`Coverage test failed with ${failed.length} failing checks.`);
  }

  console.log("\nALL CHECKS PASSED: Agent called all 5 contracts successfully with test data.");
}

runFiveContractsCoverageTest().catch((err) => {
  console.error("\nTEST FAILED:", err);
  process.exit(1);
});
