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
import { chartColors } from '@/utils/theme';

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
      upColor: chartColors.up,
      downColor: chartColors.down,
      borderDownColor: chartColors.borderDown,
      borderUpColor: chartColors.borderUp,
      wickDownColor: chartColors.wickDown,
      wickUpColor: chartColors.wickUp,
      lastValueVisible: false,
      priceLineVisible: false,
      wickVisible: true,
      borderVisible: true,
      borderColor: chartColors.border,
      wickColor: chartColors.wick,
      title: '',
      visible: true,
      priceLineSource: PriceLineSource.LastBar,
      priceLineWidth: 1,
      priceLineColor: '',
      priceLineStyle: LineStyle.Dotted,
      baseLineVisible: true,
      baseLineColor: chartColors.grid,
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
      color: chartColors.forecastLstm, // Default
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
      baseLineColor: chartColors.grid,
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
