import type { SeriesOptionsMap, SeriesType } from 'lightweight-charts';
import type { ChartSeries, HistoryDataItem, SeriesData, ArimaPredictionOut, GarchPredictionOut, LstmPredictionOut } from '@/types/chart';

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

function createPredictionLineData(items: Array<ArimaPredictionOut | GarchPredictionOut | LstmPredictionOut>): SeriesData[] {
  if (!items || items.length === 0) {
    return [];
  }
  return items.map(item => {
    if (!item) {
      return null;
    }
    const time = item.target_date;
    const value = (item as ArimaPredictionOut).predicted_value ?? (item as LstmPredictionOut).predicted_value ?? (item as GarchPredictionOut).predicted_volatility ?? 0;
    return { time, value } as SeriesData;
  }).filter((dataPoint): dataPoint is SeriesData => !!dataPoint && dataPoint.time !== undefined && dataPoint.value !== undefined);
}

export function createChartSeries(
  type: 'candlestick' | 'line',
  data: HistoryDataItem[] | ArimaPredictionOut[] | GarchPredictionOut[] | LstmPredictionOut[],
  options?: SeriesOptionsMap[SeriesType],
): ChartSeries {
  let formattedData: SeriesData[] = [];

  if (type === 'candlestick') {
    formattedData = createCandlestickData(data as HistoryDataItem[]);
    return {
      type,
      data: formattedData,
      options: options || {
        upColor: '#4caf50',
        downColor: '#ef5350',
        borderDownColor: '#ef5350',
        borderUpColor: '#4caf50',
        wickDownColor: '#ef5350',
        wickUpColor: '#4caf50',
      },
    };
  } else if (type === 'line') {
    formattedData = createPredictionLineData(data as (ArimaPredictionOut | GarchPredictionOut | LstmPredictionOut)[]);
    return {
      type,
      data: formattedData,
      options: options || {
        color: '#03a9f4', // Default line color
        lineWidth: 2,
        crosshairMarkerVisible: true,
        lastValueVisible: true,
      },
    };
  }
  throw new Error(`Unsupported chart series type: ${type}`);
}
