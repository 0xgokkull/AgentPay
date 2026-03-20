/**
 * README: AgentPay AI Agent System
 * 
 * This directory contains the AI agent system for AgentPay, which uses Groq LLM
 * to intelligently trigger and manage smart contract functions.
 */

# AgentPay AI Agent System

## Overview

The agent system provides AI-powered interactions with AgentPay smart contracts using Groq's language model API. Agents can understand natural language commands and automatically execute the appropriate contract functions.

## Directory Structure

```
agent/
├── agents/
│   └── agentPaymentAgent.ts      # Main agent implementations
├── contracts/
│   ├── abis.ts                   # Contract ABIs
│   └── contractExecutor.ts       # Contract execution logic
├── utils/
│   └── [utility functions]       # Helper utilities
├── config.ts                     # Configuration settings
├── groqClient.ts                 # Groq API client
├── index.ts                      # Main exports
└── types.ts                      # TypeScript types
```

## Agents

### 1. AgentPaymentAgent
Handles payment-related operations using SplitPayRouter and ReceiptNFT contracts.

**Capabilities:**
- Execute payments with automatic splits (70/20/10)
- Configure treasury addresses
- Set yield recipients
- Manage pause/unpause states

**Usage:**
```typescript
const agent = new AgentPaymentAgent();
const result = await agent.executeCommand("Execute a payment of 100 tokens to 0x...");
```

### 2. AgentRegistrationAgent
Manages AI agent registration and identity via AgentRegistry contract.

**Capabilities:**
- Register new AI agents
- Mint soulbound identity NFTs

**Usage:**
```typescript
const agent = new AgentRegistrationAgent();
const result = await agent.registerAgent("0x...");
```

### 3. TreasuryManagementAgent
Manages vault operations and treasury configurations.

**Capabilities:**
- Deposit funds into vault
- Withdraw funds from vault
- Check vault balance
- Update treasury settings

**Usage:**
```typescript
const agent = new TreasuryManagementAgent();
const result = await agent.manageTreasury("Deposit 50 tokens into vault");
```

## Supported Contracts

1. **AgentRegistry** - Agent identity management
2. **SplitPayRouter** - Payment routing and splitting
3. **AgentVault** - Treasury vault (ERC4626)
4. **ReceiptNFT** - Payment receipts
5. **WrappedNative** - Native token wrapping

## Configuration

Set environment variables in `.env`:
```
groq=YOUR_GROQ_API_KEY_HERE
```

## Running Tests

```bash
npm run test:agent
```

This executes comprehensive tests covering:
- Agent registration
- Payment execution
- Treasury configuration
- Vault operations
- Receipt NFT management
- Emergency controls (pause/unpause)

## How It Works

1. **User Command** → Natural language instruction
2. **Groq Analysis** → LLM analyzes and determines required actions
3. **Function Call Parsing** → Extracts contract calls from LLM response
4. **Execution** → Simulates contract function execution
5. **Result** → Returns execution results and conversation response

## Smart Contract Integration

Each agent is designed to work with specific contract functions:

### Payment Agent Functions:
- `SplitPayRouter.pay(service)` - Execute payment
- `SplitPayRouter.setTreasury(address)` - Update treasury
- `SplitPayRouter.setYieldRecipient(address)` - Update yield recipient
- `SplitPayRouter.setReceiptNFT(address)` - Set receipt NFT
- `SplitPayRouter.pause()` - Pause operations
- `SplitPayRouter.unpause()` - Resume operations
- `ReceiptNFT.setMinter(address)` - Configure minter

### Registration Agent Functions:
- `AgentRegistry.mintAgent(address)` - Register new agent

### Treasury Agent Functions:
- `AgentVault.deposit(amount, receiver)` - Deposit into vault
- `AgentVault.withdraw(shares, receiver, owner)` - Withdraw from vault
- `AgentVault.totalAssets()` - Check vault balance

## Development

To extend the agent system:

1. Add new agent class in `agents/`
2. Define agent system prompt with available functions
3. Implement handler functions in contract executor
4. Update test file to include new agent tests

## Security Considerations

- The agent system uses simulated execution for testing
- In production, implement proper wallet connections and gas estimation
- Add transaction signing and execution verification
- Implement proper access control and permission checking
- Add rate limiting for Groq API calls

## Error Handling

Agents implement comprehensive error handling:
- Invalid contract names
- Unknown function calls
- Parameter parsing errors
- API failures

## Future Enhancements

- [ ] Multi-chain support
- [ ] Transaction batching
- [ ] Gas optimization suggestions
- [ ] Portfolio analytics
- [ ] Scheduled task automation
- [ ] Webhook integrations
