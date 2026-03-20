import { NextResponse } from "next/server";
import { createPublicClient, http, type Address } from "viem";
import { CONTRACT_ADDRESSES } from "@/agent/contracts/contractExecutor";
import { AGENT_VAULT_ABI } from "@/agent/contracts/abis";

export const runtime = "nodejs";

const RPC_URL =
  process.env.RPC_URL || "https://testnet-passet-hub-eth-rpc.polkadot.io";
const CHAIN_ID = Number(process.env.CHAIN_ID || "420420417");

const CHAIN = {
  id: CHAIN_ID,
  name: "Polkadot Hub",
  nativeCurrency: { name: "PAS", symbol: "PAS", decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] }, public: { http: [RPC_URL] } },
} as const;

const ERC721_MIN_ABI = [
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const address = (url.searchParams.get("address") || "").trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json({ error: "invalid address" }, { status: 400 });
    }

    const client = createPublicClient({
      chain: CHAIN,
      transport: http(RPC_URL),
    });

    // `readContract` returns typed results for uint256 as `bigint` on supported chains.
    const balanceRaw = (await client.readContract({
      address: CONTRACT_ADDRESSES.AGENT_REGISTRY,
      abi: ERC721_MIN_ABI,
      functionName: "balanceOf",
      args: [address as Address],
    })) as bigint;

    const totalAssetsRaw = (await client.readContract({
      address: CONTRACT_ADDRESSES.AGENT_VAULT,
      abi: AGENT_VAULT_ABI,
      functionName: "totalAssets",
      args: [],
    })) as bigint;

    const registered = balanceRaw > 0n;

    return NextResponse.json({
      ok: true,
      registered,
      balance: balanceRaw.toString(),
      totalAssets: totalAssetsRaw.toString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
