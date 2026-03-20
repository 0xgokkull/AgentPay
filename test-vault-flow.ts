import * as dotenv from "dotenv";
import { 
  createWalletClient, 
  createPublicClient, 
  http, 
  parseEther,
  formatEther
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { 
  WRAPPED_NATIVE_ABI, 
  AGENT_VAULT_ABI, 
  SPLIT_PAY_ROUTER_ABI,
  ERC20_ABI
} from "./agent/contracts/abis";

dotenv.config();

const RPC_URL = process.env.RPC_URL || "https://testnet-passet-hub-eth-rpc.polkadot.io";
const CHAIN_ID = Number(process.env.CHAIN_ID || "420420417");

const CONTRACTS = {
  WRAPPED_NATIVE: "0xd3215799fB97296853BC07203c369e2611be55f3",
  AGENT_VAULT: "0xc9624F90c36357093AA96c689AaC423c16249C99",
  SPLIT_PAY_ROUTER: "0x472e1f2F3a237Ea213D5144c945B6Cfc75190F6a",
};

async function testVaultFlow() {
  console.log("🚀 Testing AgentPay Vault Flow (Wrap -> Deposit -> Pay)\n");

  const privateKey = process.env.PRIVATE_KEY || process.env.Private_key;
  if (!privateKey) throw new Error("Private key not found");

  const account = privateKeyToAccount(`0x${privateKey.replace("0x", "")}`);
  const clientConfig = {
    chain: {
      id: CHAIN_ID,
      name: "Polkadot Hub",
      nativeCurrency: { name: "PAS", symbol: "PAS", decimals: 18 },
      rpcUrls: { default: { http: [RPC_URL] } },
    },
    transport: http(RPC_URL),
  };

  const publicClient = createPublicClient(clientConfig);
  const walletClient = createWalletClient({ ...clientConfig, account });

  const amount = parseEther("0.1"); // Test with 0.1 PAS to save funds
  const receiver = account.address;
  const service = "0x5Bdf0012b83d1C7720a60BC53db303fFc932aC49";

  console.log(`👤 Account: ${account.address}`);
  console.log(`💰 Target Amount: ${formatEther(amount)} PAS\n`);

  try {
    // Step 1: Wrap Native
    console.log("➡️ Step 1: Wrapping Native PAS...");
    const wrapHash = await walletClient.writeContract({
      address: CONTRACTS.WRAPPED_NATIVE as `0x${string}`,
      abi: WRAPPED_NATIVE_ABI,
      functionName: "depositFor",
      args: [account.address],
      value: amount,
    });
    console.log(`✅ Wrapped! Hash: ${wrapHash}`);
    await publicClient.waitForTransactionReceipt({ hash: wrapHash });

    const wpasBalance = await publicClient.readContract({
      address: CONTRACTS.WRAPPED_NATIVE as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [account.address],
    });
    console.log(`📈 Current WPAS Balance: ${formatEther(wpasBalance as bigint)} WPAS\n`);

    // Step 2: Approve Vault
    console.log("➡️ Step 2: Approving AgentVault...");
    const approveHash = await walletClient.writeContract({
      address: CONTRACTS.WRAPPED_NATIVE as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [CONTRACTS.AGENT_VAULT as `0x${string}`, amount],
    });
    console.log(`✅ Approved! Hash: ${approveHash}`);
    await publicClient.waitForTransactionReceipt({ hash: approveHash });

    // Step 3: Deposit to Vault
    console.log("➡️ Step 3: Depositing to AgentVault...");
    const depositHash = await walletClient.writeContract({
      address: CONTRACTS.AGENT_VAULT as `0x${string}`,
      abi: AGENT_VAULT_ABI,
      functionName: "deposit",
      args: [amount, receiver],
    });
    console.log(`✅ Deposited! Hash: ${depositHash}`);
    await publicClient.waitForTransactionReceipt({ hash: depositHash });

    // Step 4: Pay via Router
    console.log("➡️ Step 4: Paying via SplitPayRouter...");
    const payHash = await walletClient.writeContract({
      address: CONTRACTS.SPLIT_PAY_ROUTER as `0x${string}`,
      abi: SPLIT_PAY_ROUTER_ABI,
      functionName: "pay",
      args: [service as `0x${string}`],
      value: amount,
    });
    console.log(`✅ Paid! Hash: ${payHash}`);
    await publicClient.waitForTransactionReceipt({ hash: payHash });

    console.log("\n✨ FULL FLOW COMPLETED SUCCESSFULLY!");
  } catch (error) {
    console.error("\n❌ Flow Failed:", error);
  }
}

testVaultFlow();
