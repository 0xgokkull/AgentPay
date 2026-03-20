# AgentPay AI Agent System

A comprehensive AI agent system for AgentPay smart contracts using **Groq LLM**.

## 🎯 Features

- **AI-Powered Contract Interaction**: Use natural language to trigger smart contract functions
- **Multiple Specialized Agents**: Payment, Registration, and Treasury Management agents
- **Groq LLM Integration**: Fast and accurate contract function parsing
- **Comprehensive Contract Coverage**: All 5 smart contracts fully supported
- **Test Suite**: Complete testing framework for all agent capabilities

## 📁 Project Structure

```
agent/
├── agents/                  # Agent implementations
│   └── agentPaymentAgent.ts # Main agent classes
├── contracts/              # Smart contract definitions
│   ├── abis.ts            # Contract ABIs
│   └── contractExecutor.ts # Function execution logic
├── groqClient.ts          # Groq API client
├── config.ts              # Configuration
├── types.ts               # TypeScript definitions
├── index.ts               # Main exports
└── README.md              # Detailed documentation

agent.test.ts             # Comprehensive test suite
AGENT_EXAMPLES.ts         # Usage examples
setup.sh                  # Setup script
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Groq API

Add your Groq API key to `.env`:
```
groq=YOUR_GROQ_API_KEY_HERE
```

### 3. Run Tests

```bash
npm run test:agent
```

## 📊 Supported Smart Contracts

### AgentRegistry
Register AI agents as soulbound NFTs
- `mintAgent(address)` - Register new agent

### SplitPayRouter
Route payments with automatic splits (70/20/10)
- `pay(service)` - Execute payment
- `setTreasury(address)` - Configure treasury
- `setYieldRecipient(address)` - Set yield recipient
- `pause()` / `unpause()` - Emergency controls

### AgentVault (ERC4626)
Treasury vault for fund management
- `deposit(amount, receiver)` - Deposit funds
- `withdraw(shares, receiver, owner)` - Withdraw funds
- `totalAssets()` - Check balance

### ReceiptNFT
Payment receipt tracking
- `setMinter(address)` - Configure minter

### WrappedNative
Native token wrapping
- `deposit()` / `withdraw(amount)` - Token wrapping

## 🤖 Available Agents

### AgentPaymentAgent
Handles payment execution and routing

```typescript
const agent = new AgentPaymentAgent();
const result = await agent.executeCommand(
  "Execute a 1000 token payment to 0x..."
);
```

### AgentRegistrationAgent
Manages agent registration

```typescript
const agent = new AgentRegistrationAgent();
const result = await agent.registerAgent("0x...");
```

### TreasuryManagementAgent
Manages vault and treasury operations

```typescript
const agent = new TreasuryManagementAgent();
const result = await agent.manageTreasury(
  "Deposit 500 tokens for 0x..."
);
```

## 💡 Natural Language Examples

```
"Execute a payment of 1000 tokens to service provider 0x..."
"Register new AI agent at 0x..."
"Deposit 500 tokens into the vault"
"Check total assets in the vault"
"Pause the payment router"
"List all recent transactions"
```

## 🧪 Test Coverage

The test suite covers:
- ✅ Agent registration
- ✅ Payment execution
- ✅ Treasury configuration
- ✅ Vault operations (deposit/withdraw)
- ✅ Receipt NFT management
- ✅ Emergency controls (pause/unpause)

Run tests:
```bash
npm run test:agent
```

Watch mode:
```bash
npm run test:agent:watch
```

## 🔧 Architecture

### Groq Integration
- Uses Mixtral 8x7b LLM for understanding commands
- Parses function calls from LLM responses
- Converts natural language to contract parameters

### Contract Execution
- Simulated execution for testing
- Ready for real transaction integration
- Full error handling and validation

### Agent State Management
- Conversation history tracking
- Context preservation across commands
- Transaction logging

## 📝 Configuration

See `agent/config.ts` for:
- Groq model settings
- Contract addresses
- Payment split percentages
- Debug mode

## 🔐 Security

- Input validation on all parameters
- Function permission checks
- Reentrancy protection (contracts)
- Transaction simulation before execution

## 🚦 Status

**Status**: Production Ready (Testing Phase)
- Core agent system: ✅ Complete
- Groq integration: ✅ Complete
- Contract execution: ✅ Complete
- Test suite: ✅ Complete
- Real transaction integration: ⏳ Next Phase

## 📚 Documentation

- [Agent System README](agent/README.md) - Detailed documentation
- [AGENT_EXAMPLES.ts](AGENT_EXAMPLES.ts) - Code examples
- [Test File](agent.test.ts) - Test implementations

## 🤝 Contributing

To add new agents or functions:

1. Create agent class in `agent/agents/`
2. Define system prompt with available functions
3. Add contract execution handler
4. Update test file with new tests
5. Document in README

## 📄 License

MIT

---

**Built with Groq LLM for AgentPay Protocol**
