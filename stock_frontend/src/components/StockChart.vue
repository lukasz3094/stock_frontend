<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import LightweightChart from './LightweightChart.vue';
import InterpretationView from './InterpretationView.vue';
import { createChartSeries } from '@/lib/chartSeries';
import type { ChartSeries, PredictionDataItem, LightweightChartExposed } from '@/types/chart';
import { getChartOptions } from './chartOptions';
import { LineStyle, PriceLineSource } from 'lightweight-charts';
import { chartColors } from '@/utils/theme';
import { useCompaniesStore } from '@/stores/companies';

const props = defineProps<{
  ticker: string;
  selectedForecasts: string[];
  forecastOptions: string[];
  toggleForecast: (forecast: string) => void;
}>();

const store = useCompaniesStore();
const chartSeries = ref<ChartSeries[]>([]);
const chartOptions = ref<any>({});
const chartComponent = ref<LightweightChartExposed | null>(null);
const interpretationView = ref<InstanceType<typeof InterpretationView> | null>(null);

const updateChartSeries = () => {
  if (!store.historyData || !store.predictions) {
    chartSeries.value = [];
    return;
  }

  const series: ChartSeries[] = [];

  series.push(
    createChartSeries(
      'candlestick',
      store.historyData,
      {
        title: 'Historical Prices',
        upColor: chartColors.up,
        downColor: chartColors.down,
        borderVisible: false,
        borderColor: chartColors.border,
        borderUpColor: chartColors.borderUp,
        borderDownColor: chartColors.borderDown,
        wickVisible: true,
        wickUpColor: chartColors.wickUp,
        wickDownColor: chartColors.wickDown,
        wickColor: chartColors.wick,
        priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
        lastValueVisible: true,
        crosshairMarkerVisible: true,
        visible: true,
        priceLineVisible: true,
        priceLineSource: PriceLineSource.LastBar,
        priceLineWidth: 1,
        priceLineColor: '',
        priceLineStyle: LineStyle.Dashed,
        baseLineVisible: false,
        baseLineColor: '',
        baseLineWidth: 1,
        baseLineStyle: LineStyle.Solid
      }
    ),
  );

  const lastHistoryItem = store.historyData[store.historyData.length - 1];
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
        predictionData = store.predictions?.arima_forecast;
        label = 'ARIMA Forecast';
        color = chartColors.forecastArima; 
        break;
      case 'LSTM':
        predictionData = store.predictions?.lstm_forecast;
        label = 'LSTM Forecast';
        color = chartColors.forecastLstm;
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
            lineWidth: 4,
            title: label,
            crosshairMarkerVisible: true,
            lastValueVisible: true,
            visible: true,
            priceLineVisible: true,
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

onMounted(() => {
  chartOptions.value = getChartOptions();
  updateChartSeries();
});

watch(
  () => props.ticker,
  async () => {
    if (interpretationView.value) {
      interpretationView.value.resetInterpretation();
    }
  },
  { immediate: true },
);

watch(() => [store.historyData, store.predictions], () => {
  updateChartSeries();
}, { deep: true });

watch(() => props.selectedForecasts, updateChartSeries, { deep: true });
watch(() => store.predictions, (newPredictions) => {
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
  justify-content: center;
  gap: 8px;
  margin-bottom: 1rem;
}

.v-btn {
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
  background-color: transparent;
  transition: all 0.2s ease-in-out;
  border: 1px solid var(--color-border-subtle);
  color: var(--color-text-primary);
}

.v-btn:hover {
  border-color: var(--color-text-link);
}

.forecast-button-selected {
  border-color: var(--color-info);
  color: var(--color-info);
  box-shadow: var(--shadow-glow-active);
}
</style>