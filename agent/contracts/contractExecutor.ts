import * as dotenv from "dotenv";
import {
  createPublicClient,
  createWalletClient,
  decodeEventLog,
  http,
  type Address,
  type Hash,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  AGENT_REGISTRY_ABI,
  AGENT_VAULT_ABI,
  RECEIPT_NFT_ABI,
  SPLIT_PAY_ROUTER_ABI,
  WRAPPED_NATIVE_ABI,
  ERC20_ABI,
} from "./abis";

dotenv.config();

const executionLogs: string[] = [];

const RPC_URL =
  process.env.RPC_URL || "https://testnet-passet-hub-eth-rpc.polkadot.io";
const CHAIN_ID = Number(process.env.CHAIN_ID || "420420417");

const CHAIN = {
  id: CHAIN_ID,
  name: "Polkadot Hub",
  nativeCurrency: { name: "PAS", symbol: "PAS", decimals: 18 },
  rpcUrls: {
    default: { http: [RPC_URL] },
    public: { http: [RPC_URL] },
  },
} as const;

function envAddress(key: string, fallback: string): Address {
  const value = process.env[key];
  if (value && /^0x[a-fA-F0-9]{40}$/.test(value)) {
    return value as Address;
  }
  return fallback as Address;
}

export const CONTRACT_ADDRESSES = {
  WRAPPED_NATIVE: envAddress(
    "WRAPPED_NATIVE_ADDRESS",
    "0x7832bf2C0EdeDc97C072D5e1F667c22838B06671",
  ),
  AGENT_REGISTRY: envAddress(
    "AGENT_REGISTRY_ADDRESS",
    "0x75cB78a83008D3Ac23aF6545E12d53776fe1e3fF",
  ),
  AGENT_VAULT: envAddress(
    "AGENT_VAULT_ADDRESS",
    "0xc3409d7b5Ae1eAf88C676Ec69cb36E2e448CE5ee",
  ),
  SPLIT_PAY_ROUTER: envAddress(
    "SPLIT_PAY_ROUTER_ADDRESS",
    "0x39F81a420F2B8E461812566Ef70327Cd508c85f7",
  ),
  RECEIPT_NFT: envAddress(
    "RECEIPT_NFT_ADDRESS",
    "0x932Ec73B37735d6e62d5926a463dC67657413d63",
  ),
};

export interface ExecutionResult {
  success: boolean;
  transactionHash?: string;
  result?: unknown;
  error?: string;
  log: string;
}

function normalizePrivateKey(): `0x${string}` | null {
  const value = process.env.PRIVATE_KEY || process.env.Private_key;
  if (!value) return null;
  const normalized = value.startsWith("0x") ? value : `0x${value}`;
  if (!/^0x[a-fA-F0-9]{64}$/.test(normalized)) return null;
  return normalized as `0x${string}`;
}

function pickAddress(
  params: Record<string, unknown>,
  keys: string[],
  fallback?: Address,
): Address {
  for (const key of keys) {
    const value = params[key];
    if (typeof value === "string" && /^0x[a-fA-F0-9]{40}$/.test(value)) {
      return value as Address;
    }
  }
  const foundValues = keys
    .map((k) => `${k}: ${JSON.stringify(params[k])}`)
    .join(", ");
  if (fallback) return fallback;
  throw new Error(
    `Invalid address in params. Found: { ${foundValues} }. Expected a valid 0x-prefixed 40-hex-character address for one of: ${keys.join(", ")}`,
  );
}

function pickAmount(
  params: Record<string, unknown>,
  keys: string[],
  fallback: bigint,
): bigint {
  for (const key of keys) {
    const value = params[key];
    if (value !== undefined) {
      return toBigIntAmount(value, key);
    }
  }
  return fallback;
}

function toBigIntAmount(value: unknown, name: string): bigint {
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return BigInt(Math.trunc(value));
  if (typeof value === "string" && /^\d+$/.test(value)) return BigInt(value);
  throw new Error(`Invalid numeric amount for ${name}`);
}

function createClients() {
  const publicClient = createPublicClient({
    chain: CHAIN,
    transport: http(RPC_URL),
  });

  const pk = normalizePrivateKey();
  if (!pk) {
    return {
      publicClient,
      walletClient: null as ReturnType<typeof createWalletClient> | null,
      account: null as ReturnType<typeof privateKeyToAccount> | null,
    };
  }

  const account = privateKeyToAccount(pk);
  const walletClient = createWalletClient({
    account,
    chain: CHAIN,
    transport: http(RPC_URL),
  });

  return { publicClient, walletClient, account };
}

async function sendWrite(
  contractName: string,
  functionName: string,
  params: Record<string, unknown>,
): Promise<ExecutionResult> {
  const { publicClient, walletClient, account } = createClients();
  if (!walletClient || !account) {
    throw new Error(
      "PRIVATE_KEY (or Private_key) is required for write transactions",
    );
  }

  let hash: Hash;

  if (contractName === "AgentRegistry" && functionName === "mintAgent") {
    hash = await walletClient.writeContract({
      account,
      chain: CHAIN,
      address: CONTRACT_ADDRESSES.AGENT_REGISTRY,
      abi: AGENT_REGISTRY_ABI,
      functionName: "mintAgent",
      args: [pickAddress(params, ["to", "agent", "address"])],
    });
  } else if (contractName === "SplitPayRouter" && functionName === "pay") {
    const amount = pickAmount(
      params,
      ["amount", "value"],
      10_000_000_000_000_000n,
    );
    const paused = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.SPLIT_PAY_ROUTER,
      abi: [
        {
          inputs: [],
          name: "paused",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "view",
          type: "function",
        },
      ] as const,
      functionName: "paused",
      args: [],
    });

    // Agent responses often call pause() before pay(). If we own the router,
    // auto-unpause so payment execution is resilient to that sequence.
    if (paused) {
      await walletClient.writeContract({
        account,
        chain: CHAIN,
        address: CONTRACT_ADDRESSES.SPLIT_PAY_ROUTER,
        abi: SPLIT_PAY_ROUTER_ABI,
        functionName: "unpause",
        args: [],
      });
    }

    hash = await walletClient.writeContract({
      account,
      chain: CHAIN,
      address: CONTRACT_ADDRESSES.SPLIT_PAY_ROUTER,
      abi: SPLIT_PAY_ROUTER_ABI,
      functionName: "pay",
      args: [pickAddress(params, ["service", "to", "recipient", "payee"])],
      value: amount,
    });
  } else if (
    contractName === "SplitPayRouter" &&
    functionName === "setTreasury"
  ) {
    hash = await walletClient.writeContract({
      account,
      chain: CHAIN,
      address: CONTRACT_ADDRESSES.SPLIT_PAY_ROUTER,
      abi: SPLIT_PAY_ROUTER_ABI,
      functionName: "setTreasury",
      args: [pickAddress(params, ["_treasury", "treasury", "address", "to"])],
    });
  } else if (
    contractName === "SplitPayRouter" &&
    functionName === "setYieldRecipient"
  ) {
    hash = await walletClient.writeContract({
      account,
      chain: CHAIN,
      address: CONTRACT_ADDRESSES.SPLIT_PAY_ROUTER,
      abi: SPLIT_PAY_ROUTER_ABI,
      functionName: "setYieldRecipient",
      args: [
        pickAddress(params, [
          "_recipient",
          "yield",
          "recipient",
          "yieldRecipient",
          "address",
          "to",
        ]),
      ],
    });
  } else if (
    contractName === "SplitPayRouter" &&
    functionName === "setReceiptNFT"
  ) {
    hash = await walletClient.writeContract({
      account,
      chain: CHAIN,
      address: CONTRACT_ADDRESSES.SPLIT_PAY_ROUTER,
      abi: SPLIT_PAY_ROUTER_ABI,
      functionName: "setReceiptNFT",
      args: [
        pickAddress(
          params,
          ["_receiptNFT", "receiptNFT", "addr", "to"],
          CONTRACT_ADDRESSES.RECEIPT_NFT,
        ),
      ],
    });
  } else if (contractName === "SplitPayRouter" && functionName === "pause") {
    hash = await walletClient.writeContract({
      account,
      chain: CHAIN,
      address: CONTRACT_ADDRESSES.SPLIT_PAY_ROUTER,
      abi: SPLIT_PAY_ROUTER_ABI,
      functionName: "pause",
      args: [],
    });
  } else if (contractName === "SplitPayRouter" && functionName === "unpause") {
    hash = await walletClient.writeContract({
      account,
      chain: CHAIN,
      address: CONTRACT_ADDRESSES.SPLIT_PAY_ROUTER,
      abi: SPLIT_PAY_ROUTER_ABI,
      functionName: "unpause",
      args: [],
    });
  } else if (contractName === "AgentVault" && functionName === "deposit") {
    const amount = toBigIntAmount(params.assets, "assets");

    try {
      const balance = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.WRAPPED_NATIVE,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [account.address],
      });

      const balanceBig =
        typeof balance === "bigint" ? balance : BigInt(String(balance));

      const allowance = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.WRAPPED_NATIVE,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [account.address, CONTRACT_ADDRESSES.AGENT_VAULT],
      });

      const allowanceBig =
        typeof allowance === "bigint" ? allowance : BigInt(String(allowance));
      if (allowanceBig < amount) {
        const approveHash = await walletClient.writeContract({
          account,
          chain: CHAIN,
          address: CONTRACT_ADDRESSES.WRAPPED_NATIVE,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [CONTRACT_ADDRESSES.AGENT_VAULT, amount],
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
        const approveLog = `[${new Date().toISOString()}] Approved AgentVault to spend ${amount.toString()} of WRAPPED_NATIVE`;
        executionLogs.push(approveLog);
      }
      if (allowanceBig < amount) {
        try {
          if (allowanceBig > 0n) {
            const resetHash = await walletClient.writeContract({
              account,
              chain: CHAIN,
              address: CONTRACT_ADDRESSES.WRAPPED_NATIVE,
              abi: ERC20_ABI,
              functionName: "approve",
              args: [CONTRACT_ADDRESSES.AGENT_VAULT, 0n],
            });
            await publicClient.waitForTransactionReceipt({ hash: resetHash });
            const resetLog = `[${new Date().toISOString()}] Reset approval to 0 for AgentVault on WRAPPED_NATIVE`;
            executionLogs.push(resetLog);
          }

          const approveHash = await walletClient.writeContract({
            account,
            chain: CHAIN,
            address: CONTRACT_ADDRESSES.WRAPPED_NATIVE,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [CONTRACT_ADDRESSES.AGENT_VAULT, amount],
          });
          await publicClient.waitForTransactionReceipt({ hash: approveHash });
          const approveLog = `[${new Date().toISOString()}] Approved AgentVault to spend ${amount.toString()} of WRAPPED_NATIVE`;
          executionLogs.push(approveLog);
        } catch (approveErr) {
          const errMsg =
            approveErr instanceof Error
              ? approveErr.message
              : String(approveErr);
          const warnLog = `[${new Date().toISOString()}] WARNING approve/reset flow failed: ${errMsg}`;
          console.warn(warnLog);
          executionLogs.push(warnLog);
        }
      } else {
        const infoLog = `[${new Date().toISOString()}] Sufficient allowance already set for AgentVault to spend ${amount.toString()} of WRAPPED_NATIVE, skipping approve. Current allowance: ${allowanceBig.toString()}`;
        console.info(infoLog);
        executionLogs.push(infoLog);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const warnLog = `[${new Date().toISOString()}] WARNING preparing wrapped token/allowance: ${errMsg}`;
      console.warn(warnLog);
      executionLogs.push(warnLog);
    }

    hash = await walletClient.writeContract({
      account,
      chain: CHAIN,
      address: CONTRACT_ADDRESSES.AGENT_VAULT,
      abi: AGENT_VAULT_ABI,
      functionName: "deposit",
      args: [amount, pickAddress(params, ["receiver", "to", "address"])],
    });
  } else if (contractName === "AgentVault" && functionName === "withdraw") {
    hash = await walletClient.writeContract({
      account,
      chain: CHAIN,
      address: CONTRACT_ADDRESSES.AGENT_VAULT,
      abi: AGENT_VAULT_ABI,
      functionName: "withdraw",
      args: [
        toBigIntAmount(params.shares, "shares"),
        pickAddress(params, ["receiver", "to", "address"]),
        pickAddress(params, ["owner", "to", "address"]),
      ],
    });
  } else if (contractName === "ReceiptNFT" && functionName === "setMinter") {
    hash = await walletClient.writeContract({
      account,
      chain: CHAIN,
      address: CONTRACT_ADDRESSES.RECEIPT_NFT,
      abi: RECEIPT_NFT_ABI,
      functionName: "setMinter",
      args: [
        pickAddress(
          params,
          ["_minter", "minter", "address", "to"],
          CONTRACT_ADDRESSES.SPLIT_PAY_ROUTER,
        ),
      ],
    });
  } else if (contractName === "WrappedNative" && functionName === "deposit") {
    const amount = pickAmount(
      params,
      ["amount", "value"],
      10_000_000_000_000_000n,
    );
    hash = await walletClient.writeContract({
      account,
      chain: CHAIN,
      address: CONTRACT_ADDRESSES.WRAPPED_NATIVE,
      abi: WRAPPED_NATIVE_ABI,
      functionName: "depositFor",
      args: [account.address],
      value: amount,
    });
  } else if (contractName === "WrappedNative" && functionName === "withdraw") {
    hash = await walletClient.writeContract({
      account,
      chain: CHAIN,
      address: CONTRACT_ADDRESSES.WRAPPED_NATIVE,
      abi: WRAPPED_NATIVE_ABI,
      functionName: "withdraw",
      args: [toBigIntAmount(params.amount, "amount")],
    });
  } else {
    throw new Error(
      `Unsupported write function: ${contractName}.${functionName}`,
    );
  }

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  let enrichedResult: Record<string, string | number> = {
    blockNumber: receipt.blockNumber.toString(),
    gasUsed: receipt.gasUsed.toString(),
    status: receipt.status,
  };

  if (contractName === "AgentRegistry" && functionName === "mintAgent") {
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: AGENT_REGISTRY_ABI,
          data: log.data,
          topics: log.topics,
        });

        if (decoded.eventName === "AgentRegistered") {
          const tokenIdValue = (decoded.args as { tokenId?: bigint }).tokenId;
          if (typeof tokenIdValue === "bigint") {
            const asNumber = Number(tokenIdValue);
            enrichedResult = {
              ...enrichedResult,
              tokenId: Number.isSafeInteger(asNumber)
                ? asNumber
                : tokenIdValue.toString(),
            };
          }
        }
      } catch {
        // Ignore unrelated logs while scanning for AgentRegistered.
      }
    }
  }

  return {
    success: receipt.status === "success",
    transactionHash: hash,
    result: enrichedResult,
    log: `On-chain tx ${hash}`,
  };
}

async function sendRead(
  contractName: string,
  functionName: string,
): Promise<ExecutionResult> {
  const { publicClient } = createClients();

  if (contractName === "AgentVault" && functionName === "totalAssets") {
    const totalAssets = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.AGENT_VAULT,
      abi: AGENT_VAULT_ABI,
      functionName: "totalAssets",
      args: [],
    });
    return {
      success: true,
      result: { totalAssets: totalAssets.toString() },
      log: "On-chain read AgentVault.totalAssets",
    };
  }

  throw new Error(`Unsupported read function: ${contractName}.${functionName}`);
}

export async function executeContractFunction(
  contractName: string,
  functionName: string,
  params: Record<string, unknown>,
): Promise<ExecutionResult> {
  const log = `[${new Date().toISOString()}] Executing ${contractName}.${functionName} with params: ${JSON.stringify(params)}`;
  console.log(log);
  executionLogs.push(log);

  try {
    const isRead =
      contractName === "AgentVault" && functionName === "totalAssets";
    const result = isRead
      ? await sendRead(contractName, functionName)
      : await sendWrite(contractName, functionName, params);
    executionLogs.push(
      `[${new Date().toISOString()}] SUCCESS ${contractName}.${functionName}`,
    );
    return result;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const failLog = `[${new Date().toISOString()}] ERROR ${contractName}.${functionName}: ${errorMsg}`;
    console.error(failLog);
    executionLogs.push(failLog);
    return {
      success: false,
      error: errorMsg,
      log: failLog,
    };
  }
}

export function getExecutionLogs(): string[] {
  return executionLogs;
}

export function clearExecutionLogs(): void {
  executionLogs.length = 0;
}
