<script setup lang="ts">
defineProps<{
  tag?: 'h1' | 'h2' | 'h3';
}>();
</script>

<template>
  <component :is="tag || 'h2'" class="ui-headline">
    <slot />
  </component>
</template>

<style scoped>
.ui-headline {
  font-size: 40px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  margin: 0 0 20px;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.ui-headline :deep(.highlight) {
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-purple-1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (max-width: 640px) {
  .ui-headline {
    font-size: 28px;
  }
}
</style>
