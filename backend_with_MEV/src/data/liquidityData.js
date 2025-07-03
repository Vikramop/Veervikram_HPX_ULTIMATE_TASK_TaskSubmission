module.exports = {
  tokens: {
    HPX: { price: 1, liquidity: 10000 },
    HYPERLIQUID: { price: 0.5, liquidity: 8000 },
    USDT: { price: 1, liquidity: 20000 },
    ETH: { price: 5, liquidity: 200000 },
    SOL: { price: 2.5, liquidity: 100000 },
  },
  routes: [
    { from: 'HPX', to: 'HYPERLIQUID', fee: 0.003 },
    { from: 'HYPERLIQUID', to: 'USDT', fee: 0.002 },
    { from: 'ETH', to: 'SOL', fee: 0.001 },
  ],
};
