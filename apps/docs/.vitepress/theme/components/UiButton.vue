<script setup lang="ts">
defineProps<{
  href: string;
  variant?: 'primary' | 'secondary' | 'github';
  external?: boolean;
}>();
</script>

<template>
  <a
    :href="href"
    :class="['ui-button', variant ?? 'primary']"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener' : undefined"
  >
    <slot />
  </a>
</template>

<style scoped>
.ui-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
}

.ui-button::after {
  display: none !important;
}

.ui-button :deep(svg) {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

/* Primary variant */
.ui-button.primary {
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-2) 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(22, 137, 204, 0.4);
}

.ui-button.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(22, 137, 204, 0.5);
}

/* Secondary variant */
.ui-button.secondary {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 2px solid var(--vp-c-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.dark .ui-button.secondary {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.ui-button.secondary:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.dark .ui-button.secondary:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.ui-button.secondary:hover :deep(svg) {
  transform: translateX(4px);
}

/* GitHub variant */
.ui-button.github {
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.ui-button.github:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .ui-button {
    justify-content: center;
  }
}
</style>
