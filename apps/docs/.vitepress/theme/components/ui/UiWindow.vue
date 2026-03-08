<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="ui-window">
    <div class="ui-window-header">
      <div class="ui-window-dots">
        <span class="ui-window-dot ui-window-dot-red"></span>
        <span class="ui-window-dot ui-window-dot-yellow"></span>
        <span class="ui-window-dot ui-window-dot-green"></span>
      </div>
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
  --ui-window-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.15), 0 8px 24px -8px rgba(0, 0, 0, 0.08);
}
.dark {
  --ui-window-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.5), 0 8px 24px -8px rgba(0, 0, 0, 0.3);
}
</style>

<style lang="scss" scoped>
.ui-window {
  position: relative;
  border-radius: var(--window-radius, var(--vp-radius-lg));
  overflow: hidden;
  background: var(--vp-c-bg-elv);
  box-shadow:
    0 0 0 1px var(--vp-c-border),
    var(--ui-window-shadow);
  transition: box-shadow var(--duration-mid) var(--ease-smooth);

  &-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    position: relative;
    z-index: 1;
    background: var(--vp-c-bg-soft);
    border-bottom: 1px solid var(--vp-c-border);

    &-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  &-dots {
    display: flex;
    gap: 8px;
  }

  &-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;

    &-red { background: #ff5f57; }
    &-yellow { background: #febc2e; }
    &-green { background: #28c840; }
  }

  &-title {
    flex: 1;
    font-size: 13px;
    font-weight: 600;
    font-family: var(--vp-font-family-base);
    color: var(--vp-c-text-2);
  }

  &-body {
    position: relative;
    z-index: 1;
  }
}
</style>
