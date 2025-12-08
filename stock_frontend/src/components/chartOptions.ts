import * as LightweightCharts from 'lightweight-charts';

export const chartOptions: LightweightCharts.ChartOptions = {
  autoSize: true,
  layout: {
    background: { type: LightweightCharts.ColorType.Solid, color: '#1E1E1E' },
    textColor: '#D1D4DC',
    fontSize: 11,
    fontFamily: 'Roboto, sans-serif',
  },
  grid: {
    vertLines: { color: '#2A2A2A' },
    horzLines: { color: '#2A2A2A' },
  },
  timeScale: {
    borderColor: '#cccccc',
    timeVisible: true,
  },
  crosshair: {
    mode: LightweightCharts.CrosshairMode.Normal,
    vertLine: {
      width: 2,
      color: 'rgba(224, 227, 235, 0.1)',
      style: LightweightCharts.LineStyle.Solid,
      labelVisible: false,
    },
    horzLine: {
      labelVisible: true,
      width: 2,
      color: '#9B7DFF',
      style: LightweightCharts.LineStyle.Solid,
      labelBackgroundColor: '#1E1E1E',
    },
  },
  rightPriceScale: {
    borderColor: '#cccccc',
    scaleMargins: {
      top: 0.3,
      bottom: 0.25,
    },
  },
};
