# 🎯 AgentPay AI Agent System - Quick Reference

## Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Ensure .env has Groq API key
groq=YOUR_GROQ_API_KEY_HERE

# 3. Run tests
npm run test:agent
```

## 🤖 Three Main Agents

### 1️⃣ Payment Agent
Handles payments and payment routing
```typescript
const agent = new AgentPaymentAgent();
await agent.executeCommand("Pay 100 tokens to 0x...");
```

### 2️⃣ Registration Agent
Manages agent registration
```typescript
const agent = new AgentRegistrationAgent();
await agent.registerAgent("0x...");
```

### 3️⃣ Treasury Agent
Manages vault operations
```typescript
const agent = new TreasuryManagementAgent();
await agent.manageTreasury("Deposit 50 tokens");
```

## ✅ Supported Contract Functions

| Contract | Functions |
|----------|-----------|
| **AgentRegistry** | `mintAgent(address)` |
| **SplitPayRouter** | `pay()`, `setTreasury()`, `setYieldRecipient()`, `setReceiptNFT()`, `pause()`, `unpause()` |
| **AgentVault** | `deposit()`, `withdraw()`, `totalAssets()` |
| **ReceiptNFT** | `setMinter()` |
| **WrappedNative** | `deposit()`, `withdraw()` |

## 🎮 Available Commands

### Run Tests
```bash
npm run test:agent        # Run once
npm run test:agent:watch  # Watch mode
```

### Interactive CLI
```bash
npx ts-node agent-cli.ts
```

### Custom Commands
```typescript
import { AgentPaymentAgent } from "./agent";

const agent = new AgentPaymentAgent();
const result = await agent.executeCommand("your command");
```

## 📝 Natural Language Examples

### Payment Commands
- "Execute a 1000 token payment to 0x1234..."
- "Pause the SplitPayRouter"
- "Set treasury to 0x5678..."
- "Transfer 500 tokens to service"

### Registration Commands
- "Register new AI agent at 0x..."
- "Mint identity NFT for agent"

### Treasury Commands
- "Deposit 100 tokens for 0x..."
- "Check vault balance"
- "Withdraw 50 shares"
- "Update treasury settings"

## 📊 Contract Addresses (from .env)

```
WrappedNative:    0x7832bf2C0EdeDc97C072D5e1F667c22838B06671
AgentRegistry:    0x75cB78a83008D3Ac23aF6545E12d53776fe1e3fF
AgentVault:       0xc3409d7b5Ae1eAf88C676Ec69cb36E2e448CE5ee
SplitPayRouter:   0x39F81a420F2B8E461812566Ef70327Cd508c85f7
ReceiptNFT:       0x932Ec73B37735d6e62d5926a463dC67657413d63
```

## 🏗️ Directory Structure

```
agent/
├── agents/                  # Agent implementations
├── contracts/              # Smart contracts
│   ├── abis.ts            # Contract ABIs
│   └── contractExecutor.ts # Function execution
├── utils/                  # Helper functions
├── groqClient.ts          # Groq API
├── config.ts              # Configuration
└── types.ts               # TypeScript types

agent.test.ts             # Test suite
agent-cli.ts              # Interactive CLI
AGENT_EXAMPLES.ts         # Code examples
```

## 🚀 Quick Start (3 Commands)

```bash
# 1. Install
npm install

# 2. Test
npm run test:agent

# 3. Run CLI (optional)
npx ts-node agent-cli.ts
```

## 🔄 How It Works

1. **User Input** → Natural language command
2. **Groq Analysis** → LLM processes intent
3. **Function Parsing** → Extract contract calls
4. **Execution** → Simulate contract functions
5. **Results** → Return AI response + execution results

## 💡 Key Features

- ✅ AI-powered using Groq LLM
- ✅ Understands natural language
- ✅ Comprehensive contract coverage
- ✅ Full TypeScript support
- ✅ Test suite included
- ✅ Interactive CLI available
- ✅ Extensible architecture

## 🧪 Test Coverage

- ✅ Agent registration
- ✅ Payment execution
- ✅ Treasury configuration
- ✅ Vault operations
- ✅ Receipt management
- ✅ Emergency controls

## 📚 Documentation

- [AGENT_SETUP_SUMMARY.md](AGENT_SETUP_SUMMARY.md) - Complete setup guide
- [AGENT_SYSTEM.md](AGENT_SYSTEM.md) - System documentation
- [agent/README.md](agent/README.md) - Agent documentation
- [AGENT_EXAMPLES.ts](AGENT_EXAMPLES.ts) - Code examples

## ⚠️ Important Notes

- The Groq API key is required in `.env`
- Addresses must be in format `0x` + 40 hex characters
- Amounts should be positive numbers
- All contract interactions are simulated for testing
- Ready for real blockchain integration

## 🤝 Extending the System

To add new agents:
1. Create agent class in `agent/agents/`
2. Define system prompt
3. Add handler in `contractExecutor.ts`
4. Update `agent.test.ts`
5. Document in `README.md`

---

**Need Help?** Check the full documentation or run the interactive CLI!
