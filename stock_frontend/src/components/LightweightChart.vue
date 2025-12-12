<template>
  <div ref="chartContainer" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue';
import {
  createChart,
  AreaSeries,
  LineSeries,
  CandlestickSeries,
  type IChartApi,
  type ISeriesApi,
  type SeriesType,
  type ChartOptions,
  type AreaSeriesOptions,
  type LineSeriesOptions,
  type CandlestickSeriesOptions,
} from 'lightweight-charts';
import type { ChartSeries } from '@/types/chart';

const props = defineProps<{
  series: ChartSeries[];
  options: ChartOptions;
}>();

const chartContainer: Ref<HTMLElement | null> = ref(null);
let chart: IChartApi | null = null;
const seriesRefs: ISeriesApi<SeriesType>[] = [];

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (!chartContainer.value) {
    console.error('Chart container not found');
    return;
  }
  chart = createChart(chartContainer.value, props.options) as IChartApi;

  if (!chart) {
    throw new Error('Failed to create chart');
  }

  props.series.forEach(s => {
    let series: ISeriesApi<SeriesType> | undefined;
    if (s.type === 'area') {
      series = chart!.addSeries(AreaSeries, s.options as AreaSeriesOptions);
    } else if (s.type === 'line') {
      series = chart!.addSeries(LineSeries, s.options as LineSeriesOptions);
    } else if (s.type === 'candlestick') {
      series = chart!.addSeries(CandlestickSeries, s.options as CandlestickSeriesOptions);
    }
    if (series) {
      series.setData(s.data);
      seriesRefs.push(series);
    }
  });

  chart?.timeScale().fitContent();

  resizeObserver = new ResizeObserver(entries => {
    const { width, height } = entries[0].contentRect;
    chart?.applyOptions({ width, height });
  });

  resizeObserver.observe(chartContainer.value);
});

watch(
  () => props.series,
  (newSeries) => {
    if (!chart) 
      throw new Error('Chart not initialized');
    
    seriesRefs.forEach(s => chart?.removeSeries(s));
    seriesRefs.length = 0;

    newSeries.forEach(s => {
      if (!chart) return;
      let series: ISeriesApi<SeriesType> | undefined;
      if (s.type === 'area') {
        series = chart!.addSeries(AreaSeries, s.options as AreaSeriesOptions);
      } else if (s.type === 'line') {
        series = chart!.addSeries(LineSeries, s.options as LineSeriesOptions);
      } else if (s.type === 'candlestick') {
        series = chart!.addSeries(CandlestickSeries, s.options as CandlestickSeriesOptions);
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
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (chart) {
    chart.remove();
    chart = null;
  }
});

const setVisibleRange = (range: { from: string; to: string }) => {
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
  flex-grow: 1;
}
</style>
