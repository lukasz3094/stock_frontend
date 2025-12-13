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

export interface ArimaPredictionOut {
  target_date: string;
  predicted_value: number;
}

export interface GarchPredictionOut {
  target_date: string;
  predicted_volatility: number;
}

export interface LstmPredictionOut {
  target_date: string;
  predicted_value: number;
}

export interface DashboardData {
  ticker: string;
  last_update: string;
  arima_forecast: ArimaPredictionOut[];
  garch_forecast: GarchPredictionOut[];
  lstm_forecast: LstmPredictionOut[];
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
