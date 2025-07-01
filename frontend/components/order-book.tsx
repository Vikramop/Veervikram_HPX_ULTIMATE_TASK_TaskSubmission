"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OrderBook } from "../types/trading"

interface OrderBookProps {
  orderBook: OrderBook
}

export default function OrderBookComponent({ orderBook }: OrderBookProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-red-400">Sell Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-300 pb-2 border-b border-gray-700">
              <span>Price</span>
              <span>Amount</span>
              <span>Total</span>
            </div>
            {orderBook.asks.slice(0, 10).map((ask, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 text-sm hover:bg-gray-700 p-1 rounded transition-colors"
              >
                <span className="text-red-400 font-mono">{ask.price}</span>
                <span className="text-gray-200">{ask.amount}</span>
                <span className="text-gray-200">{ask.total}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-green-400">Buy Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-300 pb-2 border-b border-gray-700">
              <span>Price</span>
              <span>Amount</span>
              <span>Total</span>
            </div>
            {orderBook.bids.slice(0, 10).map((bid, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 text-sm hover:bg-gray-700 p-1 rounded transition-colors"
              >
                <span className="text-green-400 font-mono">{bid.price}</span>
                <span className="text-gray-200">{bid.amount}</span>
                <span className="text-gray-200">{bid.total}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
