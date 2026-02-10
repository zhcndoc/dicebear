<script setup lang="ts">
defineProps<{
  variant?: 'brand' | 'green' | 'orange';
}>();
</script>

<template>
  <span class="ui-badge" :class="`ui-badge-${variant || 'brand'}`">
    <slot />
  </span>
</template>

<style lang="scss" scoped>
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

  &-brand {
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
  }

  &-green {
    background: var(--vp-c-green-soft);
    color: var(--vp-c-green-1);
  }

  &-orange {
    background: var(--vp-c-yellow-soft);
    color: var(--vp-c-yellow-1);
  }
}
</style>
