"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TradingPair } from "../types/trading"

interface PriceCalculatorProps {
  selectedPair: TradingPair
}

export default function PriceCalculator({ selectedPair }: PriceCalculatorProps) {
  const [tradeAmount, setTradeAmount] = useState("")
  const [tradeType, setTradeType] = useState("buy")
  const [priceImpact, setPriceImpact] = useState(0)

  // Calculate price impact
  useEffect(() => {
    if (tradeAmount) {
      const amount = Number.parseFloat(tradeAmount)
      const impact = (amount / 100000) * 100 // Simple calculation
      setPriceImpact(Math.min(impact, 10))
    } else {
      setPriceImpact(0)
    }
  }, [tradeAmount])

  const handleSimulateTrade = () => {
    if (tradeAmount) {
      alert(
        `Simulated ${tradeType} order for ${tradeAmount} USDT at ${selectedPair.price.toFixed(6)} with ${priceImpact.toFixed(2)}% price impact`,
      )
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Price Impact Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="trade-type" className="text-gray-200">
                Trade Type
              </Label>
              <Select value={tradeType} onValueChange={setTradeType}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="buy" className="text-white hover:bg-gray-600">
                    Buy
                  </SelectItem>
                  <SelectItem value="sell" className="text-white hover:bg-gray-600">
                    Sell
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount" className="text-gray-200">
                Trade Amount (USDT)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label className="text-gray-200">Trading Pair</Label>
              <div className="p-3 bg-gray-700 rounded-md">
                <span className="text-white font-semibold">{selectedPair.symbol}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Trade Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Current Price:</span>
                  <span className="text-white font-mono">${selectedPair.price.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Estimated Price Impact:</span>
                  <span className={priceImpact > 5 ? "text-red-400" : "text-green-400"}>{priceImpact.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Estimated Fill Price:</span>
                  <span className="text-white font-mono">
                    ${(selectedPair.price * (1 + (tradeType === "buy" ? priceImpact : -priceImpact) / 100)).toFixed(6)}
                  </span>
                </div>
                {tradeAmount && (
                  <div className="flex justify-between font-semibold border-t border-gray-600 pt-2">
                    <span className="text-gray-300">You will {tradeType === "buy" ? "receive" : "pay"}:</span>
                    <span className="text-white font-mono">
                      {tradeType === "buy"
                        ? `${(Number.parseFloat(tradeAmount) / selectedPair.price).toFixed(2)} HPX`
                        : `${(Number.parseFloat(tradeAmount) * selectedPair.price).toFixed(2)} USDT`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Button className="w-full" disabled={!tradeAmount} onClick={handleSimulateTrade}>
              Simulate {tradeType.charAt(0).toUpperCase() + tradeType.slice(1)} Order
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
