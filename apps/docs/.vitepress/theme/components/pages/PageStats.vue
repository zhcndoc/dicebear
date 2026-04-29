<script setup lang="ts">
import { computed, ref } from 'vue';
import { UiSection, UiContainer, UiSectionHeader, UiCard } from '../ui';
import AppSmallHero from '../app/AppSmallHero.vue';
import AppStatsChart from '../app/AppStatsChart.vue';
import AppStatsPieChart from '../app/AppStatsPieChart.vue';
import AppStatsBarChart from '../app/AppStatsBarChart.vue';
import AppStatsGlobe from '../app/AppStatsGlobe.vue';
import { useApiStatsRaw, lastCompleteMonth } from '../../composables/useApiStats';
import { formatNumber, formatBytes } from '../../utils/format';

const SECONDS_PER_DAY = 86400;
const ROLLING_WINDOW_DAYS = 7;

const stats = useApiStatsRaw();

function aggregateDaily(data: Record<string, number>): {
  labels: string[];
  values: number[];
} {
  const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));

  if (entries.length > 1) {
    entries.pop();
  }

  return {
    labels: entries.map(([k]) => {
      const d = new Date(k);

      return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }),
    values: entries.map(([, v]) => v),
  };
}

const requestsData = computed(() => {
  if (!stats.value) {
    return null;
  }

  return aggregateDaily(stats.value.requests);
});

const downloadsData = computed(() => {
  if (!stats.value) {
    return null;
  }

  return aggregateDaily(stats.value.downloads.npm);
});

function averageWeekly(
  source: Record<string, [string, number][]>,
): { data: [string, number][]; label: string } | null {
  const keys = Object.keys(source).sort();

  if (keys.length === 0) {
    return null;
  }

  const totals: Record<string, number> = {};

  for (const key of keys) {
    for (const [name, value] of source[key]) {
      totals[name] = (totals[name] || 0) + value;
    }
  }

  const count = keys.length;
  const averaged: [string, number][] = Object.entries(totals)
    .map(([name, sum]) => [name, sum / count] as [string, number])
    .sort(([, a], [, b]) => b - a);

  const firstDate = new Date(keys[0]);
  const lastDate = new Date(keys[keys.length - 1]);
  const fmt = (d: Date) => d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  const label = keys.length === 1 ? fmt(firstDate) : `${fmt(firstDate)} – ${fmt(lastDate)}`;

  return { data: averaged, label };
}

const stylesData = computed(() => {
  if (!stats.value) {
    return null;
  }

  return averageWeekly(stats.value.styles);
});

const versionsData = computed(() => {
  if (!stats.value) {
    return null;
  }

  return averageWeekly(stats.value.versions);
});

const formatsData = computed(() => {
  if (!stats.value) {
    return null;
  }

  return averageWeekly(stats.value.formats);
});

const showAllStyles = ref(false);
const activeTab = ref<'api' | 'npm'>('api');

const requestsPerSecond = computed(() => {
  if (!stats.value) {
    return 0;
  }

  const entries = Object.entries(stats.value.requests).sort(([a], [b]) => a.localeCompare(b));

  if (entries.length < 2) {
    return 0;
  }

  entries.pop();

  const window = entries.slice(-ROLLING_WINDOW_DAYS);
  const total = window.reduce((sum, [, v]) => sum + v, 0);
  const avgDaily = total / window.length;

  return avgDaily / SECONDS_PER_DAY;
});

const monthlyStats = computed(() => {
  if (!stats.value) {
    return null;
  }

  const requests = lastCompleteMonth(stats.value.requests);
  const traffic = lastCompleteMonth(stats.value.traffic);
  const downloads = lastCompleteMonth(stats.value.downloads.npm);

  if (!requests) {
    return null;
  }

  return {
    label: requests.label,
    requests: formatNumber(requests.total),
    traffic: traffic ? formatBytes(traffic.total) : null,
    downloads: downloads ? formatNumber(downloads.total) : null,
  };
});
</script>

<template>
  <AppSmallHero badge="统计">
    <template #headline>数十亿头像。<br><strong>一个 API。</strong></template>
    <template #description>通过我们的 HTTP API 生成的每个头像都会匿名记录。这一页展示真实使用数据，按请求、流量、风格等维度每日更新。</template>
    <template #actions><!-- no actions --></template>
    <template #below-actions>
      <div v-if="monthlyStats" class="page-stats-hero-kpis">
        <p class="page-stats-hero-kpis-label">
          {{ monthlyStats.label }} 的统计数据
        </p>
        <div class="page-stats-hero-kpis-row">
          <div class="page-stats-hero-kpi">
            <span class="page-stats-hero-kpi-value">{{
              monthlyStats.requests
            }}</span>
            <span class="page-stats-hero-kpi-label">API 请求</span>
          </div>
          <div class="page-stats-hero-kpi-divider"></div>
          <div v-if="monthlyStats.traffic" class="page-stats-hero-kpi">
            <span class="page-stats-hero-kpi-value">{{
              monthlyStats.traffic
            }}</span>
            <span class="page-stats-hero-kpi-label">数据传输</span>
          </div>
          <div
            v-if="monthlyStats.downloads"
            class="page-stats-hero-kpi-divider"
          ></div>
          <div v-if="monthlyStats.downloads" class="page-stats-hero-kpi">
            <span class="page-stats-hero-kpi-value">{{
              monthlyStats.downloads
            }}</span>
            <span class="page-stats-hero-kpi-label">npm 下载量</span>
          </div>
        </div>
      </div>
    </template>
    <template #aside>
      <ClientOnly>
        <AppStatsGlobe :rate="requestsPerSecond" />
      </ClientOnly>
    </template>
  </AppSmallHero>

  <UiSection divider>
    <UiContainer>
      <UiSectionHeader
        badge="每日趋势"
        description="每日请求和下载量，可在 HTTP API 与 npm 包之间切换。"
      >
        <template #headline>随<strong>时间</strong>变化的使用情况</template>
      </UiSectionHeader>

      <div class="page-stats-tabs">
        <button
          :class="{ active: activeTab === 'api' }"
          @click="activeTab = 'api'"
        >
          HTTP 接口
        </button>
        <button
          :class="{ active: activeTab === 'npm' }"
          @click="activeTab = 'npm'"
        >
          npm 包
        </button>
      </div>

      <ClientOnly>
        <UiCard
          v-if="requestsData && activeTab === 'api'"
          class="page-stats-chart-card"
        >
          <h3 class="page-stats-chart-title">API 请求</h3>
          <AppStatsChart
            :labels="requestsData.labels"
            :values="requestsData.values"
            color="#1689cc"
            :format-value="formatNumber"
          />
        </UiCard>

        <UiCard
          v-if="downloadsData && activeTab === 'npm'"
          class="page-stats-chart-card"
        >
          <h3 class="page-stats-chart-title">包下载量</h3>
          <AppStatsChart
            :labels="downloadsData.labels"
            :values="downloadsData.values"
            color="#cb3837"
            :format-value="formatNumber"
          />
        </UiCard>
      </ClientOnly>
    </UiContainer>
  </UiSection>

  <UiSection divider>
    <UiContainer>
      <UiSectionHeader
        badge="细分数据"
        description="基于 API 请求数据，展示最常用的风格、版本和输出格式。"
      >
        <template #headline>使用<strong>明细</strong></template>
      </UiSectionHeader>

      <ClientOnly>
        <UiCard v-if="stylesData" class="page-stats-styles-card">
          <h3 class="page-stats-chart-title">
            热门风格
            <span class="page-stats-chart-subtitle">{{
              stylesData.label
            }}</span>
          </h3>
          <AppStatsBarChart
            :data="
              showAllStyles ? stylesData.data : stylesData.data.slice(0, 10)
            "
          />
          <button
            class="page-stats-show-all"
            @click="showAllStyles = !showAllStyles"
          >
            {{ showAllStyles ? '仅看前 10 项' : '查看全部' }}
          </button>
        </UiCard>

        <div class="page-stats-pies">
          <UiCard v-if="versionsData" class="page-stats-pie-card">
            <h3 class="page-stats-chart-title">
              API 版本
              <span class="page-stats-chart-subtitle">{{
                versionsData.label
              }}</span>
            </h3>
            <AppStatsPieChart :data="versionsData.data" />
          </UiCard>

          <UiCard v-if="formatsData" class="page-stats-pie-card">
            <h3 class="page-stats-chart-title">
              输出格式
              <span class="page-stats-chart-subtitle">{{
                formatsData.label
              }}</span>
            </h3>
            <AppStatsPieChart :data="formatsData.data" />
          </UiCard>
        </div>
      </ClientOnly>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.page-stats-hero-kpis {
  margin-top: 32px;

  &-label {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--vp-c-text-3);
    margin: 0 0 16px;
  }

  &-row {
    display: flex;
    align-items: center;
    gap: 28px;
  }
}

.page-stats-hero-kpi {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &-value {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--vp-c-text-1);
    font-variant-numeric: tabular-nums;
  }

  &-label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--vp-c-text-3);
  }

  &-divider {
    width: 1px;
    height: 40px;
    background: linear-gradient(
      180deg,
      transparent,
      var(--vp-c-border),
      transparent
    );
  }
}

.page-stats-tabs {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 32px;
  background: var(--vp-c-bg-alt);
  border-radius: var(--vp-radius-sm);
  padding: 4px;
  width: fit-content;
  margin-inline: auto;

  button {
    padding: 8px 24px;
    border: none;
    background: transparent;
    color: var(--vp-c-text-2);
    font-size: 14px;
    font-weight: 500;
    border-radius: var(--vp-radius-xs);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-smooth);

    &.active {
      background: var(--vp-c-bg-elv);
      color: var(--vp-c-text-1);
      box-shadow: var(--vp-shadow-1);
    }

    &:hover:not(.active) {
      color: var(--vp-c-text-1);
    }
  }
}

.page-stats-chart-card {
  overflow: hidden;
}

.page-stats-chart-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 24px;
}

.page-stats-chart-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: var(--vp-c-text-2);
}

.page-stats-show-all {
  display: block;
  margin: 16px auto 0;
  padding: 6px 16px;
  border: 1px solid var(--vp-c-border);
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--vp-radius-xs);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);

  &:hover {
    color: var(--vp-c-text-1);
    border-color: var(--vp-c-text-2);
  }
}

.page-stats-styles-card {
  margin-bottom: 32px;
}

.page-stats-pies {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;

  > * {
    min-width: 0;
    overflow: hidden;
  }
}

@media (max-width: 768px) {
  .page-stats-hero-kpis {
    text-align: center;

    &-label {
      text-align: center;
    }

    &-row {
      justify-content: center;
      flex-wrap: wrap;
    }
  }

  .page-stats-hero-kpi {
    align-items: center;
  }

  .page-stats-pies {
    grid-template-columns: 1fr;
  }
}
</style>
