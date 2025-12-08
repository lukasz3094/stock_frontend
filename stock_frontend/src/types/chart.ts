import type { SeriesOptionsMap, SeriesType } from 'lightweight-charts';

export interface LightweightChartExposed {
  setVisibleRange: (range: { from: string; to: string }) => void;
}

export interface HistoryDataItem {
  date: string;
  close: number;
}

export interface PredictionDataItem {
  target_date: string;
  predicted_value: number;
}

export interface SeriesData {
  time: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  value?: number;
}

export interface ChartSeries {
  type: 'area' | 'line' | 'candlestick';
  data: SeriesData[];
  options?: SeriesOptionsMap[SeriesType];
}
