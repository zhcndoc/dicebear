<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  glow?: boolean;
}>();
</script>

<template>
  <div
    class="ui-icon-box"
    :class="[size || 'md', { 'has-glow': glow }]"
    :style="color ? { '--icon-color': color } : undefined"
  >
    <div class="icon-inner">
      <slot />
    </div>
    <div v-if="glow" class="icon-glow"></div>
  </div>
</template>

<style scoped>
.ui-icon-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  --icon-color: var(--vp-c-brand-1);
}

.icon-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--icon-color) 12%, transparent);
  border-radius: 12px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.ui-icon-box :deep(svg) {
  color: var(--icon-color);
}

/* Sizes */
.ui-icon-box.sm {
  width: 36px;
  height: 36px;
}

.ui-icon-box.sm .icon-inner {
  width: 36px;
  height: 36px;
  border-radius: 10px;
}

.ui-icon-box.sm :deep(svg) {
  width: 18px;
  height: 18px;
}

.ui-icon-box.md {
  width: 44px;
  height: 44px;
}

.ui-icon-box.md .icon-inner {
  width: 44px;
  height: 44px;
  border-radius: 12px;
}

.ui-icon-box.md :deep(svg) {
  width: 22px;
  height: 22px;
}

.ui-icon-box.lg {
  width: 56px;
  height: 56px;
}

.ui-icon-box.lg .icon-inner {
  width: 56px;
  height: 56px;
  border-radius: 16px;
}

.ui-icon-box.lg :deep(svg) {
  width: 28px;
  height: 28px;
}

/* Glow effect */
.icon-glow {
  position: absolute;
  inset: -10px;
  background: var(--icon-color);
  border-radius: 50%;
  filter: blur(30px);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.ui-icon-box.has-glow:hover .icon-inner {
  transform: scale(1.1);
  background: color-mix(in srgb, var(--icon-color) 18%, transparent);
}

.ui-icon-box.has-glow:hover .icon-glow {
  opacity: 0.15;
}
</style>
