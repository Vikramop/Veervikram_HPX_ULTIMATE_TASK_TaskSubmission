const express = require('express');
const { getQuote } = require('../services/quoteService');
const router = express.Router();

router.post('/quote', async (req, res) => {
  try {
    const { fromToken, toToken, amountIn } = req.body;
    const quote = await getQuote(fromToken, toToken, amountIn);
    res.json(quote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
