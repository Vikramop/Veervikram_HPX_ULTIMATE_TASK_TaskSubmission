const { routes, tokens } = require('../data/liquidityData');

function calculateFees(route, amountIn) {
  let totalFee = 0;
  let currentAmount = amountIn;

  route.forEach((step) => {
    const fee = currentAmount * step.fee;
    totalFee += fee;
    currentAmount -= fee;
    currentAmount *= tokens[step.to].price / tokens[step.from].price;
  });

  return { estimatedAmountOut: currentAmount, totalFee };
}

function determineRoute(fromToken, toToken) {
  if (fromToken === 'HPX' && toToken === 'USDT') {
    return routes.filter((r) => r.from === 'HPX' || r.to === 'USDT');
  }
  return routes.filter((r) => r.from === fromToken && r.to === toToken);
}

module.exports = { calculateFees, determineRoute };
