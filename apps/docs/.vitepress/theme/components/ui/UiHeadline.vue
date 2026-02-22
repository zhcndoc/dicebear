<script setup lang="ts">
defineProps<{
  tag?: 'h1' | 'h2' | 'h3';
  align?: 'center' | 'left';
}>();
</script>

<template>
  <component
    :is="tag || 'h2'"
    :class="[
      'ui-headline',
      `ui-headline-highlight-brand`,
      align === 'left' && 'ui-headline-left',
    ]"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.ui-headline {
  font-size: clamp(40px, 5vw, 52px);
  font-weight: 800;
  color: var(--vp-c-text-1);
  margin: 0 auto 24px;
  max-width: 700px;

  &-left {
    margin-left: 0;
    margin-right: auto;
    text-align: left;
  }
  line-height: 1.2;
  letter-spacing: -0.03em;
  text-wrap: balance;
  --hl-from: var(--vp-c-brand-1);
  --hl-to: var(--vp-c-purple-1);
  --hl-display: inline;

  @media (max-width: 640px) {
    font-size: 34px;
  }

  :deep(strong) {
    display: var(--hl-display, inline);
    background: linear-gradient(135deg, var(--hl-from) 0%, var(--hl-to) 100%);
    font-weight: 800;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
</style>
