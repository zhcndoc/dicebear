<script setup lang="ts">
import { computed } from 'vue';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import { Settings, Puzzle, Palette } from '@lucide/vue';
import StyleOptionsCard, { type OptionValue } from './StyleOptionsCard.vue';

const props = defineProps<{
  styleName: string;
  label: string;
  category: 'general' | 'component' | 'color';
  options: Record<string, OptionValue>;
  defaultExpanded?: boolean;
}>();

const icon = computed(() => {
  switch (props.category) {
    case 'general': return Settings;
    case 'component': return Puzzle;
    case 'color': return Palette;
  }
});

const optionCount = computed(() => Object.keys(props.options).length);

const EXPANDED: string[] = ['0'];
const COLLAPSED: string[] = [];

const expandedValues = computed(() => {
  return props.defaultExpanded ? EXPANDED : COLLAPSED;
});
</script>

<template>
  <Accordion :value="expandedValues" multiple class="style-options-group">
    <AccordionPanel value="0">
      <AccordionHeader>
        <span class="style-options-group-header">
          <component :is="icon" :size="16" class="style-options-group-icon" />
          <span class="style-options-group-label">{{ label }}</span>
          <span class="style-options-group-count">{{ optionCount }}</span>
        </span>
      </AccordionHeader>
      <AccordionContent>
        <div class="style-options-group-cards">
          <StyleOptionsCard
            v-for="(value, name) of options"
            :key="name"
            :style-name="styleName"
            :name="(name as string)"
            :value="value"
          />
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

<style scoped lang="scss">
.style-options-group {
  --p-accordion-panel-border-color: var(--vp-c-border);
  --p-accordion-header-padding: 14px 0;
  --p-accordion-content-padding: 0 0 16px 0;
  --p-accordion-header-background: transparent;
  --p-accordion-header-hover-background: transparent;
  --p-accordion-header-active-background: transparent;
  --p-accordion-header-active-hover-background: transparent;
  --p-accordion-content-background: transparent;
  --p-accordion-panel-border-width: 0;

  &-header {
    display: flex;
    align-items: center;
    gap: 8px;
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

<style>
/* Fix PrimeVue grid min-width overflow in accordion content */
.style-options-group .p-accordioncontent-wrapper {
    min-width: 0;
}
</style>
