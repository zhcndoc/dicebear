<script setup lang="ts">
defineProps<{
  variant?: 'light' | 'dark';
  title?: string;
}>();
</script>

<template>
  <div :class="['ui-window', variant || 'light']">
    <div class="window-header">
      <div class="window-dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <span v-if="title" class="window-title">{{ title }}</span>
      <div class="window-header-actions">
        <slot name="header-actions" />
      </div>
    </div>
    <div class="window-body">
      <slot />
    </div>
    <div v-if="variant === 'dark'" class="window-glow"></div>
  </div>
</template>

<style scoped>
.ui-window {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

/* Light variant */
.ui-window.light {
  background: var(--vp-c-bg);
  box-shadow:
    0 0 0 1px var(--vp-c-border),
    0 25px 60px -12px rgba(0, 0, 0, 0.25);
}

.dark .ui-window.light {
  box-shadow:
    0 0 0 1px var(--vp-c-border),
    0 25px 60px -12px rgba(0, 0, 0, 0.5);
}

/* Dark variant */
.ui-window.dark {
  background: #0d1117;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.1),
    0 20px 50px -12px rgba(0, 0, 0, 0.4);
}

/* Header */
.window-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  position: relative;
  z-index: 1;
}

.ui-window.light .window-header {
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-border);
}

.ui-window.dark .window-header {
  background: #161b22;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Dots */
.window-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red { background: #ff5f57; }
.dot.yellow { background: #febc2e; }
.dot.green { background: #28c840; }

/* Title */
.window-title {
  flex: 1;
  font-size: 13px;
  font-family: var(--vp-font-family-mono);
}

.ui-window.light .window-title {
  font-weight: 600;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-2);
}

.ui-window.dark .window-title {
  color: rgba(255, 255, 255, 0.5);
}

/* Header actions */
.window-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Body */
.window-body {
  position: relative;
  z-index: 1;
}

/* Glow effect for dark variant */
.window-glow {
  position: absolute;
  inset: -50%;
  background: conic-gradient(from 180deg at 50% 50%, #3b3b3b 0deg, #4a4a4a 120deg, #3b3b3b 240deg, #4a4a4a 360deg);
  opacity: 0.15;
  animation: glow-rotate 10s linear infinite;
}

@keyframes glow-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
