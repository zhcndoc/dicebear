<script lang="ts">
import { Settings, Puzzle, Palette } from '@lucide/vue';

const categoryIcons = {
  general: Settings,
  component: Puzzle,
  color: Palette,
} as const;
</script>

<script setup lang="ts">
import { computed } from 'vue';
import StyleOptionsCard, { type OptionValue } from './StyleOptionsCard.vue';

const props = defineProps<{
  styleName: string;
  label: string;
  category: keyof typeof categoryIcons;
  options: Record<string, OptionValue>;
}>();

const icon = computed(() => categoryIcons[props.category]);

const optionCount = computed(() => Object.keys(props.options).length);
</script>

<template>
  <div class="style-options-group">
    <div class="style-options-group-header">
      <component :is="icon" :size="16" class="style-options-group-icon" />
      <span class="style-options-group-label">{{ label }}</span>
      <span class="style-options-group-count">{{ optionCount }}</span>
    </div>
    <div class="style-options-group-cards">
      <StyleOptionsCard
        v-for="(value, name) of options"
        :key="name"
        :style-name="styleName"
        :name="name"
        :value="value"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.style-options-group {
  &-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 0;
  }

  &-icon {
    color: var(--vp-c-text-3);
    flex-shrink: 0;
  }

  &-label {
    font-weight: 600;
  }

  &-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 99px;
    background: var(--vp-c-bg-soft);
    font-size: 12px;
    font-weight: 600;
    color: var(--vp-c-text-3);
  }

  &-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: hidden;
  }
}
</style>
