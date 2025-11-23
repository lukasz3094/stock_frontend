<template>
  <div ref="chartContainer" class="chart-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as LightweightCharts from 'lightweight-charts';

const props = defineProps({
  series: {
    type: Array,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
});

const chartContainer = ref(null);
let chart = null;
const seriesRefs = [];

onMounted(() => {
  chart = LightweightCharts.createChart(chartContainer.value, props.options);

  props.series.forEach(s => {
    let series;
    if (s.type === 'area') {
      series = chart.addSeries(LightweightCharts.AreaSeries, s.options);
    } else if (s.type === 'line') {
      series = chart.addSeries(LightweightCharts.LineSeries, s.options);
    } else if (s.type === 'candlestick') {
      series = chart.addSeries(LightweightCharts.CandlestickSeries, s.options);
    }
    if (series) {
      series.setData(s.data);
      seriesRefs.push(series);
    }
  });

  chart.timeScale().fitContent();
});

watch(
  () => props.series,
  (newSeries) => {
    if (!chart) return;
    
    seriesRefs.forEach(s => chart.removeSeries(s));
    seriesRefs.length = 0;

    newSeries.forEach(s => {
      let series;
      if (s.type === 'area') {
        series = chart.addSeries(LightweightCharts.AreaSeries, s.options);
      } else if (s.type === 'line') {
        series = chart.addSeries(LightweightCharts.LineSeries, s.options);
      } else if (s.type === 'candlestick') {
        series = chart.addSeries(LightweightCharts.CandlestickSeries, s.options);
      }
      if (series) {
        series.setData(s.data);
        seriesRefs.push(series);
      }
    });
  },
  { deep: true }
);

watch(
  () => props.options,
  (newOptions) => {
    if (!chart) return;
    chart.applyOptions(newOptions);
  },
  { deep: true }
);

onUnmounted(() => {
  if (chart) {
    chart.remove();
    chart = null;
  }
});

const setVisibleRange = (range) => {
  if (chart) {
    chart.timeScale().setVisibleRange(range);
  }
};

defineExpose({
  setVisibleRange,
});
</script>
<style scoped>
.chart-container {
  width: 100%;
  height: 500px;
}
</style>
