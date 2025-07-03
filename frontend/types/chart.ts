export interface ChartData {
  time: any;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface VolumeData {
  time: any;
  value: number;
  color: string;
}

export interface IndicatorData {
  time: any;
  value: number;
}

export interface ChartConfig {
  layout: {
    background: { type: any; color: string };
    textColor: string;
  };
  grid: {
    vertLines: { color: string };
    horzLines: { color: string };
  };
  crosshair: {
    mode: any;
    vertLine: { width: number; color: string; style: any };
    horzLine: { width: number; color: string; style: any };
  };
  rightPriceScale: {
    borderColor: string;
    textColor: string;
  };
  timeScale: {
    borderColor: string;
    textColor: string;
    timeVisible: boolean;
    secondsVisible: boolean;
  };
}
