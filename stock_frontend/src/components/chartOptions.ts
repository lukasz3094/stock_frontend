import { ColorType, CrosshairMode, LineStyle, TrackingModeExitMode, PriceScaleMode } from 'lightweight-charts';
import type { DeepPartial, TimeChartOptions } from 'lightweight-charts';
import { chartColors } from '@/utils/theme';

export const getChartOptions = (): DeepPartial<TimeChartOptions> => ({
  layout: {
    background: { type: ColorType.Solid, color: chartColors.background },
    textColor: chartColors.text,
    fontSize: 11,
    fontFamily: 'Roboto, sans-serif',
    attributionLogo: false,
  },
  grid: {
    vertLines: {
      color: chartColors.grid,
      style: LineStyle.Solid,
      visible: true,
    },
    horzLines: {
      color: chartColors.grid,
      style: LineStyle.Solid,
      visible: true,
    },
  },
  timeScale: {
    borderColor: chartColors.scaleBorder,
    timeVisible: true,
    rightOffset: 12,
    barSpacing: 10,
    fixLeftEdge: false,
    lockVisibleTimeRangeOnResize: true,
    rightBarStaysOnScroll: true,
    borderVisible: false,
    visible: true,
    secondsVisible: false,
    shiftVisibleRangeOnNewBar: true,
    minBarSpacing: 1,
  },
  crosshair: {
    mode: CrosshairMode.Normal,
    vertLine: {
      width: 2,
      color: chartColors.crosshair,
      style: LineStyle.Solid,
      labelVisible: false,
      visible: true,
      labelBackgroundColor: chartColors.background,
    },
    horzLine: {
      labelVisible: true,
      width: 2,
      color: chartColors.forecastOther,
      style: LineStyle.Solid,
      labelBackgroundColor: chartColors.background,
      visible: true,
    },
  },
  rightPriceScale: {
    borderColor: chartColors.scaleBorder,
    scaleMargins: {
      top: 0.3,
      bottom: 0.25,
    },
    borderVisible: false,
    visible: true,
    autoScale: true,
    mode: PriceScaleMode.Normal,
  },
  leftPriceScale: {
    visible: false,
  },
  handleScroll: {
    vertTouchDrag: true,
    horzTouchDrag: true,
    mouseWheel: true,
    pressedMouseMove: true,
  },
  handleScale: {
    pinch: true,
    axisDoubleClickReset: true,
    axisPressedMouseMove: true,
    mouseWheel: true,
  },
  localization: {
    locale: 'pl-PL',
    dateFormat: 'dd-MM-yyyy',
  },
  kineticScroll: {
    mouse: true,
    touch: true,
  },
  trackingMode: {
    exitMode: TrackingModeExitMode.OnTouchEnd,
  },
});
