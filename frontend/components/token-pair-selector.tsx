"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import type { TradingPair } from "../types/trading"

interface TokenPairSelectorProps {
  tradingPairs: TradingPair[]
  selectedPair: TradingPair
  onSelectPair: (pair: TradingPair) => void
}

export default function TokenPairSelector({ tradingPairs, selectedPair, onSelectPair }: TokenPairSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tradingPairs.map((pair) => (
        <Button
          key={pair.symbol}
          variant={selectedPair.symbol === pair.symbol ? "default" : "outline"}
          onClick={() => onSelectPair(pair)}
          className="flex flex-col items-start p-3 h-auto transition-all hover:scale-105"
        >
          <span className="font-semibold">{pair.symbol}</span>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono">${pair.price.toFixed(6)}</span>
            <span className={`flex items-center ${pair.change >= 0 ? "text-green-400" : "text-red-400"}`}>
              {pair.change >= 0 ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
              {Math.abs(pair.change).toFixed(2)}%
            </span>
          </div>
        </Button>
      ))}
    </div>
  )
}
