const { tokens, routes } = require('../data/liquidityData');
const { calculateFees, determineRoute } = require('./feeService');

async function getQuote(fromToken, toToken, amountIn) {
  if (!tokens[fromToken] || !tokens[toToken]) {
    throw new Error('Invalid tokens.');
  }
  if (amountIn > tokens[fromToken].liquidity) {
    throw new Error('Amount exceeds available liquidity.');
  }

  const route = determineRoute(fromToken, toToken);
  const { estimatedAmountOut, totalFee } = calculateFees(route, amountIn);

  return {
    estimatedAmountOut,
    executionRoute: route.map((step) => `${step.from} → ${step.to}`),
    estimatedFees: totalFee,
    slippageImpact: ((amountIn - estimatedAmountOut) / amountIn) * 100,
  };
}

module.exports = { getQuote };
