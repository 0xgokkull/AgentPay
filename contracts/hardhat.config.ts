import { defineConfig } from "hardhat/config";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";

const rpcUrl = process.env.RPC_URL || "https://westend-asset-hub-eth-rpc.polkadot.io";
const chainId = Number(process.env.CHAIN_ID || "420420421");
const rawPrivateKey = process.env.PRIVATE_KEY || process.env.Private_key;
const account = rawPrivateKey
  ? (rawPrivateKey.startsWith("0x") ? rawPrivateKey : `0x${rawPrivateKey}`)
  : undefined;

export default defineConfig({
  plugins: [hardhatToolboxMochaEthers],
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  solidity: {
    version: "0.8.19",
    settings: {
      evmVersion: "london",
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainId: 31337,
    },
    polkadotHub: {
      type: "http",
      url: rpcUrl,
      chainId,
      accounts: account ? [account] : [],
    },
  },
});
