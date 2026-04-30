<script setup lang="ts">
import { inject, computed } from 'vue';
import { capitalCase } from 'change-case';
import Slider from 'primevue/slider';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import { Weight } from '@lucide/vue';
import PlaygroundRangeField from './PlaygroundRangeField.vue';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';
import useStore from '@theme/stores/playground';
import { useRangeField } from '@theme/composables/useRangeField';
import { useVariantWeights } from '@theme/composables/useVariantWeights';
import { componentPreviewKey, componentPreviewDefault } from '@theme/components/styles/styleOptionsKeys';

const props = defineProps<{
  componentName: string;
  extendsName?: string;
  usedByAliases?: readonly string[];
  variants: string[];
  hasProbability: boolean;
  hasRotate: boolean;
  hasTranslateX: boolean;
  hasTranslateY: boolean;
  hasScale: boolean;
  hasNonDefaultWeights: boolean;
  defaultWeights: Record<string, number | undefined>;
  defaultProbability: number;
  defaultRotate: readonly number[];
  defaultTranslateX: readonly number[];
  defaultTranslateY: readonly number[];
  defaultScale: readonly number[];
}>();

const aliasLabel = computed(() => (props.extendsName ? capitalCase(props.extendsName) : ''));
const usedByLabels = computed(() => (props.usedByAliases ?? []).map((a) => capitalCase(a)));

const store = useStore();
const preview = inject(componentPreviewKey, componentPreviewDefault);

const {
  showWeights,
  variantWeights,
  toggleWeights,
  toggleVariant,
  setWeight,
  selectAll,
  selectNone,
} = useVariantWeights(
  store.avatarStyleOptions,
  () => props.componentName,
  () => props.variants,
  () => props.hasNonDefaultWeights,
  () => props.defaultWeights,
);

const { singleComputed } = useRangeField(store.avatarStyleOptions);

const variantKey = `${props.componentName}Variant`;
const probabilityKey = `${props.componentName}Probability`;
const rotateKey = `${props.componentName}Rotate`;
const translateXKey = `${props.componentName}TranslateX`;
const translateYKey = `${props.componentName}TranslateY`;
const scaleKey = `${props.componentName}Scale`;

const probability = singleComputed(probabilityKey, () => props.defaultProbability);

const defaultRotateFallback = computed(() =>
  props.defaultRotate.length === 1 ? props.defaultRotate[0] : 0,
);
const defaultTranslateXFallback = computed(() =>
  props.defaultTranslateX.length === 1 ? props.defaultTranslateX[0] : 0,
);
const defaultTranslateYFallback = computed(() =>
  props.defaultTranslateY.length === 1 ? props.defaultTranslateY[0] : 0,
);
const defaultScaleFallback = computed(() =>
  props.defaultScale.length === 1 ? props.defaultScale[0] : 1,
);

const defaultRotateRange = computed(() =>
  props.defaultRotate.length === 2 ? props.defaultRotate : undefined,
);
const defaultTranslateXRange = computed(() =>
  props.defaultTranslateX.length === 2 ? props.defaultTranslateX : undefined,
);
const defaultTranslateYRange = computed(() =>
  props.defaultTranslateY.length === 2 ? props.defaultTranslateY : undefined,
);
const defaultScaleRange = computed(() =>
  props.defaultScale.length === 2 ? props.defaultScale : undefined,
);

function resetVariants() {
  store.resetOption(variantKey);
  showWeights.value = props.hasNonDefaultWeights;
}
</script>

<template>
  <div class="pg-comp-body">
    <p v-if="extendsName" class="pg-comp-info pg-comp-info-alias">
      Inherits from <strong>{{ aliasLabel }}</strong>. Override values to deviate; reset to inherit again.
    </p>
    <p
      v-else-if="usedByLabels.length > 0"
      class="pg-comp-info pg-comp-info-source"
    >
      Used by
      <template v-for="(label, i) in usedByLabels" :key="label">
        <strong>{{ label }}</strong><template v-if="i < usedByLabels.length - 1">, </template>
      </template>. Changes here propagate to these aliases unless they override.
    </p>

    <template v-if="variants.length > 0">
      <div class="pg-field-label">
        <span>Variants</span>
        <Button
          size="small"
          :severity="showWeights ? 'primary' : 'secondary'"
          v-tooltip="showWeights ? 'Hide weights' : 'Show weights'"
          @click="toggleWeights"
          class="pg-field-toggle"
        >
          <Weight :size="14" />
        </Button>
        <Button label="All" size="small" severity="secondary" @click="selectAll" class="pg-field-toggle" />
        <Button label="None" size="small" severity="secondary" @click="selectNone" class="pg-field-toggle" />
        <PlaygroundFieldReset v-if="store.isOptionSet(variantKey)" @click="resetVariants" />
      </div>
      <div class="pg-comp-variants-grid">
        <div
          v-for="variant in variants"
          :key="variant"
          class="pg-comp-variant"
          :class="{ 'pg-comp-variant-off': variantWeights[variant] === undefined }"
        >
          <button
            class="pg-comp-variant-btn"
            :class="{ 'pg-comp-variant-btn-active': variantWeights[variant] !== undefined }"
            @click="toggleVariant(variant)"
          >
            <img
              v-if="preview"
              :src="preview.toDataUri(componentName, variant)"
              alt=""
              class="pg-comp-variant-img"
            />
          </button>
          <span class="pg-comp-variant-name">{{ variant }}</span>
          <InputNumber
            v-if="showWeights && variantWeights[variant] !== undefined"
            v-tooltip="'Weight — higher values increase probability'"
            :model-value="variantWeights[variant]"
            @update:model-value="(val: number) => setWeight(variant, Math.max(0, val ?? 0))"
            :min="0"
            :min-fraction-digits="0"
            :max-fraction-digits="2"
            :show-buttons="false"
            locale="en-US"
            class="pg-comp-variant-weight"
          />
        </div>
      </div>
    </template>

    <div class="pg-field" v-if="hasProbability">
      <div class="pg-field-label">
        <span>Probability</span>
        <PlaygroundFieldReset v-if="store.isOptionSet(probabilityKey)" @click="store.resetOption(probabilityKey)" />
        <span class="pg-field-value">{{ probability }}%</span>
      </div>
      <Slider v-model="probability" :min="0" :max="100" :step="1" />
    </div>

    <PlaygroundRangeField
      v-if="hasRotate"
      label="Rotate"
      :option-key="rotateKey"
      :min="-360"
      :max="360"
      :step="1"
      unit="°"
      :default-single="defaultRotateFallback"
      :default-range="defaultRotateRange"
    />

    <PlaygroundRangeField
      v-if="hasTranslateX"
      label="Translate X"
      :option-key="translateXKey"
      :min="-100"
      :max="100"
      :step="1"
      unit="%"
      :default-single="defaultTranslateXFallback"
      :default-range="defaultTranslateXRange"
    />

    <PlaygroundRangeField
      v-if="hasTranslateY"
      label="Translate Y"
      :option-key="translateYKey"
      :min="-100"
      :max="100"
      :step="1"
      unit="%"
      :default-single="defaultTranslateYFallback"
      :default-range="defaultTranslateYRange"
    />

    <PlaygroundRangeField
      v-if="hasScale"
      label="Scale"
      :option-key="scaleKey"
      :min="0"
      :max="10"
      :step="0.01"
      :default-single="defaultScaleFallback"
      :default-range="defaultScaleRange"
    />
  </div>
</template>

<style scoped lang="scss">
.pg-comp-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pg-comp-info {
  margin: 0;
  padding: 8px 10px;
  border-radius: var(--vp-radius-xs);
  font-size: 12px;
  line-height: 1.5;
  color: var(--ui-c-text-muted);

  strong {
    color: var(--ui-c-text);
    font-weight: 600;
  }

  &-alias {
    background: var(--vp-c-brand-soft);
    border-left: 3px solid var(--p-primary-color);
  }

  &-source {
    background: var(--vp-c-bg-soft);
    border-left: 3px solid var(--vp-c-divider);
  }
}

.pg-comp-variants-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-top: 8px;
}

.pg-comp-variant {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  transition: opacity var(--duration-fast) ease;

  &-off {
    opacity: 0.25;
  }
}

.pg-comp-variant-btn {
  width: 100%;
  padding: 4px;
  border: 2px solid transparent;
  border-radius: var(--vp-radius-xs);
  background: none;
  cursor: pointer;
  transition: all var(--duration-fast) ease;

  &-active {
    border-color: var(--p-primary-color);
  }

  &:hover {
    border-color: var(--p-primary-200);
  }
}

.pg-comp-variant-img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  border-radius: 3px;
  background: repeating-conic-gradient(
      var(--ui-avatar-bg-1, rgba(0, 0, 0, 0.02)) 0% 25%,
      var(--ui-avatar-bg-2, rgba(0, 0, 0, 0.07)) 0% 50%
    )
    50% / 12px 12px;
}

.pg-comp-variant-name {
  font-size: 9px;
  color: var(--ui-c-text-subtle);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.pg-comp-variant-weight {
  width: 40px;

  :deep(input) {
    width: 40px;
    height: 20px;
    padding: 0 4px;
    font-size: 11px;
    text-align: center;
  }
}

</style>
