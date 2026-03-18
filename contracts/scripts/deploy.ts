import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const mockToken = await ethers.deployContract("MockToken");
  await mockToken.waitForDeployment();
  const mockTokenAddress = await mockToken.getAddress();
  console.log("MockToken deployed:", mockTokenAddress);

  const agentRegistry = await ethers.deployContract("AgentRegistry");
  await agentRegistry.waitForDeployment();
  console.log("AgentRegistry deployed:", await agentRegistry.getAddress());

  const agentVault = await ethers.deployContract("AgentVault", [mockTokenAddress]);
  await agentVault.waitForDeployment();
  console.log("AgentVault deployed:", await agentVault.getAddress());

  const treasury = deployer.address;
  const xcmYieldRecipient = deployer.address;

  const splitPayRouter = await ethers.deployContract("SplitPayRouter", [
    treasury,
    xcmYieldRecipient,
  ]);
  await splitPayRouter.waitForDeployment();
  console.log("SplitPayRouter deployed:", await splitPayRouter.getAddress());

  const receiptNFT = await ethers.deployContract("ReceiptNFT");
  await receiptNFT.waitForDeployment();
  console.log("ReceiptNFT deployed:", await receiptNFT.getAddress());

  console.log("\n--- Deployment Summary ---");
  console.log("MockToken:", mockTokenAddress);
  console.log("AgentRegistry:", await agentRegistry.getAddress());
  console.log("AgentVault:", await agentVault.getAddress());
  console.log("SplitPayRouter:", await splitPayRouter.getAddress());
  console.log("ReceiptNFT:", await receiptNFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
