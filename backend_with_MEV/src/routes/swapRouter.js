const express = require('express');
const { getQuote } = require('../services/quoteService');
const { addToQueue, processQueue } = require('../services/queueService');
const { keccak256, toUtf8Bytes } = require('ethers');

const router = express.Router();

const delayedSwaps = new Map(); // { txId: { quoteData, createdAt } }
const pendingCommits = new Map(); // { hash: { expiresAt } }

// POST /api/swap/quote
router.post('/quote', async (req, res) => {
  try {
    const { fromToken, toToken, amountIn } = req.body;
    const quote = await getQuote(fromToken, toToken, amountIn);
    const txId = Date.now().toString();
    delayedSwaps.set(txId, { quoteData: quote, createdAt: Date.now() });
    res.json({ txId, quote });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/swap/confirm (Time-lock)
router.post('/confirm', (req, res) => {
  const { txId } = req.body;
  const swap = delayedSwaps.get(txId);
  if (!swap) return res.status(404).json({ error: 'Invalid txId' });

  const diff = (Date.now() - swap.createdAt) / 1000;
  if (diff < 15) {
    return res.status(400).json({ error: `Wait ${15 - Math.floor(diff)}s` });
  }

  delayedSwaps.delete(txId);
  return res.json({ status: 'Swap Executed', data: swap.quoteData });
});

// POST /api/swap/commit (Commit phase)
router.post('/commit', (req, res) => {
  const { hash, expiresIn } = req.body;
  pendingCommits.set(hash, { expiresAt: Date.now() + expiresIn * 1000 });
  res.json({
    status: 'Commit stored',
    validUntil: pendingCommits.get(hash).expiresAt,
  });
});

// POST /api/swap/reveal (Reveal phase)
// router.post('/reveal', async (req, res) => {
//   const { fromToken, toToken, amountIn, secret } = req.body;
//   const hash = keccak256(
//     toUtf8Bytes(`${fromToken}:${toToken}:${amountIn}:${secret}`)
//   );

//   const commit = pendingCommits.get(hash);

//   if (!commit || Date.now() > commit.expiresAt) {
//     return res.status(400).json({ error: 'Invalid or expired commit' });
//   }

//   pendingCommits.delete(hash);
//   const quote = await getQuote(fromToken, toToken, amountIn);
//   res.json({ status: 'Revealed and Executed', data: quote });
// });

router.post('/reveal', async (req, res) => {
  const { fromToken, toToken, amountIn, secret } = req.body;
  const input = `${fromToken}:${toToken}:${amountIn}:${secret}`;
  const hash = keccak256(toUtf8Bytes(input));

  console.log('REVEAL LOG >>>');
  console.log('Input used to compute hash:', input);
  console.log('Computed hash:', hash);
  console.log('Found in pendingCommits:', pendingCommits.has(hash));

  const commit = pendingCommits.get(hash);

  if (!commit || Date.now() > commit.expiresAt) {
    return res.status(400).json({ error: 'Invalid or expired commit' });
  }

  pendingCommits.delete(hash);
  const quote = await getQuote(fromToken, toToken, amountIn);
  res.json({ status: 'Revealed and Executed', data: quote });
});

// POST /api/swap/queue (Add to private queue)
router.post('/queue', (req, res) => {
  addToQueue(req.body);
  res.json({ status: 'Added to private queue' });
});

// POST /api/swap/processQueue (Batch process)
router.post('/processQueue', (req, res) => {
  const batch = processQueue();
  res.json({ status: 'Processed', batch });
});

module.exports = router;
