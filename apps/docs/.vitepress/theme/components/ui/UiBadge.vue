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
  padding: 8px 18px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin-bottom: 24px;

  &-brand {
    background: linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent), color-mix(in srgb, var(--vp-c-purple-1) 12%, transparent));
    color: var(--vp-c-brand-1);
  }

  &-green {
    background: linear-gradient(135deg, color-mix(in srgb, var(--vp-c-green-1) 15%, transparent), color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent));
    color: var(--vp-c-green-1);
  }

  &-orange {
    background: linear-gradient(135deg, color-mix(in srgb, var(--vp-c-yellow-1) 15%, transparent), color-mix(in srgb, var(--vp-c-coral-1, var(--vp-c-red-1)) 10%, transparent));
    color: var(--vp-c-yellow-1);
  }
}
</style>
