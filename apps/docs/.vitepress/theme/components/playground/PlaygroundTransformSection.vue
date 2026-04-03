<script setup lang="ts">
import { computed } from 'vue';
import Slider from 'primevue/slider';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import { ArrowLeftRight } from '@lucide/vue';
import useStore from '@theme/stores/playground';
import { useRangeField } from '@theme/composables/useRangeField';

const store = useStore();
const { isRangeMode, toggleRangeMode, singleComputed, rangeComputed } = useRangeField(store.avatarStyleOptions);

const flipOptions = ['none', 'horizontal', 'vertical', 'both'];

const flip = computed({
  get: () => {
    const val = store.avatarStyleOptions['flip'];

    return typeof val === 'string' ? val : 'none';
  },
  set: (val: string) => {
    if (val === 'none') {
      delete store.avatarStyleOptions['flip'];
    } else {
      store.avatarStyleOptions['flip'] = val;
    }
  },
});

const rotateSingle = singleComputed('rotate', 0);
const rotateRange = rangeComputed('rotate', 0);
const scaleSingle = singleComputed('scale', 1);
const scaleRange = rangeComputed('scale', 1);
const borderRadius = singleComputed('borderRadius', 0);
const translateXSingle = singleComputed('translateX', 0);
const translateXRange = rangeComputed('translateX', 0);
const translateYSingle = singleComputed('translateY', 0);
const translateYRange = rangeComputed('translateY', 0);
</script>

<template>
  <div class="pg-transform">
    <div class="pg-transform-body">
      <div class="pg-field">
        <div class="pg-field-label">Flip</div>
        <SelectButton v-model="flip" :options="flipOptions" :allow-empty="false" />
      </div>

      <div class="pg-field">
        <div class="pg-field-label">
          <span>Rotate</span>
          <Button
            size="small"
            :severity="isRangeMode('rotate') ? 'primary' : 'secondary'"
            v-tooltip="isRangeMode('rotate') ? 'Switch to fixed value' : 'Switch to range'"
            @click="toggleRangeMode('rotate', 0)"
            class="pg-field-toggle"
          >
            <ArrowLeftRight :size="14" />
          </Button>
          <span class="pg-field-value" v-if="isRangeMode('rotate')">{{ rotateRange[0] }}° — {{ rotateRange[1] }}°</span>
          <span class="pg-field-value" v-else>{{ rotateSingle }}°</span>
        </div>
        <Slider v-if="isRangeMode('rotate')" v-model="rotateRange" :range="true" :min="-360" :max="360" :step="1" />
        <Slider v-else v-model="rotateSingle" :min="-360" :max="360" :step="1" />
      </div>

      <div class="pg-field">
        <div class="pg-field-label">
          <span>Scale</span>
          <Button
            size="small"
            :severity="isRangeMode('scale') ? 'primary' : 'secondary'"
            v-tooltip="isRangeMode('scale') ? 'Switch to fixed value' : 'Switch to range'"
            @click="toggleRangeMode('scale', 1)"
            class="pg-field-toggle"
          >
            <ArrowLeftRight :size="14" />
          </Button>
          <span class="pg-field-value" v-if="isRangeMode('scale')">{{ scaleRange[0] }} — {{ scaleRange[1] }}</span>
          <span class="pg-field-value" v-else>{{ scaleSingle }}</span>
        </div>
        <Slider v-if="isRangeMode('scale')" v-model="scaleRange" :range="true" :min="0" :max="2" :step="0.01" />
        <Slider v-else v-model="scaleSingle" :min="0" :max="2" :step="0.01" />
      </div>

      <div class="pg-field">
        <div class="pg-field-label">
          <span>Border Radius</span>
          <span class="pg-field-value">{{ borderRadius }}</span>
        </div>
        <Slider v-model="borderRadius" :min="0" :max="50" :step="1" />
      </div>

      <div class="pg-field">
        <div class="pg-field-label">
          <span>Translate X</span>
          <Button
            size="small"
            :severity="isRangeMode('translateX') ? 'primary' : 'secondary'"
            v-tooltip="isRangeMode('translateX') ? 'Switch to fixed value' : 'Switch to range'"
            @click="toggleRangeMode('translateX', 0)"
            class="pg-field-toggle"
          >
            <ArrowLeftRight :size="14" />
          </Button>
          <span class="pg-field-value" v-if="isRangeMode('translateX')">{{ translateXRange[0] }}% — {{ translateXRange[1] }}%</span>
          <span class="pg-field-value" v-else>{{ translateXSingle }}%</span>
        </div>
        <Slider v-if="isRangeMode('translateX')" v-model="translateXRange" :range="true" :min="-100" :max="100" :step="1" />
        <Slider v-else v-model="translateXSingle" :min="-100" :max="100" :step="1" />
      </div>

      <div class="pg-field">
        <div class="pg-field-label">
          <span>Translate Y</span>
          <Button
            size="small"
            :severity="isRangeMode('translateY') ? 'primary' : 'secondary'"
            v-tooltip="isRangeMode('translateY') ? 'Switch to fixed value' : 'Switch to range'"
            @click="toggleRangeMode('translateY', 0)"
            class="pg-field-toggle"
          >
            <ArrowLeftRight :size="14" />
          </Button>
          <span class="pg-field-value" v-if="isRangeMode('translateY')">{{ translateYRange[0] }}% — {{ translateYRange[1] }}%</span>
          <span class="pg-field-value" v-else>{{ translateYSingle }}%</span>
        </div>
        <Slider v-if="isRangeMode('translateY')" v-model="translateYRange" :range="true" :min="-100" :max="100" :step="1" />
        <Slider v-else v-model="translateYSingle" :min="-100" :max="100" :step="1" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-transform {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pg-transform-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

</style>
