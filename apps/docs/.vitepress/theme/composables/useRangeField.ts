import { reactive, computed } from 'vue';
import type { PlaygroundStoreOptions } from '@theme/types';

export function useRangeField(avatarStyleOptions: PlaygroundStoreOptions) {
  const rangeMode = reactive<Record<string, boolean>>({});

  function isRangeMode(key: string): boolean {
    if (rangeMode[key] !== undefined) return rangeMode[key];

    return Array.isArray(avatarStyleOptions[key]);
  }

  function toggleRangeMode(key: string, fallback: number) {
    const wasRange = isRangeMode(key);

    rangeMode[key] = !wasRange;

    if (wasRange) {
      const val = avatarStyleOptions[key];
      const single = Array.isArray(val) ? val[0] : (typeof val === 'number' ? val : fallback);

      avatarStyleOptions[key] = single;
    } else {
      const val = avatarStyleOptions[key];
      const single = typeof val === 'number' ? val : fallback;

      avatarStyleOptions[key] = [single, single];
    }
  }

  function singleComputed(key: string, fallback: number) {
    return computed({
      get: () => {
        const val = avatarStyleOptions[key];

        return typeof val === 'number' ? val : fallback;
      },
      set: (val: number) => {
        avatarStyleOptions[key] = val;
      },
    });
  }

  function rangeComputed(key: string, fallback: number | readonly number[]) {
    return computed<[number, number]>({
      get: () => {
        const val = avatarStyleOptions[key];

        if (Array.isArray(val) && val.length === 2) return [val[0], val[1]];
        if (typeof val === 'number') return [val, val];

        if (Array.isArray(fallback) && fallback.length === 2) return [fallback[0], fallback[1]];

        const fb = typeof fallback === 'number' ? fallback : 0;

        return [fb, fb];
      },
      set: (val: [number, number]) => {
        avatarStyleOptions[key] = [val[0], val[1]];
      },
    });
  }

  return {
    rangeMode,
    isRangeMode,
    toggleRangeMode,
    singleComputed,
    rangeComputed,
  };
}
