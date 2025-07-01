"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Trade } from "../types/trading"

interface RecentTradesProps {
  recentTrades: Trade[]
}

export default function RecentTrades({ recentTrades }: RecentTradesProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Trades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="grid grid-cols-4 gap-4 text-xs text-gray-300 pb-2 border-b border-gray-700">
            <span>Time</span>
            <span>Price</span>
            <span>Amount</span>
            <span>Type</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {recentTrades.map((trade) => (
              <div
                key={trade.id}
                className="grid grid-cols-4 gap-4 text-sm hover:bg-gray-700 p-2 rounded transition-colors"
              >
                <span className="text-gray-200">{trade.time}</span>
                <span className={`font-mono ${trade.type === "buy" ? "text-green-400" : "text-red-400"}`}>
                  {trade.price}
                </span>
                <span className="text-gray-200">{trade.amount}</span>
                <Badge variant={trade.type === "buy" ? "default" : "destructive"} className="w-fit text-xs">
                  {trade.type.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
