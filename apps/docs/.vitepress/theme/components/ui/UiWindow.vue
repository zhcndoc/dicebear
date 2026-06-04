<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="ui-window">
    <div class="ui-window-header">
      <span v-if="title" class="ui-window-accent" aria-hidden="true"></span>
      <span v-if="title" class="ui-window-title">{{ title }}</span>
      <div class="ui-window-header-actions">
        <slot name="header-actions" />
      </div>
    </div>
    <div class="ui-window-body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --ui-window-border-color: rgba(0, 0, 0, 0.1);
  --ui-window-divider-color: rgba(0, 0, 0, 0.05);
  --ui-window-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04), 0 18px 40px -16px rgba(0, 0, 0, 0.14);
}
.dark {
  --ui-window-border-color: rgba(255, 255, 255, 0.07);
  --ui-window-divider-color: rgba(255, 255, 255, 0.04);
  --ui-window-shadow:
    0 1px 2px rgba(0, 0, 0, 0.2), 0 8px 24px -16px rgba(0, 0, 0, 0.35);
}
</style>

<style lang="scss" scoped>
.ui-window {
  position: relative;
  border-radius: var(--window-radius, var(--vp-radius-sm));
  overflow: hidden;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--ui-window-border-color);
  box-shadow: var(--ui-window-shadow);
  transition:
    box-shadow var(--duration-mid) var(--ease-smooth),
    border-color var(--duration-mid) var(--ease-smooth);

  &-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    position: relative;
    z-index: 1;
    background: var(--vp-c-bg-soft);
    border-bottom: 1px solid var(--ui-window-divider-color);

    &-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  &-accent {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--vp-c-brand-1);
    box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
    flex-shrink: 0;
  }

  &-title {
    flex: 1;
    font-size: 13px;
    font-weight: 600;
    font-family: var(--vp-font-family-base);
    color: var(--vp-c-text-1);
    letter-spacing: -0.005em;
  }

  &-body {
    position: relative;
    z-index: 1;
  }
}
</style>
