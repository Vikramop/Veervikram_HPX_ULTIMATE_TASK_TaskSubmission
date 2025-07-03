'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Import components
import TokenPairSelector from './components/token-pair-selector';
import PriceChart from './components/price-chart';
import OrderBookComponent from './components/order-book';
import RecentTrades from './components/recent-trades';
import PriceCalculator from './components/price-calculator';

// Import constants and types
import {
  TRADING_PAIRS,
  generateCandlestickData,
  generateOrderBookData,
  generateRecentTrades,
} from './constants/trading-data';
import type { TradingPair } from './types/trading';

export default function TradingInterface() {
  const [selectedPair, setSelectedPair] = useState<TradingPair>(
    TRADING_PAIRS[0]
  );
  const [candlestickData, setCandlestickData] = useState(
    generateCandlestickData()
  );
  const [orderBook, setOrderBook] = useState(generateOrderBookData());
  const [recentTrades, setRecentTrades] = useState(generateRecentTrades());

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderBook(generateOrderBookData());
      setRecentTrades(generateRecentTrades());

      // Update selected pair price
      setSelectedPair((prev) => ({
        ...prev,
        price: prev.price + (Math.random() - 0.5) * 0.0001,
        change: prev.change + (Math.random() - 0.5) * 0.5,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Crypto Trading Dashboard</h1>
          <TokenPairSelector
            tradingPairs={TRADING_PAIRS}
            selectedPair={selectedPair}
            onSelectPair={setSelectedPair}
          />
        </div>

        {/* Current Pair Info */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Price</p>
                <p className="text-2xl font-bold font-mono text-[#f5dfbb]">
                  ${selectedPair.price.toFixed(6)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">24h Change</p>
                <p
                  className={`text-xl font-semibold flex items-center gap-1 ${
                    selectedPair.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {selectedPair.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {selectedPair.change.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">24h Volume</p>
                <p className="text-xl font-semibold text-[#f5dfbb]">
                  {selectedPair.volume}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Market Cap</p>
                <p className="text-xl font-semibold text-[#f5dfbb]">$45.2M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Trading Interface */}
        <Tabs defaultValue="chart" className="space-y-6 ">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 ">
            <TabsTrigger
              value="chart"
              className="max-sm:text-[12px] max-sm:px-2"
            >
              Price Chart
            </TabsTrigger>
            <TabsTrigger
              value="orderbook"
              className="max-sm:text-[12px] max-sm:px-2"
            >
              Order Book
            </TabsTrigger>
            <TabsTrigger
              value="trades"
              className="max-sm:text-[12px] max-sm:px-2"
            >
              Recent Trades
            </TabsTrigger>
            <TabsTrigger
              value="calculator"
              className="max-sm:text-[12px] max-sm:px-2"
            >
              Price Calculator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
            <PriceChart
              selectedPair={selectedPair}
              candlestickData={candlestickData}
            />
          </TabsContent>

          <TabsContent value="orderbook">
            <OrderBookComponent orderBook={orderBook} />
          </TabsContent>

          <TabsContent value="trades">
            <RecentTrades recentTrades={recentTrades} />
          </TabsContent>

          <TabsContent value="calculator">
            <PriceCalculator selectedPair={selectedPair} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
