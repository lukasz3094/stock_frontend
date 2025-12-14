import {
  type SeriesOptionsMap,
  type SeriesType,
  type CandlestickSeriesOptions,
  type LineSeriesOptions,
  LineStyle,
  LineType,
  PriceLineSource,
  LastPriceAnimationMode,
} from 'lightweight-charts';
import type { ChartSeries, HistoryDataItem, SeriesData, ArimaPredictionOut, LstmPredictionOut } from '@/types/chart';

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

function createPredictionLineData(items: Array<ArimaPredictionOut | LstmPredictionOut>): SeriesData[] {
  if (!items || items.length === 0) {
    return [];
  }
  return items.map(item => {
    if (!item) {
      return null;
    }
    const time = item.target_date;
    const value = (item as ArimaPredictionOut).predicted_value ?? (item as LstmPredictionOut).predicted_value ?? 0;
    return { time, value } as SeriesData;
  }).filter((dataPoint): dataPoint is SeriesData => !!dataPoint && dataPoint.time !== undefined && dataPoint.value !== undefined);
}

export function createChartSeries(
  type: 'candlestick' | 'line',
  data: HistoryDataItem[] | ArimaPredictionOut[] | LstmPredictionOut[],
  options?: SeriesOptionsMap[SeriesType],
): ChartSeries {
  let formattedData: SeriesData[] = [];

  if (type === 'candlestick') {
    formattedData = createCandlestickData(data as HistoryDataItem[]);
    const defaultOptions: CandlestickSeriesOptions = {
      upColor: '#4caf50',
      downColor: '#ef5350',
      borderDownColor: '#ef5350',
      borderUpColor: '#4caf50',
      wickDownColor: '#ef5350',
      wickUpColor: '#4caf50',
      lastValueVisible: false,
      priceLineVisible: false,
      wickVisible: true,
      borderVisible: true,
      borderColor: '#378658',
      wickColor: '#378658',
      title: '',
      visible: true,
      priceLineSource: PriceLineSource.LastBar,
      priceLineWidth: 1,
      priceLineColor: '',
      priceLineStyle: LineStyle.Dotted,
      baseLineVisible: true,
      baseLineColor: '#B2B5BE',
      baseLineWidth: 1,
      baseLineStyle: LineStyle.Solid,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    };
    return {
      type,
      data: formattedData,
      options: { ...defaultOptions, ...options },
    };
  } else if (type === 'line') {
    formattedData = createPredictionLineData(data as (ArimaPredictionOut | LstmPredictionOut)[]);
    const defaultOptions: LineSeriesOptions = {
      color: '#03a9f4',
      lineWidth: 2,
      lineStyle: LineStyle.Solid,
      crosshairMarkerVisible: true,
      lastValueVisible: true,
      lineType: LineType.Simple,
      lineVisible: true,
      pointMarkersVisible: false,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: '',
      crosshairMarkerBackgroundColor: '',
      crosshairMarkerBorderWidth: 0,
      lastPriceAnimation: LastPriceAnimationMode.Disabled,
      title: '',
      visible: true,
      priceLineVisible: false,
      priceLineSource: PriceLineSource.LastBar,
      priceLineWidth: 1,
      priceLineColor: '',
      priceLineStyle: LineStyle.Dotted,
      baseLineVisible: true,
      baseLineColor: '#B2B5BE',
      baseLineWidth: 1,
      baseLineStyle: LineStyle.Solid,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    };
    return {
      type,
      data: formattedData,
      options: { ...defaultOptions, ...options },
    };
  }
  throw new Error(`Unsupported chart series type: ${type}`);
}
