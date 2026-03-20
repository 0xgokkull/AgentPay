export const AGENT_REGISTRY_ABI = [
  {
    inputs: [{ internalType: "address", name: "to", type: "address" }],
    name: "mintAgent",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "agent", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "AgentRegistered",
    type: "event",
  },
] as const;

export const AGENT_VAULT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "assets", type: "uint256" }, { internalType: "address", name: "receiver", type: "address" }],
    name: "deposit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "shares", type: "uint256" }, { internalType: "address", name: "receiver", type: "address" }, { internalType: "address", name: "owner", type: "address" }],
    name: "withdraw",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalAssets",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const SPLIT_PAY_ROUTER_ABI = [
  {
    inputs: [{ internalType: "address", name: "service", type: "address" }],
    name: "pay",
    outputs: [{ internalType: "uint256", name: "receiptTokenId", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_treasury", type: "address" }],
    name: "setTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_recipient", type: "address" }],
    name: "setYieldRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_receiptNFT", type: "address" }],
    name: "setReceiptNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const RECEIPT_NFT_ABI = [
  {
    inputs: [{ internalType: "address", name: "_minter", type: "address" }],
    name: "setMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const WRAPPED_NATIVE_ABI = [
  {
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    inputs: [],
  },
  {
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
  },
] as const;
