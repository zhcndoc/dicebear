<script setup lang="ts">
import { computed } from 'vue';
import { Trash2, ArrowLeftRight } from '@lucide/vue';
import Button from 'primevue/button';
import Select from 'primevue/select';
import Slider from 'primevue/slider';
import useStore from '@theme/stores/playground';
import { useRangeField } from '@theme/composables/useRangeField';
import { stripHash } from '@theme/utils/avatar';
import PlaygroundColorPicker from './PlaygroundColorPicker.vue';

const props = defineProps<{
  colorName: string;
  defaultValues: string[];
  hasFill: boolean;
  hasAngle: boolean;
  hasFillStops: boolean;
}>();

const store = useStore();
const colorKey = computed(() => `${props.colorName}Color`);


const colors = computed<string[]>({
  get: () => {
    const val = store.avatarStyleOptions[colorKey.value];

    if (Array.isArray(val)) return val;

    return props.defaultValues;
  },
  set: (val: string[]) => {
    // If setting back to exactly the defaults, remove from store
    if (
      val.length === props.defaultValues.length &&
      val.every((v, i) => v === props.defaultValues[i])
    ) {
      delete store.avatarStyleOptions[colorKey.value];
    } else {
      store.avatarStyleOptions[colorKey.value] = [...val];
    }
  },
});

function addColor(hex: string) {
  if (!hex) return;

  const clean = stripHash(hex).toLowerCase();

  if (colors.value.includes(clean)) return;

  colors.value = [...colors.value, clean];
}

function removeColor(index: number) {
  const next = [...colors.value];

  next.splice(index, 1);
  colors.value = next;
}


const fillKey = computed(() => `${colorKey.value}Fill`);
const angleKey = computed(() => `${colorKey.value}Angle`);
const fillStopsKey = computed(() => `${colorKey.value}FillStops`);

const fillOptions = [
  { label: 'Solid', value: 'solid' },
  { label: 'Linear', value: 'linear' },
  { label: 'Radial', value: 'radial' },
];

const fill = computed({
  get: () => {
    const val = store.avatarStyleOptions[fillKey.value];

    if (Array.isArray(val)) return val[0] ?? 'solid';

    return typeof val === 'string' ? val : 'solid';
  },
  set: (val: string) => {
    if (val === 'solid') {
      delete store.avatarStyleOptions[fillKey.value];
    } else {
      store.avatarStyleOptions[fillKey.value] = [val];
    }
  },
});

const { isRangeMode, toggleRangeMode, singleComputed, rangeComputed } = useRangeField(store.avatarStyleOptions);

const angleSingle = singleComputed(angleKey.value, 0);
const angleRange = rangeComputed(angleKey.value, 0);

const fillStopsSingle = singleComputed(fillStopsKey.value, 2);
const fillStopsRange = rangeComputed(fillStopsKey.value, 2);
</script>

<template>
  <div class="pg-color">
    <label class="pg-color-label">Color</label>
    <div class="pg-color-grid">
      <div
        v-for="(color, i) in colors"
        :key="i"
        class="pg-color-tile"
        :style="{ '--tile-color': `#${color}` }"
        @click="removeColor(i)"
      >
        <div class="pg-color-tile-delete">
          <Trash2 :size="16" />
        </div>
      </div>
      <PlaygroundColorPicker
        :preset-colors="props.defaultValues"
        :colors="colors"
        @add="addColor"
      />
    </div>

    <template v-if="hasFill && colors.length > 0">
      <div class="pg-field">
        <div class="pg-field-label">Fill</div>
        <Select v-model="fill" :options="fillOptions" option-label="label" option-value="value" class="pg-color-fill-select" />
      </div>

      <div class="pg-field" v-if="hasAngle && fill !== 'solid'">
        <div class="pg-field-label">
          <span>Angle</span>
          <Button
            size="small"
            :severity="isRangeMode(angleKey) ? 'primary' : 'secondary'"
            v-tooltip="isRangeMode(angleKey) ? 'Switch to fixed value' : 'Switch to range'"
            @click="toggleRangeMode(angleKey, 0)"
            class="pg-field-toggle"
          >
            <ArrowLeftRight :size="14" />
          </Button>
          <span class="pg-field-value" v-if="isRangeMode(angleKey)">{{ angleRange[0] }}° — {{ angleRange[1] }}°</span>
          <span class="pg-field-value" v-else>{{ angleSingle }}°</span>
        </div>
        <Slider v-if="isRangeMode(angleKey)" v-model="angleRange" :range="true" :min="-360" :max="360" :step="1" />
        <Slider v-else v-model="angleSingle" :min="-360" :max="360" :step="1" />
      </div>

      <div class="pg-field" v-if="hasFillStops && fill !== 'solid'">
        <div class="pg-field-label">
          <span>Stops</span>
          <Button
            size="small"
            :severity="isRangeMode(fillStopsKey) ? 'primary' : 'secondary'"
            v-tooltip="isRangeMode(fillStopsKey) ? 'Switch to fixed value' : 'Switch to range'"
            @click="toggleRangeMode(fillStopsKey, 2)"
            class="pg-field-toggle"
          >
            <ArrowLeftRight :size="14" />
          </Button>
          <span class="pg-field-value" v-if="isRangeMode(fillStopsKey)">{{ fillStopsRange[0] }} — {{ fillStopsRange[1] }}</span>
          <span class="pg-field-value" v-else>{{ fillStopsSingle }}</span>
        </div>
        <Slider v-if="isRangeMode(fillStopsKey)" v-model="fillStopsRange" :range="true" :min="2" :max="5" :step="1" />
        <Slider v-else v-model="fillStopsSingle" :min="2" :max="5" :step="1" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.pg-color {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pg-color-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.pg-color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 6px;
}

.pg-color-tile {
  aspect-ratio: 1;
  border: 1px solid var(--pg-border);
  border-radius: var(--vp-radius-xs);
  background:
    repeating-conic-gradient(
      var(--vp-c-bg-soft) 0% 25%,
      var(--vp-c-bg) 0% 50%
    ) 50% / 10px 10px;
  cursor: pointer;
  transition: all var(--duration-fast) ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--tile-color);
    border-radius: calc(var(--vp-radius-xs) - 1px);
  }

  .pg-color-tile-delete {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    border-radius: calc(var(--vp-radius-xs) - 1px);
    color: white;
    opacity: 0;
    transition: opacity var(--duration-fast) ease;
    z-index: 1;
  }

  &:hover .pg-color-tile-delete {
    opacity: 1;
  }

}

.pg-color-fill-select {
  width: 100%;
}
</style>
