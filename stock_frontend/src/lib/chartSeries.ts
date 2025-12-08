import type { ChartSeries, HistoryDataItem, PredictionDataItem, SeriesData } from '@/types/chart';

function createLineData(items: (HistoryDataItem | PredictionDataItem)[]): SeriesData[] {
  if (!items || items.length === 0) {
    return [];
  }
  return items.map(item => {
    if (!item) {
      return null;
    }
    const time = 'date' in item ? item.date : item.target_date;
    const value = ('close' in item ? item.close : item.predicted_value) ?? 0;
    return { time, value } as SeriesData;
  }).filter((dataPoint): dataPoint is SeriesData => !!dataPoint && dataPoint.time !== undefined && dataPoint.value !== undefined);
}

export function createChartSeries(historyData: HistoryDataItem[], predictionData: PredictionDataItem[]): ChartSeries[] {
  const series: ChartSeries[] = [];

  if (historyData.length > 0) {
    series.push({
      type: 'line' as const,
      data: createLineData(historyData),
      options: {
        color: '#4caf50',
      } as any,
    });
  }

  if (predictionData.length > 0) {
    series.push({
      type: 'line' as const,
      data: createLineData(predictionData),
      options: {
        color: '#03a9f4',
      } as any,
    });
  }

  return series;
}
