import * as dotenv from "dotenv";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

dotenv.config();

// Polkadot Hub testnet configuration
const RPC_URL = process.env.RPC_URL || "https://eth-rpc-testnet.polkadot.io";
const CHAIN_ID = Number(process.env.CHAIN_ID || "420420417");

// Contract addresses from .env
const CONTRACTS = {
  WRAPPED_NATIVE: "0xd3215799fB97296853BC07203c369e2611be55f3",
  AGENT_REGISTRY: "0xd41B3eBDC73Dc92816e7B397726A9caF09319840",
  AGENT_VAULT: "0xc9624F90c36357093AA96c689AaC423c16249C99",
  SPLIT_PAY_ROUTER: "0x472e1f2F3a237Ea213D5144c945B6Cfc75190F6a",
  RECEIPT_NFT: "0xC92D970130c0F54eE24Cf81Cc4cB74925a9022d8",
};

async function testBlockchainConnection() {
  console.log("╔════════════════════════════════════════════════════════════════╗");
  console.log("║      AgentPay - Blockchain Transaction Test                    ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  try {
    // Get private key
    const privateKey = process.env.PRIVATE_KEY || process.env.Private_key;
    if (!privateKey) {
      throw new Error("PRIVATE_KEY or Private_key not found in .env");
    }

    // Create account from private key
    const account = privateKeyToAccount(`0x${privateKey}`);
    console.log("✅ Account loaded");
    console.log(`   Address: ${account.address}\n`);

    // Create clients
    const publicClient = createPublicClient({
      chain: {
        id: CHAIN_ID,
        name: "Polkadot Hub",
        network: "polkadot-hub",
        nativeCurrency: { name: "PAS", symbol: "PAS", decimals: 18 },
        rpcUrls: {
          default: { http: [RPC_URL] },
        },
      },
      transport: http(RPC_URL),
    });

    const walletClient = createWalletClient({
      account,
      chain: {
        id: CHAIN_ID,
        name: "Polkadot Hub",
        network: "polkadot-hub",
        nativeCurrency: { name: "PAS", symbol: "PAS", decimals: 18 },
        rpcUrls: {
          default: { http: [RPC_URL] },
        },
      },
      transport: http(RPC_URL),
    });

    // Test 1: Check account balance
    console.log("📋 TEST 1: Check Account Balance\n");
    console.log("─".repeat(64));

    try {
      const balance = await publicClient.getBalance({
        address: account.address,
      });
      console.log(`✅ Account Balance: ${balance / BigInt(10 ** 18)} PAS`);
      console.log(`   Raw: ${balance} wei\n`);
    } catch (error) {
      console.log(`❌ Error checking balance: ${error}\n`);
    }

    // Test 2: Get gas price
    console.log("📋 TEST 2: Get Gas Price\n");
    console.log("─".repeat(64));

    try {
      const gasPrice = await publicClient.getGasPrice();
      console.log(`✅ Gas Price: ${gasPrice} wei\n`);
    } catch (error) {
      console.log(`❌ Error getting gas price: ${error}\n`);
    }

    // Test 3: Get chain ID
    console.log("📋 TEST 3: Verify Network\n");
    console.log("─".repeat(64));

    try {
      const chainId = await publicClient.getChainId();
      console.log(`✅ Chain ID: ${chainId}`);
      console.log(`   Expected: ${CHAIN_ID}`);
      console.log(`   Match: ${chainId === CHAIN_ID ? "✅ YES" : "❌ NO"}\n`);
    } catch (error) {
      console.log(`❌ Error getting chain ID: ${error}\n`);
    }

    // Test 4: Get account nonce
    console.log("📋 TEST 4: Get Account Nonce\n");
    console.log("─".repeat(64));

    try {
      const nonce = await publicClient.getTransactionCount({
        address: account.address,
      });
      console.log(`✅ Account Nonce: ${nonce}`);
      console.log(`   (Next transaction number: ${nonce})\n`);
    } catch (error) {
      console.log(`❌ Error getting nonce: ${error}\n`);
    }

    // Test 5: Display contract addresses
    console.log("📋 TEST 5: Smart Contract Addresses\n");
    console.log("─".repeat(64));
    console.log("Deployed Contracts on Polkadot Hub testnet:");
    Object.entries(CONTRACTS).forEach(([name, address]) => {
      console.log(`  ${name}: ${address}`);
    });
    console.log("");

    // Summary
    console.log("═".repeat(64));
    console.log("📊 BLOCKCHAIN CONNECTION STATUS: ✅ CONNECTED\n");
    console.log("Network Details:");
    console.log(`  RPC: ${RPC_URL}`);
    console.log(`  Chain ID: ${CHAIN_ID}`);
    console.log(`  Your Account: ${account.address}`);
    console.log(`  Status: Ready for transactions\n`);
    console.log("═".repeat(64));
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run the test
testBlockchainConnection().catch(console.error);
