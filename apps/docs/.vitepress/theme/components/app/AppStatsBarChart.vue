<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { useChartTheme } from '../../composables/useChartTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const props = defineProps<{
  data: [string, number][];
}>();

const { chartKey, tooltipConfig, gridColor, tickColor } = useChartTheme();

const chartData = computed(() => ({
  labels: props.data.map(([name]) => name),
  datasets: [
    {
      data: props.data.map(([, value]) => value),
      backgroundColor: '#1689cc',
      borderRadius: 4,
      barThickness: 20,
    },
  ],
}));

const chartOptions = computed(() => ({
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      ...tooltipConfig(),
      displayColors: false,
      callbacks: {
        label: (ctx: any) => `${ctx.parsed.x.toFixed(1)}%`,
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: gridColor(),
      },
      ticks: {
        color: tickColor(),
        callback: (value: any) => `${value}%`,
        font: { size: 12 },
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        color: tickColor(0.7),
        font: { size: 13 },
      },
      border: {
        display: false,
      },
    },
  },
}));

const chartHeight = computed(() => props.data.length * 32 + 40);
</script>

<template>
  <div class="app-stats-bar-chart" :style="{ height: chartHeight + 'px' }">
    <Bar :key="chartKey" :data="chartData" :options="chartOptions" />
  </div>
</template>

<style lang="scss" scoped>
.app-stats-bar-chart {
  position: relative;
}
</style>
