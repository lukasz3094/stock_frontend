export const getThemeColor = (variable: string): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  }
  return '';
};

export const chartColors = {
  get up() { return getThemeColor('--color-chart-up'); },
  get down() { return getThemeColor('--color-chart-down'); },
  get border() { return getThemeColor('--color-chart-border'); },
  get borderUp() { return getThemeColor('--color-chart-up'); },
  get borderDown() { return getThemeColor('--color-chart-down'); },
  get wickUp() { return getThemeColor('--color-chart-up'); },
  get wickDown() { return getThemeColor('--color-chart-down'); },
  get wick() { return getThemeColor('--color-chart-wick-black'); },
  get grid() { return getThemeColor('--color-chart-grid'); },
  get text() { return getThemeColor('--color-chart-text'); },
  get crosshair() { return getThemeColor('--color-chart-crosshair'); },
  get scaleBorder() { return getThemeColor('--color-chart-border-scale'); },
  get forecastArima() { return getThemeColor('--color-chart-line-forecast-arima'); },
  get forecastLstm() { return getThemeColor('--color-chart-line-forecast-lstm'); },
  get forecastOther() { return getThemeColor('--color-chart-line-forecast-other'); },
  get background() { return getThemeColor('--color-surface'); },
};
