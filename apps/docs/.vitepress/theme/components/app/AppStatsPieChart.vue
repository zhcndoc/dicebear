<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useChartTheme } from '../../composables/useChartTheme';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
  data: [string, number][];
  twoColumns?: boolean;
}>();

const { chartKey, tooltipConfig } = useChartTheme();

const palette = [
  '#1689cc',
  '#6f42c1',
  '#cb3837',
  '#2ea043',
  '#d29922',
  '#0969da',
  '#8250df',
  '#cf222e',
  '#1a7f37',
  '#bf8700',
  '#e85d04',
  '#3a86ff',
  '#8338ec',
  '#ff006e',
  '#06d6a0',
  '#118ab2',
];

function getColor(index: number): string {
  return palette[index % palette.length];
}

const chartData = computed(() => ({
  labels: props.data.map(([name]) => name),
  datasets: [
    {
      data: props.data.map(([, value]) => value),
      backgroundColor: props.data.map((_, i) => getColor(i)),
      borderColor: 'transparent',
      borderWidth: 0,
      hoverOffset: 6,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    tooltip: {
      ...tooltipConfig(),
      callbacks: {
        label: (ctx: any) => `${ctx.label}: ${ctx.parsed.toFixed(1)}%`,
      },
    },
    legend: {
      display: false,
    },
  },
}));
</script>

<template>
  <div ref="chartRef" class="app-stats-pie-chart" :class="{ 'app-stats-pie-chart--side-by-side': twoColumns }">
    <div class="app-stats-pie-chart-canvas">
      <Doughnut :key="chartKey" :data="chartData" :options="chartOptions" />
    </div>
    <ul class="app-stats-pie-chart-legend" :class="{ 'app-stats-pie-chart-legend--two-cols': twoColumns }">
      <li v-for="([name, value], i) in data" :key="name" class="app-stats-pie-chart-legend-item">
        <span class="app-stats-pie-chart-legend-dot" :style="{ backgroundColor: getColor(i) }" />
        <span class="app-stats-pie-chart-legend-name">{{ name }}</span>
        <span class="app-stats-pie-chart-legend-value">{{ value.toFixed(1) }}%</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.app-stats-pie-chart {
  &--side-by-side {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 32px;
    align-items: center;

    .app-stats-pie-chart-canvas {
      margin-bottom: 0;
    }
  }

  &-canvas {
    height: 200px;
    position: relative;
    margin-bottom: 24px;
  }

  &-legend {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;

    &--two-cols {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px 24px;
    }
  }

  &-legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
  }

  &-legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &-legend-name {
    color: var(--vp-c-text-1);
    flex: 1;
  }

  &-legend-value {
    color: var(--vp-c-text-2);
    font-variant-numeric: tabular-nums;
  }
}

@media (max-width: 640px) {
  .app-stats-pie-chart--side-by-side {
    grid-template-columns: 1fr;
  }
}
</style>
