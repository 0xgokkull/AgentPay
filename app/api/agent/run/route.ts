import { NextResponse } from "next/server";
import {
  AgentPaymentAgent,
  AgentRegistrationAgent,
  TreasuryManagementAgent,
} from "@/agent/agents/agentPaymentAgent";
import { clearExecutionLogs, getExecutionLogs } from "@/agent/contracts/contractExecutor";

export const runtime = "nodejs";

type AgentKind = "payment" | "registration" | "treasury";

type RunAgentRequest = {
  agentType: AgentKind;
  command?: string;
  address?: string;
  useLocalPlanner?: boolean;
};

function toJsonSafe<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, v) => (typeof v === "bigint" ? v.toString() : v))
  ) as T;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RunAgentRequest;
    const agentType = body.agentType;
    const useLocalPlanner = body.useLocalPlanner ?? false;

    process.env.AGENT_FORCE_LOCAL = useLocalPlanner ? "true" : "false";

    if (!agentType) {
      return NextResponse.json({ error: "agentType is required" }, { status: 400 });
    }

    clearExecutionLogs();

    if (agentType === "registration") {
      const address = body.address || "0x1111111111111111111111111111111111111111";
      const agent = new AgentRegistrationAgent();
      const result = await agent.registerAgent(address);

      return NextResponse.json(toJsonSafe({
        ok: true,
        agentType,
        response: result.response,
        executedActions: [
          {
            contract: "AgentRegistry",
            function: "mintAgent",
            params: { to: address },
            result: { tokenId: result.tokenId ?? null },
            transactionHash: result.transactionHash,
          },
        ],
        logs: getExecutionLogs(),
      }));
    }

    if (!body.command || body.command.trim().length === 0) {
      return NextResponse.json({ error: "command is required" }, { status: 400 });
    }

    if (agentType === "payment") {
      const agent = new AgentPaymentAgent();
      const result = await agent.executeCommand(body.command);
      return NextResponse.json(toJsonSafe({
        ok: true,
        agentType,
        response: result.response,
        executedActions: result.executedActions,
        logs: getExecutionLogs(),
      }));
    }

    if (agentType === "treasury") {
      const agent = new TreasuryManagementAgent();
      const result = await agent.manageTreasury(body.command);
      return NextResponse.json(toJsonSafe({
        ok: true,
        agentType,
        response: result.response,
        executedActions: result.executedActions,
        logs: getExecutionLogs(),
      }));
    }

    return NextResponse.json({ error: "invalid agentType" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
