import type { ChartSeries, HistoryDataItem, PredictionDataItem, SeriesData } from '@/types/chart';

function createCandlestickData(items: HistoryDataItem[]): SeriesData[] {
  if (!items || items.length === 0) {
    return [];
  }
  return items.map((item, index) => {
    if (!item) {
      return null;
    }
    const time = item.date;
    const close = item.close ?? 0;
    const open = index > 0 ? (items[index - 1]?.close ?? close) : close;
    const high = Math.max(open, close);
    const low = Math.min(open, close);
    
    return { time, open, high, low, close } as SeriesData;
  }).filter((dataPoint): dataPoint is SeriesData => !!dataPoint && dataPoint.time !== undefined);
}

function createPredictionLineData(items: PredictionDataItem[]): SeriesData[] {
  if (!items || items.length === 0) {
    return [];
  }
  return items.map(item => {
    if (!item) {
      return null;
    }
    const time = item.target_date;
    const value = item.predicted_value ?? 0;
    return { time, value } as SeriesData;
  }).filter((dataPoint): dataPoint is SeriesData => !!dataPoint && dataPoint.time !== undefined && dataPoint.value !== undefined);
}

export function createChartSeries(historyData: HistoryDataItem[], predictionData: PredictionDataItem[]): ChartSeries[] {
  const series: ChartSeries[] = [];

  if (historyData.length > 0) {
    series.push({
      type: 'candlestick' as const,
      data: createCandlestickData(historyData),
      options: {
        upColor: '#4caf50',
        downColor: '#ef5350',
        borderDownColor: '#ef5350',
        borderUpColor: '#4caf50',
        wickDownColor: '#ef5350',
        wickUpColor: '#4caf50',
      } as any,
    });
  }

  if (predictionData.length > 0) {
    series.push({
      type: 'line' as const,
      data: createPredictionLineData(predictionData),
      options: {
        color: '#03a9f4',
      } as any,
    });
  }

  return series;
}
