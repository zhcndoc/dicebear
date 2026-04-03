import { computed, ref, watch, type Ref } from 'vue';
import type { PlaygroundStoreOptions } from '@theme/types';

// Manages the 3-state variant weight system:
// - undefined = excluded (not in object, never considered)
// - 0 = active with weight 0 (fallback when all others also 0)
// - > 0 = active with that weight
export function useVariantWeights(
  avatarStyleOptions: PlaygroundStoreOptions,
  componentName: Ref<string> | (() => string),
  variants: Ref<string[]> | (() => string[]),
  hasNonDefaultWeights: Ref<boolean> | (() => boolean),
) {
  const getName = typeof componentName === 'function' ? componentName : () => componentName.value;
  const getVariants = typeof variants === 'function' ? variants : () => variants.value;
  const getNonDefault = typeof hasNonDefaultWeights === 'function' ? hasNonDefaultWeights : () => hasNonDefaultWeights.value;

  const variantKey = computed(() => `${getName()}Variant`);

  const showWeights = ref(false);

  // Re-initialize showWeights when component/style changes
  watch(
    () => `${getName()}-${getVariants().length}-${getNonDefault()}`,
    () => {
      const storeVal = avatarStyleOptions[variantKey.value];

      showWeights.value =
        (typeof storeVal === 'object' && !Array.isArray(storeVal)) || getNonDefault();
    },
    { immediate: true },
  );

  const variantWeights = computed<Record<string, number | undefined>>({
    get: () => {
      const val = avatarStyleOptions[variantKey.value];
      const currentVariants = getVariants();

      if (val === undefined) {
        return Object.fromEntries(currentVariants.map((v) => [v, 1]));
      }

      if (Array.isArray(val)) {
        return Object.fromEntries(currentVariants.map((v) => [v, val.includes(v) ? 1 : undefined]));
      }

      if (typeof val === 'object') {
        const obj = val as Record<string, number>;

        return Object.fromEntries(
          currentVariants.map((v) => [v, v in obj ? obj[v] : undefined]),
        );
      }

      if (typeof val === 'string') {
        return Object.fromEntries(currentVariants.map((v) => [v, v === val ? 1 : undefined]));
      }

      return Object.fromEntries(currentVariants.map((v) => [v, 1]));
    },
    set: (weights: Record<string, number | undefined>) => {
      const currentVariants = getVariants();
      const defined = Object.entries(weights).filter(([, w]) => w !== undefined) as [string, number][];
      const allDefault = defined.length === currentVariants.length && defined.every(([, w]) => w === 1);

      if (allDefault) {
        delete avatarStyleOptions[variantKey.value];

        return;
      }

      if (showWeights.value) {
        avatarStyleOptions[variantKey.value] = Object.fromEntries(defined);
      } else {
        const active = defined.filter(([, w]) => w > 0).map(([name]) => name);

        avatarStyleOptions[variantKey.value] = active;
      }
    },
  });

  function toggleWeights() {
    showWeights.value = !showWeights.value;

    if (!showWeights.value) {
      const weights = variantWeights.value;
      const currentVariants = getVariants();
      const active = Object.entries(weights)
        .filter(([, w]) => w !== undefined && w > 0)
        .map(([name]) => name);

      if (active.length === currentVariants.length) {
        delete avatarStyleOptions[variantKey.value];
      } else {
        avatarStyleOptions[variantKey.value] = active;
      }
    }
  }

  function toggleVariant(variant: string) {
    const weights = { ...variantWeights.value };

    if (showWeights.value) {
      weights[variant] = weights[variant] !== undefined ? undefined : 1;
    } else {
      weights[variant] = weights[variant] !== undefined && weights[variant]! > 0 ? undefined : 1;
    }

    variantWeights.value = weights;
  }

  function setWeight(variant: string, weight: number) {
    const weights = { ...variantWeights.value };

    weights[variant] = weight;
    variantWeights.value = weights;
  }

  function selectAll() {
    variantWeights.value = Object.fromEntries(getVariants().map((v) => [v, 1]));
  }

  function selectNone() {
    variantWeights.value = Object.fromEntries(getVariants().map((v) => [v, undefined]));
  }

  return {
    showWeights,
    variantWeights,
    toggleWeights,
    toggleVariant,
    setWeight,
    selectAll,
    selectNone,
  };
}
