import { network } from "hardhat";

const WRAPPED_NATIVE_TESTNET = { name: "Wrapped PAS", symbol: "WPAS" };
const WRAPPED_NATIVE_MAINNET = { name: "Wrapped DOT", symbol: "WDOT" };

async function main() {
  const { ethers } = await network.connect();
  const [deployer] = await ethers.getSigners();
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const isTestnet = chainId === 420420417n || chainId === 420420421n;
  const wrappedConfig = isTestnet ? WRAPPED_NATIVE_TESTNET : WRAPPED_NATIVE_MAINNET;

  console.log("Deploying with account:", deployer.address);
  console.log("Chain ID:", chainId.toString(), isTestnet ? "(testnet)" : "(mainnet)");

  const wrappedNative = await ethers.deployContract("WrappedNative", [
    wrappedConfig.name,
    wrappedConfig.symbol,
  ]);
  await wrappedNative.waitForDeployment();
  const wrappedNativeAddress = await wrappedNative.getAddress();
  console.log("WrappedNative deployed:", wrappedNativeAddress);

  const agentRegistry = await ethers.deployContract("AgentRegistry");
  await agentRegistry.waitForDeployment();
  console.log("AgentRegistry deployed:", await agentRegistry.getAddress());

  const agentVault = await ethers.deployContract("AgentVault", [wrappedNativeAddress]);
  await agentVault.waitForDeployment();
  console.log("AgentVault deployed:", await agentVault.getAddress());

  const treasury = deployer.address;
  const xcmYieldRecipient = deployer.address;

  const splitPayRouter = await ethers.deployContract("SplitPayRouter", [
    treasury,
    xcmYieldRecipient,
  ]);
  await splitPayRouter.waitForDeployment();
  const splitPayRouterAddress = await splitPayRouter.getAddress();
  console.log("SplitPayRouter deployed:", splitPayRouterAddress);

  const receiptNFT = await ethers.deployContract("ReceiptNFT");
  await receiptNFT.waitForDeployment();
  const receiptNFTAddress = await receiptNFT.getAddress();
  console.log("ReceiptNFT deployed:", receiptNFTAddress);

  const setMinterTx = await receiptNFT.setMinter(splitPayRouterAddress);
  await setMinterTx.wait();
  console.log("ReceiptNFT minter set to SplitPayRouter");

  const setReceiptTx = await splitPayRouter.setReceiptNFT(receiptNFTAddress);
  await setReceiptTx.wait();
  console.log("SplitPayRouter receipt NFT configured");

  console.log("\n--- Deployment Summary ---");
  console.log("WrappedNative:", wrappedNativeAddress);
  console.log("AgentRegistry:", await agentRegistry.getAddress());
  console.log("AgentVault:", await agentVault.getAddress());
  console.log("SplitPayRouter:", splitPayRouterAddress);
  console.log("ReceiptNFT:", receiptNFTAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
