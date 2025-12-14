import { ColorType, CrosshairMode, LineStyle, TrackingModeExitMode, PriceScaleMode } from 'lightweight-charts';
import type { DeepPartial, TimeChartOptions } from 'lightweight-charts';

export const chartOptions: DeepPartial<TimeChartOptions> = {
  layout: {
    background: { type: ColorType.Solid, color: '#1E1E1E' },
    textColor: '#D1D4DC',
    fontSize: 11,
    fontFamily: 'Roboto, sans-serif',
    attributionLogo: false,
  },
  grid: {
    vertLines: {
      color: '#2A2A2A',
      style: LineStyle.Solid,
      visible: true,
    },
    horzLines: {
      color: '#2A2A2A',
      style: LineStyle.Solid,
      visible: true,
    },
  },
  timeScale: {
    borderColor: '#cccccc',
    timeVisible: true,
    rightOffset: 12,
    barSpacing: 10,
    fixLeftEdge: true,
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
      color: 'rgba(224, 227, 235, 0.1)',
      style: LineStyle.Solid,
      labelVisible: false,
      visible: true,
      labelBackgroundColor: '#1E1E1E',
    },
    horzLine: {
      labelVisible: true,
      width: 2,
      color: '#9B7DFF',
      style: LineStyle.Solid,
      labelBackgroundColor: '#1E1E1E',
      visible: true,
    },
  },
  rightPriceScale: {
    borderColor: '#cccccc',
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
};
