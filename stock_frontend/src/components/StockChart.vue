<script setup lang="ts">
import { ref, watch } from 'vue';
import { getCompanyHistory, getPredictions } from '@/services/company_api';
import LightweightChart from './LightweightChart.vue';
import InterpretationView from './InterpretationView.vue';
import { createChartSeries } from '@/lib/chartSeries';
import type { ChartSeries, HistoryDataItem, DashboardData, PredictionDataItem, LightweightChartExposed } from '@/types/chart';
import { chartOptions as defaultChartOptions } from './chartOptions';
import { LineStyle, PriceLineSource } from 'lightweight-charts';

const props = defineProps<{
  ticker: string;
  selectedForecasts: string[];
  forecastOptions: string[];
  toggleForecast: (forecast: string) => void;
}>();

const historyData = ref<HistoryDataItem[]>([]);
const allPredictions = ref<DashboardData | null>(null);
const chartSeries = ref<ChartSeries[]>([]);
const chartOptions = ref({
  ...defaultChartOptions
});
const chartComponent = ref<LightweightChartExposed | null>(null);
const interpretationView = ref<InstanceType<typeof InterpretationView> | null>(null);

const fetchData = async () => {
  try {
    historyData.value = await getCompanyHistory(props.ticker);
    allPredictions.value = await getPredictions(props.ticker);
    updateChartSeries();
  } catch (error) {
    console.error('Error fetching chart data:', error);
  }
};

const updateChartSeries = () => {
  if (!historyData.value || !allPredictions.value) {
    chartSeries.value = [];
    return;
  }

  const series: ChartSeries[] = [];

  // Candlestick series for historical data
  series.push(
    createChartSeries(
      'candlestick',
      historyData.value,
      {
        title: 'Historical Prices',
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        borderColor: '#000000',
        borderUpColor: '#26a69a',
        borderDownColor: '#ef5350',
        wickVisible: true,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        wickColor: '#000000',
        priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
        lastValueVisible: true,
        crosshairMarkerVisible: true,
        visible: true,
        priceLineVisible: false,
        priceLineSource: PriceLineSource.LastBar,
        priceLineWidth: 1,
        priceLineColor: '',
        priceLineStyle: LineStyle.Solid,
        baseLineVisible: false,
        baseLineColor: '',
        baseLineWidth: 1,
        baseLineStyle: LineStyle.Solid
      }
    ),
  );

  const lastHistoryItem = historyData.value[historyData.value.length - 1];
  const lastHistoryPredictionPoint: PredictionDataItem | null = lastHistoryItem
    ? { target_date: lastHistoryItem.date, predicted_value: lastHistoryItem.close }
    : null;

  // Prediction series based on selectedForecasts
  props.selectedForecasts.forEach(forecastType => {
    let predictionData;
    let label = '';
    let color = '';

    switch (forecastType) {
      case 'ARIMA':
        predictionData = allPredictions.value?.arima_forecast;
        label = 'ARIMA Forecast';
        color = '#FF0000'; // Red
        break;
      // GARCH case removed
      case 'LSTM':
        predictionData = allPredictions.value?.lstm_forecast;
        label = 'LSTM Forecast';
        color = '#0000FF'; // Blue
        break;
    }

    if (predictionData && predictionData.length > 0) {
        const dataToChart = [...predictionData];
        if (lastHistoryPredictionPoint) {
            // Ensure the last history point is included for visual continuity
            dataToChart.unshift(lastHistoryPredictionPoint);
        }

      series.push(
        createChartSeries(
          'line',
          dataToChart,
          {
            color: color,
            lineWidth: 2,
            title: label,
            crosshairMarkerVisible: true,
            lastValueVisible: true,
            visible: true,
            priceLineVisible: false,
            priceLineSource: PriceLineSource.LastBar,
            priceLineWidth: 1,
            priceLineColor: '',
            priceLineStyle: LineStyle.Solid,
            priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
            baseLineVisible: false,
            baseLineColor: '',
            baseLineWidth: 1,
            baseLineStyle: LineStyle.Solid
          }
        )
      );
    }
  });

  chartSeries.value = series;
};

watch(
  () => props.ticker,
  async (newTicker) => {
    if (interpretationView.value) {
      interpretationView.value.resetInterpretation();
    }
    if (newTicker) {
      await fetchData();
    }
  },
  { immediate: true },
);

watch(() => props.selectedForecasts, updateChartSeries, { deep: true });
watch(allPredictions, (newPredictions) => {
    updateChartSeries();
    if (chartComponent.value && newPredictions?.arima_forecast && newPredictions.arima_forecast.length > 0) {
        const lastPrediction = newPredictions.arima_forecast[newPredictions.arima_forecast.length - 1];
        if (lastPrediction && lastPrediction.target_date) {
            const to = lastPrediction.target_date;
            const from = new Date(new Date(to).getTime());
            from.setDate(from.getDate() - 90);
            const fromDate = from.toISOString().split('T')[0] ?? '';
            chartComponent.value.setVisibleRange({ from: fromDate, to });
        }
    }
}, { deep: true });
</script>

<template>
  <div class="stock-chart-container fill-height">
    <div class="button-group mb-4">
      <button
        v-for="forecast in props.forecastOptions"
        :key="forecast"
        @click="props.toggleForecast(forecast)"
        :class="['v-btn', 'v-btn--flat', 'v-btn--density-default', 'v-btn--size-default', 'v-btn--variant-outlined',
                  props.selectedForecasts.includes(forecast) ? 'forecast-button-selected' : '']"
      >
        {{ forecast }}
      </button>
    </div>
    <LightweightChart
      v-if="chartSeries.length > 0"
      ref="chartComponent"
      :series="chartSeries"
      :options="chartOptions"
    />
    <InterpretationView v-if="ticker" :symbol="ticker" :selectedForecasts="props.selectedForecasts" ref="interpretationView" />
  </div>
</template>

<style scoped>
.stock-chart-container {
  width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.button-group {
  display: flex;
  justify-content: center; /* Center the buttons */
  gap: 8px; /* Space between buttons */
  margin-bottom: 1rem;
}

/* Mimic v-btn styling */
.v-btn {
  /* Inherit some base v-btn styles or define them */
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.0892857143em;
  padding: 0 16px;
  height: 36px;
  min-width: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  background-color: transparent; /* Ensure no background fill */
  transition: all 0.2s ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.2); /* Default subtle border */
  color: #E0E0E0; /* Default text color */
}

.v-btn:hover {
  border-color: #64B5F6; /* Lighter blue on hover */
}

.forecast-button-selected {
  border-color: #2196F3; /* Blue border when selected */
  color: #2196F3; /* Blue text when selected */
  box-shadow: 0 0 8px rgba(33, 150, 243, 0.6); /* Blue glow */
}
</style>