'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import TradingViewChart from './tradingview-chart';
import type { TradingPair } from '../types/trading';
import type { ChartData } from '../types/chart';
import AdvancedChartControls from './advanced-chart-controls';

interface PriceChartProps {
  selectedPair: TradingPair;
  candlestickData: ChartData[];
}

export default function PriceChart({
  selectedPair,
  candlestickData,
}: PriceChartProps) {
  const [chartType, setChartType] = useState('candlestick');
  const [timeframe, setTimeframe] = useState('1D');
  const [indicators, setIndicators] = useState<string[]>([]);

  // Create simple data format for Recharts - ensure all values are numbers
  const simpleChartData = candlestickData
    .map((item, index) => {
      const price =
        typeof item.close === 'number'
          ? item.close
          : Number.parseFloat(item.close.toString());
      return {
        index: index,
        name: `Point ${index + 1}`,
        price: price,
        formattedPrice: price.toFixed(6),
      };
    })
    .filter((item) => !isNaN(item.price)); // Remove any NaN values

  // console.log('Chart data length:', simpleChartData.length);
  // console.log('Sample data:', simpleChartData.slice(0, 3));

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">
          Price Charts - {selectedPair.symbol}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AdvancedChartControls
          selectedPair={selectedPair}
          chartType={chartType}
          onChartTypeChange={setChartType}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          indicators={indicators}
          onIndicatorsChange={setIndicators}
        />
        <Tabs defaultValue="tradingview" className="space-y-4">
          <TabsList className="bg-gray-700">
            <TabsTrigger value="tradingview">TradingView Pro</TabsTrigger>
            <TabsTrigger value="line">Simple Line</TabsTrigger>
          </TabsList>

          <TabsContent value="tradingview">
            <div className="h-[500px] bg-gray-900 rounded-lg border border-gray-600 overflow-hidden">
              <TradingViewChart
                selectedPair={selectedPair}
                chartType={chartType}
                timeframe={timeframe}
                indicators={indicators}
              />
            </div>
          </TabsContent>

          <TabsContent value="line">
            <div className="h-96 bg-gray-900 rounded-lg p-4 border border-gray-600">
              <div className="mb-2 text-sm text-gray-400">
                Data points: {simpleChartData.length} | Current price: $
                {selectedPair.price.toFixed(6)}
              </div>

              {simpleChartData.length > 0 ? (
                <div style={{ width: '100%', height: '320px' }}>
                  <ResponsiveContainer>
                    <LineChart
                      data={simpleChartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="index"
                        stroke="#9CA3AF"
                        fontSize={12}
                        type="number"
                        domain={['dataMin', 'dataMax']}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        fontSize={12}
                        domain={['dataMin - 0.0001', 'dataMax + 0.0001']}
                        tickFormatter={(value) => `$${value.toFixed(4)}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '6px',
                          color: '#fff',
                        }}
                        formatter={(value: any) => [
                          `$${Number.parseFloat(value).toFixed(6)}`,
                          'Price',
                        ]}
                        labelFormatter={(label) => `Point ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#10B981' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                    <p>Loading chart data...</p>
                    <p className="text-xs mt-1">Waiting for price data</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
