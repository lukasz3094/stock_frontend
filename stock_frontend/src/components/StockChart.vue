<template>
  <div>
    <LightweightChart
      v-if="series.length > 0"
      ref="chartComponent"
      :series="series"
      :options="chartOptions"
    />
    <InterpretationView v-if="ticker" :symbol="ticker" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import LightweightChart from './LightweightChart.vue';
import InterpretationView from './InterpretationView.vue';
import { getCompanyHistory, getPredictions } from '@/services/company_api';

const props = defineProps<{
  ticker: string | null;
}>();

const chartComponent = ref(null);
const historyData = ref([]);
const predictionData = ref([]);

const chartOptions = {
  layout: {
    background: { color: '#232f3e' },
    textColor: '#D1D4DC',
  },
  grid: {
    vertLines: { color: '#2B2B43' },
    horzLines: { color: '#2B2B43' },
  },
  timeScale: {
    borderColor: '#cccccc',
  },
  autoSize: true,
  watermark: {
    visible: false,
  },
};

const series = computed(() => {
  if (historyData.value.length === 0) return [];
  
  const ohlcData = historyData.value.map((item, index) => {
    const open = index > 0 ? historyData.value[index - 1].close : item.close;
    const close = item.close;
    const high = Math.max(open, close);
    const low = Math.min(open, close);
    return { time: item.date, open, high, low, close };
  });

  const series = [{
      type: 'candlestick',
      data: ohlcData,
      options: {
        upColor: '#4caf50',
        downColor: '#f44336',
        borderVisible: false,
        wickUpColor: '#4caf50',
        wickDownColor: '#f44336',
      },
    }];

  if (predictionData.value.length > 0) {
    const lastHistoryPoint = historyData.value[historyData.value.length - 1];
    const predictionOhlcData = predictionData.value.map((item, index) => {
      const open = index > 0 ? predictionData.value[index - 1].predicted_value : lastHistoryPoint.close;
      const close = item.predicted_value;
      const high = Math.max(open, close);
      const low = Math.min(open, close);
      return { time: item.target_date, open, high, low, close };
    });

    series.push({
      type: 'candlestick',
      data: predictionOhlcData,
      options: {
        upColor: '#03a9f4',
        downColor: '#03a9f4',
        wickUpColor: '#03a9f4',
        wickDownColor: '#03a9f4',
        borderVisible: false,
      },
    });
  }

  return series;
});

watch(() => props.ticker, async (newTicker) => {
  if (newTicker) {
    try {
      historyData.value = await getCompanyHistory(newTicker);
      const predictions = await getPredictions(newTicker);
      predictionData.value = predictions.arima_forecast;

      if (chartComponent.value && predictionData.value.length > 0) {
        const to = predictionData.value[predictionData.value.length - 1].target_date;
        const from = new Date(new Date(to).getTime());
        from.setDate(from.getDate() - 90);
        chartComponent.value.setVisibleRange({ from: from.toISOString().split('T')[0], to });
      }

    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  }
});
</script>
