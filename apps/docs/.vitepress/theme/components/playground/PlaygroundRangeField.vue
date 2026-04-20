<script setup lang="ts">
import Slider from 'primevue/slider';
import Button from 'primevue/button';
import { ArrowLeftRight } from '@lucide/vue';
import useStore from '@theme/stores/playground';
import { useRangeField } from '@theme/composables/useRangeField';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';

const props = withDefaults(
  defineProps<{
    label: string;
    optionKey: string;
    min: number;
    max: number;
    step: number;
    unit?: string;
    defaultSingle: number;
    defaultRange?: readonly number[];
  }>(),
  {
    unit: '',
  },
);

const store = useStore();
const { rangeMode, isRangeMode, toggleRangeMode, resetRangeField, singleComputed, rangeComputed } = useRangeField(store.avatarStyleOptions);

const hasDefaultRange = props.defaultRange?.length === 2;

if (hasDefaultRange) {
  rangeMode[props.optionKey] = true;
}

const singleVal = singleComputed(props.optionKey, props.defaultSingle);
const rangeVal = rangeComputed(props.optionKey, props.defaultRange ?? props.defaultSingle);
</script>

<template>
  <div class="pg-field">
    <div class="pg-field-label">
      <span>{{ label }}</span>
      <Button
        size="small"
        :severity="isRangeMode(optionKey) ? 'primary' : 'secondary'"
        v-tooltip="isRangeMode(optionKey) ? 'Switch to fixed value' : 'Switch to range'"
        @click="toggleRangeMode(optionKey, defaultSingle)"
        class="pg-field-toggle"
      >
        <ArrowLeftRight :size="14" />
      </Button>
      <PlaygroundFieldReset v-if="store.isOptionSet(optionKey)" @click="resetRangeField(optionKey, defaultRange)" />
      <span class="pg-field-value" v-if="isRangeMode(optionKey)">{{ rangeVal[0] }}{{ unit }} — {{ rangeVal[1] }}{{ unit }}</span>
      <span class="pg-field-value" v-else>{{ singleVal }}{{ unit }}</span>
    </div>
    <Slider v-if="isRangeMode(optionKey)" v-model="rangeVal" :range="true" :min="min" :max="max" :step="step" />
    <Slider v-else v-model="singleVal" :min="min" :max="max" :step="step" />
  </div>
</template>
