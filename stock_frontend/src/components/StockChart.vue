<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { getCompanyHistory, getPredictions } from '@/services/company_api';
import LightweightChart from './LightweightChart.vue';
import { createChartSeries } from '@/lib/chartSeries';
import type { ChartSeries, HistoryDataItem, DashboardData, PredictionDataItem } from '@/types/chart';
import { chartOptions as defaultChartOptions } from './chartOptions'; // Import default options

const props = defineProps<{
  ticker: string;
}>();

const historyData = ref<HistoryDataItem[]>([]);
const allPredictions = ref<DashboardData | null>(null);
const chartSeries = ref<ChartSeries[]>([]);
const chartOptions = ref(defaultChartOptions); // Use imported default options

const selectedForecasts = ref(['LSTM']); // Default to LSTM
const forecastOptions = ['ARIMA', 'LSTM']; // GARCH removed

const toggleForecast = (forecast: string) => {
  const index = selectedForecasts.value.indexOf(forecast);
  if (index > -1) {
    // If it's already selected and it's not the last one, deselect it
    if (selectedForecasts.value.length > 1) {
      selectedForecasts.value.splice(index, 1);
    }
  } else {
    // If not selected, select it
    selectedForecasts.value.push(forecast);
  }
};

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
        // Default candlestick options from chartSeries.ts
      }
    ),
  );

  const lastHistoryItem = historyData.value[historyData.value.length - 1];
  const lastHistoryPredictionPoint: PredictionDataItem | null = lastHistoryItem
    ? { target_date: lastHistoryItem.date, predicted_value: lastHistoryItem.close }
    : null;

  // Prediction series based on selectedForecasts
  selectedForecasts.value.forEach(forecastType => {
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
        let dataToChart = [...predictionData];
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
    if (newTicker) {
      await fetchData();
    }
  },
  { immediate: true },
);

watch(selectedForecasts, updateChartSeries, { deep: true });
watch(allPredictions, updateChartSeries, { deep: true });
</script>

<template>
  <div class="stock-chart-container">
    <div class="button-group mb-4">
      <button
        v-for="forecast in forecastOptions"
        :key="forecast"
        @click="toggleForecast(forecast)"
        :class="['v-btn', 'v-btn--flat', 'v-btn--density-default', 'v-btn--size-default', 'v-btn--variant-outlined',
                  selectedForecasts.includes(forecast) ? 'forecast-button-selected' : '']"
      >
        {{ forecast }}
      </button>
    </div>
    <div class="chart-wrapper">
      <LightweightChart :series="chartSeries" :options="chartOptions" />
    </div>
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

.chart-wrapper {
  width: 100%;
  height: 400px; /* Fixed height for the chart */
}
</style>