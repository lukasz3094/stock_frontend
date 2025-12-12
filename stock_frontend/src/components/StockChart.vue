<template>
  <div class="stock-chart-container fill-height">
    <LightweightChart
      v-if="series.length > 0"
      ref="chartComponent"
      :series="series"
      :options="chartOptions"
    />
    <InterpretationView v-if="ticker" :symbol="ticker" ref="interpretationView" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import LightweightChart from './LightweightChart.vue';
import InterpretationView from './InterpretationView.vue';
import { getCompanyHistory, getPredictions } from '@/services/company_api';
import { chartOptions } from './chartOptions';
import { createChartSeries } from '@/lib/chartSeries';
import type { LightweightChartExposed, HistoryDataItem, PredictionDataItem, ChartSeries } from '@/types/chart';

const props = defineProps<{
  ticker: string | null;
  companyName: string | null;
}>();

const chartComponent = ref<LightweightChartExposed | null>(null);
const interpretationView = ref<InstanceType<typeof InterpretationView> | null>(null);
const historyData = ref<HistoryDataItem[]>([]);
const predictionData = ref<PredictionDataItem[]>([]);

const series = computed<ChartSeries[]>(() => createChartSeries(historyData.value, predictionData.value));

watch(() => props.ticker, async (newTicker) => {
  if (interpretationView.value) {
    interpretationView.value.resetInterpretation();
  }
  if (newTicker) {
    try {
      historyData.value = await getCompanyHistory(newTicker);
      const predictions = await getPredictions(newTicker);
      predictionData.value = predictions.arima_forecast;

      if (chartComponent.value && predictionData.value.length > 0) {
        const lastPrediction = predictionData.value[predictionData.value.length - 1];
        if (lastPrediction && lastPrediction.target_date && chartComponent.value) {
          const to = lastPrediction.target_date;
          const from = new Date(new Date(to).getTime());
          from.setDate(from.getDate() - 90);
          const fromDate = from.toISOString().split('T')[0] ?? '';
          chartComponent.value.setVisibleRange({ from: fromDate, to });
        }
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  }
}, { immediate: true });
</script>

<style scoped>
.stock-chart-container {
  width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>