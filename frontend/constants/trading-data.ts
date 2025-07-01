import type { TradingPair, CandlestickData, OrderBook, Trade, OrderBookEntry } from "../types/trading"

export const TRADING_PAIRS: TradingPair[] = [
  { symbol: "HPX/USDT", price: 0.0234, change: 5.67, volume: "2.4M" },
  { symbol: "SOL/ETH", price: 0.0891, change: -2.34, volume: "1.8M" },
  { symbol: "BTC/USDT", price: 43250.5, change: 3.21, volume: "890K" },
  { symbol: "ETH/USDT", price: 2650.75, change: -1.45, volume: "1.2M" },
]

export const generateCandlestickData = (): CandlestickData[] => {
  const data: CandlestickData[] = []
  let basePrice = 0.0234

  for (let i = 0; i < 50; i++) {
    const open = basePrice + (Math.random() - 0.5) * 0.002
    const close = open + (Math.random() - 0.5) * 0.001
    const high = Math.max(open, close) + Math.random() * 0.0005
    const low = Math.min(open, close) - Math.random() * 0.0005

    data.push({
      time: new Date(Date.now() - (49 - i) * 60000).toLocaleTimeString(),
      open: open.toFixed(6),
      high: high.toFixed(6),
      low: low.toFixed(6),
      close: close.toFixed(6),
      volume: Math.floor(Math.random() * 10000),
    })

    basePrice = close
  }

  return data
}

export const generateOrderBookData = (): OrderBook => {
  const bids: OrderBookEntry[] = []
  const asks: OrderBookEntry[] = []
  const basePrice = 0.0234

  for (let i = 0; i < 15; i++) {
    bids.push({
      price: (basePrice - i * 0.00001).toFixed(6),
      amount: (Math.random() * 10000).toFixed(2),
      total: (Math.random() * 50000).toFixed(2),
    })

    asks.push({
      price: (basePrice + i * 0.00001).toFixed(6),
      amount: (Math.random() * 10000).toFixed(2),
      total: (Math.random() * 50000).toFixed(2),
    })
  }

  return { bids, asks }
}

export const generateRecentTrades = (): Trade[] => {
  const trades: Trade[] = []
  const basePrice = 0.0234

  for (let i = 0; i < 20; i++) {
    const price = basePrice + (Math.random() - 0.5) * 0.0001
    trades.push({
      id: i,
      price: price.toFixed(6),
      amount: (Math.random() * 1000).toFixed(2),
      time: new Date(Date.now() - i * 30000).toLocaleTimeString(),
      type: Math.random() > 0.5 ? "buy" : "sell",
    })
  }

  return trades
}
