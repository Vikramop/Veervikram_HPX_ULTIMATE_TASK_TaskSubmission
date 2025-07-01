"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, LineChart, CandlestickChart } from "lucide-react"

interface AdvancedChartControlsProps {
  selectedPair: any
  chartType: string
  onChartTypeChange: (type: string) => void
  timeframe: string
  onTimeframeChange: (timeframe: string) => void
  indicators: string[]
  onIndicatorsChange: (indicators: string[]) => void
}

export default function AdvancedChartControls({
  selectedPair,
  chartType,
  onChartTypeChange,
  timeframe,
  onTimeframeChange,
  indicators,
  onIndicatorsChange,
}: AdvancedChartControlsProps) {
  const timeframes = [
    { value: "1m", label: "1m" },
    { value: "5m", label: "5m" },
    { value: "15m", label: "15m" },
    { value: "1h", label: "1h" },
    { value: "4h", label: "4h" },
    { value: "1D", label: "1D" },
    { value: "1W", label: "1W" },
  ]

  const availableIndicators = ["RSI", "MACD", "Bollinger Bands", "Moving Average", "Volume", "Stochastic"]

  const toggleIndicator = (indicator: string) => {
    const newIndicators = indicators.includes(indicator)
      ? indicators.filter((i) => i !== indicator)
      : [...indicators, indicator]
    onIndicatorsChange(newIndicators)
  }

  return (
    <div className="space-y-4">
      {/* Chart Type Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-300 text-sm">Chart Type:</span>
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant={chartType === "candlestick" ? "default" : "outline"}
            onClick={() => onChartTypeChange("candlestick")}
            className="p-2"
          >
            <CandlestickChart className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={chartType === "line" ? "default" : "outline"}
            onClick={() => onChartTypeChange("line")}
            className="p-2"
          >
            <LineChart className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={chartType === "area" ? "default" : "outline"}
            onClick={() => onChartTypeChange("area")}
            className="p-2"
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-300 text-sm">Timeframe:</span>
        <div className="flex space-x-1">
          {timeframes.map((tf) => (
            <Button
              key={tf.value}
              size="sm"
              variant={tf.value === timeframe ? "default" : "outline"}
              className="px-2 py-1 text-xs"
              onClick={() => onTimeframeChange(tf.value)}
            >
              {tf.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Technical Indicators */}
      <div className="space-y-2">
        <span className="text-gray-300 text-sm">Technical Indicators:</span>
        <div className="flex flex-wrap gap-2">
          {availableIndicators.map((indicator) => (
            <Badge
              key={indicator}
              variant={indicators.includes(indicator) ? "default" : "outline"}
              className="cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => toggleIndicator(indicator)}
            >
              {indicator}
            </Badge>
          ))}
        </div>
        {indicators.length > 0 && <div className="text-xs text-green-400">Active: {indicators.join(", ")}</div>}
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-700 rounded-lg">
        <div className="text-center">
          <p className="text-gray-400 text-xs">24h High</p>
          <p className="text-white font-mono text-sm">${(selectedPair.price * 1.05).toFixed(6)}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs">24h Low</p>
          <p className="text-white font-mono text-sm">${(selectedPair.price * 0.95).toFixed(6)}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs">24h Volume</p>
          <p className="text-white font-mono text-sm">{selectedPair.volume}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs">Market Cap</p>
          <p className="text-white font-mono text-sm">$45.2M</p>
        </div>
      </div>
    </div>
  )
}
