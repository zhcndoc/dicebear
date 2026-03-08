import { ref, watch } from 'vue';
import { useData } from 'vitepress';

const chartKey = ref(0);
let watcherSet = false;

export function useChartTheme() {
  const { isDark } = useData();

  if (!watcherSet) {
    watcherSet = true;
    watch(isDark, () => {
      chartKey.value++;
    });
  }

  function tooltipConfig() {
    return {
      backgroundColor: isDark.value ? '#1a1a1a' : '#fff',
      titleColor: isDark.value ? '#e5e5e5' : '#333',
      bodyColor: isDark.value ? '#ccc' : '#666',
      borderColor: isDark.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      borderWidth: 1,
      padding: 12,
    };
  }

  function gridColor() {
    return isDark.value ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  }

  function tickColor(opacity = 0.4) {
    return isDark.value ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`;
  }

  return { chartKey, tooltipConfig, gridColor, tickColor };
}
