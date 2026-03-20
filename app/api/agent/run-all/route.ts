import { NextResponse } from "next/server";
import {
  AgentPaymentAgent,
  AgentRegistrationAgent,
  TreasuryManagementAgent,
} from "@/agent/agents/agentPaymentAgent";
import {
  clearExecutionLogs,
  getExecutionLogs,
  executeContractFunction,
} from "@/agent/contracts/contractExecutor";

export const runtime = "nodejs";

function toJsonSafe<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, v) => (typeof v === "bigint" ? v.toString() : v))
  ) as T;
}

export async function POST() {
  try {
    process.env.AGENT_FORCE_LOCAL = "true";
    clearExecutionLogs();
    const routerAddress =
      process.env.SPLIT_PAY_ROUTER_ADDRESS ||
      "0x472e1f2F3a237Ea213D5144c945B6Cfc75190F6a";

    const registrationAgent = new AgentRegistrationAgent();
    const paymentAgent = new AgentPaymentAgent();
    const treasuryAgent = new TreasuryManagementAgent();

    const results: Array<{ name: string; passed: boolean; details: string }> = [];

    const reg = await registrationAgent.registerAgent(
      "0x1111111111111111111111111111111111111111"
    );
    results.push({
      name: "AgentRegistry.mintAgent",
      passed: typeof reg.tokenId === "number",
      details: `tokenId=${String(reg.tokenId)}`,
    });

    const pay = await paymentAgent.executeCommand(
      "Pay 1000000000000000000 to service 0x2222222222222222222222222222222222222222 using SplitPayRouter"
    );
    results.push({
      name: "SplitPayRouter.pay",
      passed: pay.executedActions.some((a) => a.contract === "SplitPayRouter" && a.function === "pay"),
      details: `actions=${pay.executedActions.length}`,
    });

    const vault = await treasuryAgent.manageTreasury(
      "Deposit into vault deposit 500000000000000000 for 0x3333333333333333333333333333333333333333 and check total assets"
    );
    results.push({
      name: "AgentVault.deposit",
      passed: vault.executedActions.some((a) => a.contract === "AgentVault" && a.function === "deposit"),
      details: `actions=${vault.executedActions.length}`,
    });
    results.push({
      name: "AgentVault.totalAssets",
      passed: vault.executedActions.some((a) => a.contract === "AgentVault" && a.function === "totalAssets"),
      details: `actions=${vault.executedActions.length}`,
    });

    const receipt = await paymentAgent.executeCommand(
      `Set minter ${routerAddress} in receipt minter`
    );
    results.push({
      name: "ReceiptNFT.setMinter",
      passed: receipt.executedActions.some((a) => a.contract === "ReceiptNFT" && a.function === "setMinter"),
      details: `actions=${receipt.executedActions.length}`,
    });

    const wrapped = await paymentAgent.executeCommand(
      "Wrap 100000000000000000 and then unwrap 50000000000000000"
    );
    results.push({
      name: "WrappedNative.deposit",
      passed: wrapped.executedActions.some((a) => a.contract === "WrappedNative" && a.function === "deposit"),
      details: `actions=${wrapped.executedActions.length}`,
    });
    results.push({
      name: "WrappedNative.withdraw",
      passed: wrapped.executedActions.some((a) => a.contract === "WrappedNative" && a.function === "withdraw"),
      details: `actions=${wrapped.executedActions.length}`,
    });

    const logs = getExecutionLogs();
    const contractCoverage = [
      "AgentRegistry",
      "SplitPayRouter",
      "AgentVault",
      "ReceiptNFT",
      "WrappedNative",
    ].map((contract) => ({
      contract,
      seen: logs.some((line) => line.includes(`Executing ${contract}.`)),
    }));

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

    const allPassed =
      results.every((r) => r.passed) &&
      contractCoverage.every((c) => c.seen) &&
      directChecks.every((d) => d.success);

    return NextResponse.json(
      toJsonSafe({
        ok: true,
        allPassed,
        results,
        contractCoverage,
        directChecks: directChecks.map((d, idx) => ({
          index: idx,
          success: d.success,
          error: d.error || null,
        })),
        logs: getExecutionLogs(),
      })
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
