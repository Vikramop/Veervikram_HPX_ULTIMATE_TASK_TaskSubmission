import { ColorType, CrosshairMode, LineStyle } from 'lightweight-charts';
import type { ChartConfig } from '../types/chart';

export const CHART_CONFIG: ChartConfig = {
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
    vertLine: { width: 1, color: '#758694', style: LineStyle.Dashed },
    horzLine: { width: 1, color: '#758694', style: LineStyle.Dashed },
  },
  rightPriceScale: {
    borderColor: '#485563',
    textColor: '#d1d5db',
  },
  timeScale: {
    borderColor: '#485563',
    textColor: '#d1d5db',
    timeVisible: true,
    secondsVisible: false,
  },
};

export const TIMEFRAME_CONFIG = {
  '1m': { dataPoints: 200, interval: 60 },
  '5m': { dataPoints: 180, interval: 300 },
  '15m': { dataPoints: 160, interval: 900 },
  '1h': { dataPoints: 140, interval: 3600 },
  '4h': { dataPoints: 120, interval: 14400 },
  '1D': { dataPoints: 100, interval: 86400 },
  '1W': { dataPoints: 50, interval: 604800 },
};

export const INDICATOR_COLORS = {
  movingAverage: '#FF6B35',
  rsi: '#9C27B0',
  macd: '#00BCD4',
  signal: '#FF5722',
  bollingerUpper: '#E91E63',
  bollingerLower: '#E91E63',
  bollingerMiddle: '#E91E63',
  stochasticK: '#4CAF50',
  stochasticD: '#FF9800',
  volume: '#26a69a',
};

export const SERIES_CONFIG = {
  candlestick: {
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderDownColor: '#ef5350',
    borderUpColor: '#26a69a',
    wickDownColor: '#ef5350',
    wickUpColor: '#26a69a',
  },
  line: {
    color: '#2196F3',
    lineWidth: 2,
  },
  area: {
    topColor: 'rgba(33, 150, 243, 0.56)',
    bottomColor: 'rgba(33, 150, 243, 0.04)',
    lineColor: 'rgba(33, 150, 243, 1)',
    lineWidth: 2,
  },
  volume: {
    color: '#26a69a',
    priceFormat: { type: 'volume' },
    priceScaleId: '',
    scaleMargins: { top: 0.7, bottom: 0 },
  },
};
