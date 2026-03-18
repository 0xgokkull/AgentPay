# AgentPay Smart Contracts

Production-ready payment infrastructure for AI agents on Polkadot Hub.

## Token Model

- **Native token**: PAS (testnet) / DOT (mainnet) — used directly in `SplitPayRouter.pay()`
- **WrappedNative**: WPAS/WDOT — ERC20 wrapper for vault deposits. Users `receive()` native → mint wrapped, or `depositFor(account)`.
- **AgentVault**: ERC4626 vault over WrappedNative for treasury and yield

## Setup

```bash
bun install
```

## Build

```bash
bun run compile
```

## Deploy

**Local (Hardhat):**
```bash
bun run deploy
```

**Polkadot Hub Testnet:**
```bash
PRIVATE_KEY=your_private_key bun run deploy:polkadot
```

## Contracts

| Contract | Description |
|----------|-------------|
| `WrappedNative` | WETH-style wrapper for native PAS/DOT |
| `AgentRegistry` | Soulbound agent identity (AccessControl) |
| `AgentVault` | ERC4626 treasury over WrappedNative |
| `SplitPayRouter` | 70/20/10 split, receipt NFT, pausable |
| `ReceiptNFT` | Payment receipts (minter = SplitPayRouter) |

## Production Features

- **ReentrancyGuard** on payment flow
- **Pausable** for emergency stop
- **Ownable** for treasury/yield/recipient updates
- **AccessControl** on AgentRegistry minting
- **Custom errors** for gas efficiency
- **Safe native transfers** via `call{value:}` (no 2300 gas limit)
- **Receipt NFT** minted atomically with each payment

## Network

- **Polkadot Hub Testnet**: Chain ID `420420417`, RPC `https://testnet-passet-hub-eth-rpc.polkadot.io`
- **Polkadot Hub Mainnet**: Chain ID `420420419`

Get testnet PAS from [Polkadot faucet](https://faucet.polkadot.io/) (Paseo → Hub).
