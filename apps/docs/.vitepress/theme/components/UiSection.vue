<script setup lang="ts">
defineProps<{
  background?: 'default' | 'soft';
  noPadding?: boolean;
  divider?: boolean;
  dividerBottom?: boolean;
}>();
</script>

<template>
  <section
    class="ui-section"
    :class="{
      'bg-soft': background === 'soft',
      'no-padding': noPadding,
      'has-divider': divider,
      'has-divider-bottom': dividerBottom,
    }"
  >
    <slot />
  </section>
</template>

<style scoped>
.ui-section {
  padding: 100px 24px;
  position: relative;
  overflow: hidden;
}

.ui-section.no-padding {
  padding-left: 0;
  padding-right: 0;
}

.ui-section.bg-soft {
  background: var(--vp-c-bg-soft);
}

.ui-section.has-divider::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--vp-c-border), transparent);
}

.ui-section.has-divider-bottom::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--vp-c-border), transparent);
}

@media (max-width: 640px) {
  .ui-section {
    padding: 80px 16px;
  }

  .ui-section.no-padding {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
