export interface TradingPair {
  symbol: string
  price: number
  change: number
  volume: string
}

export interface CandlestickData {
  time: string
  open: string
  high: string
  low: string
  close: string
  volume: number
}

export interface OrderBookEntry {
  price: string
  amount: string
  total: string
}

export interface OrderBook {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
}

export interface Trade {
  id: number
  price: string
  amount: string
  time: string
  type: "buy" | "sell"
}
