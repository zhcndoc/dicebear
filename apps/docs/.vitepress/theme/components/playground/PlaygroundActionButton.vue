<script setup lang="ts">
import { Tooltip } from '@ark-ui/vue/tooltip';

defineProps<{
  tooltip: string;
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <Tooltip.Root>
    <Tooltip.Trigger as-child>
      <button class="playground-action-button" @click="emit('click')">
        <slot />
      </button>
    </Tooltip.Trigger>
    <Tooltip.Positioner>
      <Tooltip.Content>{{ tooltip }}</Tooltip.Content>
    </Tooltip.Positioner>
  </Tooltip.Root>
</template>

<style scoped lang="scss">
.playground-action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
  }
}
</style>
