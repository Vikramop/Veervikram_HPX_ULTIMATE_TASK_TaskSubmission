'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
} from 'lightweight-charts';
import type { TradingPair } from '../types/trading';

interface TradingViewChartProps {
  selectedPair: TradingPair;
  chartType: string;
  timeframe: string;
  indicators: string[];
}

// Technical indicator calculations
const calculateSMA = (data: any[], period: number) => {
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data
      .slice(i - period + 1, i + 1)
      .reduce((acc, curr) => acc + curr.close, 0);
    result.push({
      time: data[i].time,
      value: Number((sum / period).toFixed(6)),
    });
  }
  return result;
};

const calculateRSI = (data: any[], period = 14) => {
  const result = [];
  const gains = [];
  const losses = [];

  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  for (let i = period - 1; i < gains.length; i++) {
    const avgGain =
      gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    const avgLoss =
      losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    const rs = avgGain / (avgLoss || 0.0001);
    const rsi = 100 - 100 / (1 + rs);

    result.push({
      time: data[i + 1].time,
      value: Number(rsi.toFixed(2)),
    });
  }
  return result;
};

const calculateMACD = (
  data: any[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
) => {
  const ema12 = calculateEMA(data, fastPeriod);
  const ema26 = calculateEMA(data, slowPeriod);
  const macdLine = [];

  const startIndex =
    Math.max(ema12.length, ema26.length) - Math.min(ema12.length, ema26.length);

  for (let i = startIndex; i < Math.min(ema12.length, ema26.length); i++) {
    macdLine.push({
      time: ema12[i].time,
      value: ema12[i].value - ema26[i - startIndex].value,
    });
  }

  const signalLine = calculateEMAFromValues(macdLine, signalPeriod);

  return { macdLine, signalLine };
};

const calculateEMA = (data: any[], period: number) => {
  const result = [];
  const multiplier = 2 / (period + 1);
  let ema = data[0].close;

  result.push({ time: data[0].time, value: ema });

  for (let i = 1; i < data.length; i++) {
    ema = data[i].close * multiplier + ema * (1 - multiplier);
    result.push({
      time: data[i].time,
      value: Number(ema.toFixed(6)),
    });
  }

  return result;
};

const calculateEMAFromValues = (data: any[], period: number) => {
  const result = [];
  const multiplier = 2 / (period + 1);
  let ema = data[0].value;

  for (let i = period - 1; i < data.length; i++) {
    if (i === period - 1) {
      ema =
        data.slice(0, period).reduce((sum, item) => sum + item.value, 0) /
        period;
    } else {
      ema = data[i].value * multiplier + ema * (1 - multiplier);
    }

    result.push({
      time: data[i].time,
      value: Number(ema.toFixed(6)),
    });
  }

  return result;
};

const calculateBollingerBands = (data: any[], period = 20, stdDev = 2) => {
  const sma = calculateSMA(data, period);
  const upperBand = [];
  const lowerBand = [];

  for (let i = 0; i < sma.length; i++) {
    const dataIndex = i + period - 1;
    const slice = data.slice(dataIndex - period + 1, dataIndex + 1);
    const mean = sma[i].value;
    const variance =
      slice.reduce((sum, item) => sum + Math.pow(item.close - mean, 2), 0) /
      period;
    const standardDeviation = Math.sqrt(variance);

    upperBand.push({
      time: sma[i].time,
      value: Number((mean + stdDev * standardDeviation).toFixed(6)),
    });

    lowerBand.push({
      time: sma[i].time,
      value: Number((mean - stdDev * standardDeviation).toFixed(6)),
    });
  }

  return { upperBand, lowerBand, middleBand: sma };
};

const calculateStochastic = (data: any[], kPeriod = 14, dPeriod = 3) => {
  const kValues = [];

  for (let i = kPeriod - 1; i < data.length; i++) {
    const slice = data.slice(i - kPeriod + 1, i + 1);
    const highest = Math.max(...slice.map((item) => item.high));
    const lowest = Math.min(...slice.map((item) => item.low));
    const current = data[i].close;

    const k = ((current - lowest) / (highest - lowest)) * 100;

    kValues.push({
      time: data[i].time,
      value: Number(k.toFixed(2)),
    });
  }

  const dValues = calculateSMAFromValues(kValues, dPeriod);

  return { kLine: kValues, dLine: dValues };
};

const calculateSMAFromValues = (data: any[], period: number) => {
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data
      .slice(i - period + 1, i + 1)
      .reduce((acc, curr) => acc + curr.value, 0);
    result.push({
      time: data[i].time,
      value: Number((sum / period).toFixed(2)),
    });
  }
  return result;
};

// Generate realistic OHLCV data based on timeframe
const generateOHLCVData = (
  basePrice: number,
  timeframe: string,
  days = 100
) => {
  const data = [];
  const volumeData = [];
  let currentPrice = basePrice;

  const getDataPoints = () => {
    switch (timeframe) {
      case '1m':
        return 200;
      case '5m':
        return 180;
      case '15m':
        return 160;
      case '1h':
        return 140;
      case '4h':
        return 120;
      case '1D':
        return 100;
      case '1W':
        return 50;
      default:
        return 100;
    }
  };

  const getTimeInterval = () => {
    switch (timeframe) {
      case '1m':
        return 60;
      case '5m':
        return 300;
      case '15m':
        return 900;
      case '1h':
        return 3600;
      case '4h':
        return 14400;
      case '1D':
        return 86400;
      case '1W':
        return 604800;
      default:
        return 86400;
    }
  };

  const dataPoints = getDataPoints();
  const timeInterval = getTimeInterval();
  const startTime = Math.floor(Date.now() / 1000) - dataPoints * timeInterval;

  for (let i = 0; i < dataPoints; i++) {
    const time = startTime + i * timeInterval;
    const volatility = 0.02 + Math.random() * 0.03;

    const open = currentPrice;
    const change = (Math.random() - 0.5) * volatility * open;
    const close = Math.max(open + change, 0.0001);

    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);

    const volume = Math.floor(Math.random() * 1000000) + 100000;

    data.push({
      time: time as any,
      open: Number(open.toFixed(6)),
      high: Number(high.toFixed(6)),
      low: Number(low.toFixed(6)),
      close: Number(close.toFixed(6)),
    });

    volumeData.push({
      time: time as any,
      value: volume,
      color: close > open ? '#26a69a' : '#ef5350',
    });

    currentPrice = close;
  }

  return { candlestickData: data, volumeData };
};

export default function TradingViewChart({
  selectedPair,
  chartType,
  timeframe,
  indicators,
}: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any[]>([]);
  const mountedRef = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if volume should be shown
  const showVolume = indicators.includes('Volume');

  // Debounced chart update
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  const safeExecute = useCallback(
    (operation: () => void, errorMessage: string) => {
      if (!mountedRef.current || !chartRef.current) return;

      try {
        operation();
      } catch (err) {
        console.warn(`${errorMessage}:`, err);
      }
    },
    []
  );

  const clearAllSeries = useCallback(() => {
    if (!chartRef.current) return;

    seriesRef.current.forEach((series) => {
      safeExecute(() => {
        if (series && chartRef.current) {
          chartRef.current.removeSeries(series);
        }
      }, 'Error removing series');
    });
    seriesRef.current = [];
  }, [safeExecute]);

  const updateChartData = useCallback(() => {
    if (!chartRef.current || !mountedRef.current) return;
    setIsLoading(true);
    setError(null);

    try {
      // Clear existing series
      clearAllSeries();

      // Update watermark
      safeExecute(() => {
        chartRef.current.applyOptions({
          watermark: {
            visible: true,
            fontSize: 24,
            horzAlign: 'center',
            vertAlign: 'center',
            color: 'rgba(171, 71, 188, 0.3)',
            text: `${selectedPair.symbol} - ${timeframe}`,
          },
        });
      }, 'Error updating watermark');

      // Generate new data
      const { candlestickData, volumeData } = generateOHLCVData(
        selectedPair.price,
        timeframe
      );

      // Add main series
      let mainSeries;
      if (chartType === 'candlestick') {
        mainSeries = chartRef.current.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderDownColor: '#ef5350',
          borderUpColor: '#26a69a',
          wickDownColor: '#ef5350',
          wickUpColor: '#26a69a',
        });
        mainSeries.setData(candlestickData);
      } else if (chartType === 'line') {
        mainSeries = chartRef.current.addLineSeries({
          color: '#2196F3',
          lineWidth: 2,
        });
        const lineData = candlestickData.map((item) => ({
          time: item.time,
          value: item.close,
        }));
        mainSeries.setData(lineData);
      } else if (chartType === 'area') {
        mainSeries = chartRef.current.addAreaSeries({
          topColor: 'rgba(33, 150, 243, 0.56)',
          bottomColor: 'rgba(33, 150, 243, 0.04)',
          lineColor: 'rgba(33, 150, 243, 1)',
          lineWidth: 2,
        });
        const areaData = candlestickData.map((item) => ({
          time: item.time,
          value: item.close,
        }));
        mainSeries.setData(areaData);
      }

      if (mainSeries) {
        seriesRef.current.push(mainSeries);
      }

      // Add volume series if Volume indicator is selected
      if (showVolume) {
        const volumeSeries = chartRef.current.addHistogramSeries({
          color: '#26a69a',
          priceFormat: { type: 'volume' },
          priceScaleId: '',
          scaleMargins: { top: 0.7, bottom: 0 },
        });
        volumeSeries.setData(volumeData);
        seriesRef.current.push(volumeSeries);
      }

      // Add Moving Average
      if (
        indicators.includes('Moving Average') &&
        candlestickData.length > 20
      ) {
        const maData = calculateSMA(candlestickData, 20);
        const maSeries = chartRef.current.addLineSeries({
          color: '#FF6B35',
          lineWidth: 2,
        });
        maSeries.setData(maData);
        seriesRef.current.push(maSeries);
      }

      // Add RSI
      if (indicators.includes('RSI') && candlestickData.length > 14) {
        const rsiData = calculateRSI(candlestickData, 14);
        const rsiSeries = chartRef.current.addLineSeries({
          color: '#9C27B0',
          lineWidth: 2,
          priceScaleId: 'rsi',
          scaleMargins: { top: 0.1, bottom: 0.8 },
        });
        rsiSeries.setData(rsiData);
        seriesRef.current.push(rsiSeries);
      }

      // Add MACD
      if (indicators.includes('MACD') && candlestickData.length > 26) {
        const { macdLine, signalLine } = calculateMACD(candlestickData);

        const macdSeries = chartRef.current.addLineSeries({
          color: '#00BCD4',
          lineWidth: 2,
          priceScaleId: 'macd',
          scaleMargins: { top: 0.1, bottom: 0.8 },
        });
        macdSeries.setData(macdLine);
        seriesRef.current.push(macdSeries);

        const signalSeries = chartRef.current.addLineSeries({
          color: '#FF5722',
          lineWidth: 2,
          priceScaleId: 'macd',
          scaleMargins: { top: 0.1, bottom: 0.8 },
        });
        signalSeries.setData(signalLine);
        seriesRef.current.push(signalSeries);
      }

      // Add Bollinger Bands
      if (
        indicators.includes('Bollinger Bands') &&
        candlestickData.length > 20
      ) {
        const { upperBand, lowerBand, middleBand } = calculateBollingerBands(
          candlestickData,
          20,
          2
        );

        const upperSeries = chartRef.current.addLineSeries({
          color: '#E91E63',
          lineWidth: 1,
        });
        upperSeries.setData(upperBand);
        seriesRef.current.push(upperSeries);

        const lowerSeries = chartRef.current.addLineSeries({
          color: '#E91E63',
          lineWidth: 1,
        });
        lowerSeries.setData(lowerBand);
        seriesRef.current.push(lowerSeries);

        const middleSeries = chartRef.current.addLineSeries({
          color: '#E91E63',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
        });
        middleSeries.setData(middleBand);
        seriesRef.current.push(middleSeries);
      }

      // Add Stochastic
      if (indicators.includes('Stochastic') && candlestickData.length > 14) {
        const { kLine, dLine } = calculateStochastic(candlestickData, 14, 3);

        const kSeries = chartRef.current.addLineSeries({
          color: '#4CAF50',
          lineWidth: 2,
          priceScaleId: 'stoch',
          scaleMargins: { top: 0.1, bottom: 0.8 },
        });
        kSeries.setData(kLine);
        seriesRef.current.push(kSeries);

        const dSeries = chartRef.current.addLineSeries({
          color: '#FF9800',
          lineWidth: 2,
          priceScaleId: 'stoch',
          scaleMargins: { top: 0.1, bottom: 0.8 },
        });
        dSeries.setData(dLine);
        seriesRef.current.push(dSeries);
      }

      // Fit content with delay
      setTimeout(() => {
        safeExecute(() => {
          if (chartRef.current) {
            chartRef.current.timeScale().fitContent();
          }
        }, 'Error fitting content');
      }, 100);

      setIsLoading(false);
    } catch (err) {
      console.error('Error updating chart data:', err);
      setError('Failed to update chart');
      setIsLoading(false);
    }
  }, [
    selectedPair,
    chartType,
    timeframe,
    indicators,
    showVolume,
    clearAllSeries,
    safeExecute,
  ]);

  // Chart initialization effect
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart instance and assign to ref
    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1f2937' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#555',
      },
      timeScale: {
        borderColor: '#555',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    mountedRef.current = true;

    // Initial chart data render
    updateChartData();

    // Cleanup on unmount
    return () => {
      mountedRef.current = false;
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      clearAllSeries();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update chart when dependencies change
  useEffect(() => {
    if (!chartRef.current) return;
    updateChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPair, chartType, timeframe, indicators, updateChartData]);

  if (error) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="text-red-400 mb-2">⚠️ Chart Error</div>
          <div className="text-gray-300 text-sm">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg z-10">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-gray-300">Loading {chartType} chart...</span>
          </div>
        </div>
      )}

      <div
        ref={chartContainerRef}
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />

      {/* Chart Info */}
      <div className="absolute top-4 left-4 flex space-x-2">
        <div className="bg-gray-800 bg-opacity-90 rounded px-3 py-1 text-sm">
          <span className="text-gray-300">Price: </span>
          <span className="text-white font-mono">
            ${selectedPair.price.toFixed(6)}
          </span>
        </div>
        <div
          className={`bg-gray-800 bg-opacity-90 rounded px-3 py-1 text-sm ${
            selectedPair.change >= 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {selectedPair.change >= 0 ? '+' : ''}
          {selectedPair.change.toFixed(2)}%
        </div>
        <div className="bg-gray-800 bg-opacity-90 rounded px-3 py-1 text-sm">
          <span className="text-gray-300">
            {timeframe} • {chartType}
          </span>
        </div>
      </div>

      {/* Active Indicators */}
      {indicators.length > 0 && (
        <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-90 rounded px-3 py-1 text-xs">
          <span className="text-gray-300">Indicators: </span>
          <span className="text-blue-400">{indicators.join(', ')}</span>
        </div>
      )}

      {/* Volume indicator */}
      <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 rounded px-3 py-1 text-sm">
        <span className="text-gray-300">Volume: </span>
        <span className="text-white">{selectedPair.volume}</span>
        {showVolume && <span className="text-green-400 ml-2">• Chart</span>}
      </div>
    </div>
  );
}
