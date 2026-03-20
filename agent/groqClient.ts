import * as dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";

const apiKey = process.env.groq;
if (!apiKey) {
  throw new Error("GROQ_API_KEY not found in environment variables");
}

export const groqClient = new Groq({
  apiKey: apiKey,
});

export interface AgentMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AgentResponse {
  content: string;
  functionCalls?: Array<{
    function: string;
    params: Record<string, unknown>;
  }>;
}

type ParsedCall = { function: string; params: Record<string, unknown> };

export async function executeAgentPrompt(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: AgentMessage[] = []
): Promise<AgentResponse> {
  const messages: AgentMessage[] = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    { role: "user", content: userMessage },
  ];

  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  const forceLocal = process.env.AGENT_FORCE_LOCAL === "true";

  if (forceLocal) {
    const localCalls = buildLocalFunctionCalls(userMessage);
    return {
      content: `Local planner used for: ${userMessage}`,
      functionCalls: localCalls,
    };
  }

  try {
    const response = await groqClient.chat.completions.create({
      model,
      messages: messages as any,
      temperature: 1,
      max_tokens: 1024,
    });

    const content = response.choices[0]?.message?.content || "No response from Groq";
    const functionCalls = parseFunctionCalls(content);

    if (functionCalls.length > 0) {
      return {
        content,
        functionCalls,
      };
    }

    const localCalls = buildLocalFunctionCalls(userMessage);
    return {
      content: `${content}\n\nFallback planner extracted ${localCalls.length} call(s).`,
      functionCalls: localCalls,
    };
  } catch (error) {
    const localCalls = buildLocalFunctionCalls(userMessage);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: `Groq unavailable (${errorMessage}). Local planner used.`,
      functionCalls: localCalls,
    };
  }
}

function parseFunctionCalls(
  content: string
): Array<{ function: string; params: Record<string, unknown> }> {
  const functionCalls: Array<{ function: string; params: Record<string, unknown> }> = [];
  const functionPattern = /CALL_FUNCTION\(([^,]+),\s*({[^}]+}|[^)]+)\)/g;
  let match;

  while ((match = functionPattern.exec(content)) !== null) {
    const functionName = match[1]?.trim();
    const paramsStr = match[2]?.trim();

    if (functionName && paramsStr) {
      try {
        let formattedParams = paramsStr
          .replace(/([{,])\s*([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":')
          .replace(/:\s*'([^']*)'/g, ':"$1"');
        
        const params = JSON.parse(formattedParams);
        functionCalls.push({ function: functionName, params });
      } catch {
      }
    }
  }

  return functionCalls;
}

function buildLocalFunctionCalls(userMessage: string): ParsedCall[] {
  const text = userMessage.toLowerCase();
  const addresses = userMessage.match(/0x[a-fA-F0-9]{40}/g) || [];
  const numeric = userMessage.match(/\d+/g) || [];
  const amount = numeric.length > 0 ? numeric[0] : "1000000000000000000";

  const calls: ParsedCall[] = [];

  if (text.includes("register") || text.includes("mint agent")) {
    calls.push({
      function: "AgentRegistry.mintAgent",
      params: { to: addresses[0] || "0x1111111111111111111111111111111111111111" },
    });
  }

  if (text.includes("pay") || text.includes("splitpayrouter")) {
    calls.push({
      function: "SplitPayRouter.pay",
      params: {
        service: addresses[0] || "0x2222222222222222222222222222222222222222",
        amount,
      },
    });
  }

  if (text.includes("set treasury")) {
    calls.push({
      function: "SplitPayRouter.setTreasury",
      params: { _treasury: addresses[0] || "0x3333333333333333333333333333333333333333" },
    });
  }

  if (text.includes("set yield") || text.includes("yield recipient")) {
    calls.push({
      function: "SplitPayRouter.setYieldRecipient",
      params: { _recipient: addresses[0] || "0x4444444444444444444444444444444444444444" },
    });
  }

  if (text.includes("set receipt")) {
    calls.push({
      function: "SplitPayRouter.setReceiptNFT",
      params: { _recipient: addresses[0] || "0x5555555555555555555555555555555555555555" },
    });
  }

  if (text.includes("pause")) {
    calls.push({ function: "SplitPayRouter.pause", params: {} });
  }

  if (text.includes("unpause")) {
    calls.push({ function: "SplitPayRouter.unpause", params: {} });
  }

  if (text.includes("vault deposit") || text.includes("deposit into vault")) {
    calls.push({
      function: "AgentVault.deposit",
      params: {
        assets: amount,
        receiver: addresses[0] || "0x6666666666666666666666666666666666666666",
      },
    });
  }

  if (text.includes("vault withdraw") || text.includes("withdraw from vault")) {
    calls.push({
      function: "AgentVault.withdraw",
      params: {
        shares: amount,
        receiver: addresses[0] || "0x7777777777777777777777777777777777777777",
        owner: addresses[1] || addresses[0] || "0x7777777777777777777777777777777777777777",
      },
    });
  }

  if (text.includes("total assets") || text.includes("vault balance")) {
    calls.push({
      function: "AgentVault.totalAssets",
      params: {},
    });
  }

  if (text.includes("set minter") || text.includes("receipt minter")) {
    calls.push({
      function: "ReceiptNFT.setMinter",
      params: { _minter: addresses[0] || "0x8888888888888888888888888888888888888888" },
    });
  }

  if (text.includes("wrap") || text.includes("wrappednative deposit")) {
    calls.push({
      function: "WrappedNative.deposit",
      params: { amount },
    });
  }

  if (text.includes("unwrap") || text.includes("wrappednative withdraw")) {
    calls.push({
      function: "WrappedNative.withdraw",
      params: { amount },
    });
  }

  return calls;
}
