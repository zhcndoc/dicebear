<script setup lang="ts">
import { type Component } from 'vue';

defineProps<{
  label: string;
  color: string;
  icon?: Component;
}>();
</script>

<template>
  <span
    class="style-options-type-badge"
    :style="{ '--style-options-type-badge-color': color }"
  >
    <component v-if="icon" :is="icon" :size="13" />
    {{ label }}
  </span>
</template>

<style scoped lang="scss">
.style-options-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  color: var(--style-options-type-badge-color);
  background: color-mix(
    in srgb,
    var(--style-options-type-badge-color) 10%,
    transparent
  );
}
</style>
