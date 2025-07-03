let privateQueue = [];

function addToQueue(trade) {
  privateQueue.push({ ...trade, createdAt: Date.now() });
}

function processQueue() {
  const now = Date.now();
  const executed = privateQueue.filter((t) => now - t.createdAt > 10000);
  privateQueue = privateQueue.filter((t) => now - t.createdAt <= 10000);
  return executed;
}

module.exports = { addToQueue, processQueue };
