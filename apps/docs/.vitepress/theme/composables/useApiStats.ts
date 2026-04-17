import { ref, onMounted } from 'vue';

const STATS_API_URL = 'https://api.dicebear.com/stats.json';
const MONTH_KEY_LENGTH = 7;

export interface StatsData {
  requests: Record<string, number>;
  traffic: Record<string, number>;
  downloads: { npm: Record<string, number> };
  styles: Record<string, [string, number][]>;
  versions: Record<string, [string, number][]>;
  formats: Record<string, [string, number][]>;
}

interface ApiStats {
  monthlyRequests: number;
  monthlyTraffic: number;
  monthlyNpmDownloads: number;
  monthLabel: string;
}

const cached = ref<ApiStats | null>(null);
const rawData = ref<StatsData | null>(null);
let fetching: Promise<void> | null = null;

export function lastCompleteMonth(
  daily: Record<string, number>,
): { total: number; label: string } | null {
  const monthly: Record<string, number> = {};

  for (const [date, value] of Object.entries(daily)) {
    const key = date.slice(0, MONTH_KEY_LENGTH);
    monthly[key] = (monthly[key] || 0) + value;
  }

  const keys = Object.keys(monthly).sort();

  if (keys.length < 2) {
    return null;
  }

  const lastKey = keys[keys.length - 2];
  const [y, m] = lastKey.split('-');
  const label = new Date(Number(y), Number(m) - 1).toLocaleDateString('en', {
    month: 'short',
    year: 'numeric',
  });

  return { total: monthly[lastKey], label };
}

async function doFetch() {
  try {
    const res = await fetch(STATS_API_URL);
    const data: StatsData = await res.json();
    rawData.value = data;

    const requests = lastCompleteMonth(data.requests);
    const traffic = lastCompleteMonth(data.traffic);
    const npmDownloads = lastCompleteMonth(data.downloads.npm);

    if (!requests || !traffic) {
      return;
    }

    cached.value = {
      monthlyRequests: requests.total,
      monthlyTraffic: traffic.total,
      monthlyNpmDownloads: npmDownloads?.total ?? 0,
      monthLabel: requests.label,
    };
  } catch (err) {
    console.warn('[useApiStats] Failed to fetch stats:', err);
  } finally {
    fetching = null;
  }
}

function ensureFetched() {
  if (!cached.value && !fetching) {
    fetching = doFetch();
  }
}

export function useApiStats() {
  onMounted(ensureFetched);

  return cached;
}

export function useApiStatsRaw() {
  onMounted(ensureFetched);

  return rawData;
}
