# 🧠 Swap Router Backend (with Anti-MEV Simulation)

This backend simulates a decentralized exchange (DEX) swap engine. It provides swap quotes, supports multi-hop routing, fee calculations, and includes optional anti-MEV protection mechanisms.

---

## 📦 Tech Stack

- Node.js + Express
- Hardcoded token pool & pricing logic
- In-memory queue for MEV simulations
- `ethers` for hashing (Commit-Reveal)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the server

```bash
node app.js
```

Server runs at:
http://localhost:3000

### 📘 API Endpoints

#### 🔁 POST /api/swap/quote

Request

```bash
{
  "fromToken": "HPX",
  "toToken": "USDT",
  "amountIn": 100
}
```

Response

```bash
{
  "estimatedAmountOut": 99.1,
  "executionRoute": ["HPX → HYPERLIQUID", "HYPERLIQUID → USDT"],
  "estimatedFees": 0.9,
  "slippageImpact": 0.9
}
```

## 🛡️ Anti-MEV Protection Features

## ⏳ 1. Time-Locked Execution

Simulates a 15-second delay between initiating a swap and executing it.

```bash
POST /api/swap/confirm
```

## 🔐 2. Commit-Reveal Flow

```bash
POST /api/swap/commit

```

## 📥 3. Private Execution Queue

```bash
POST /api/swap/queue
```

# HPX Contracts Deployment

This Section contains and deploys three interconnected smart contracts:

- `HPXAccessControl`: Custom role-based permissions using OpenZeppelin's `AccessControl`
- `HPXToken`: ERC20 token with minting and fee logic, depends on `HPXAccessControl`
- `FeeManager`: Simple fee collection contract

Deployment and verification is done using **Hardhat**, **Ethers v6**, and Sepolia testnet.

---

---

## ⚙️ Prerequisites

- Node.js ≥ 16
- [Hardhat](https://hardhat.org/)
- Infura or Alchemy account (for Sepolia RPC)
- Sepolia testnet ETH (get from [faucet](https://sepoliafaucet.com/))

---

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create .env File

```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 3. 🛠 Build Contracts

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 4. 📤 Deploy to Sepolia and verfy

```bash
npx hardhat run scripts/deploy.js --network sepolia
```
