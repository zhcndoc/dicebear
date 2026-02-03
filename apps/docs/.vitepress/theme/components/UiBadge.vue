<script setup lang="ts">
defineProps<{
  variant?: 'brand' | 'green';
}>();
</script>

<template>
  <span class="ui-badge" :class="variant || 'brand'">
    <slot />
  </span>
</template>

<style scoped>
.ui-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 24px;
}

.ui-badge.brand {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.ui-badge.green {
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green-1);
}
</style>
