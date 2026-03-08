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
    :class="['ui-button', `ui-button-${variant ?? 'primary'}`]"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener' : undefined"
  >
    <slot />
  </a>
</template>

<style lang="scss" scoped>
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: var(--vp-radius-sm);
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  transition:
    transform var(--duration-mid, 0.35s) var(--ease-spring, cubic-bezier(0.34, 1.56, 0.64, 1)),
    box-shadow var(--duration-mid, 0.35s) ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
  position: relative;
  letter-spacing: -0.01em;

  &::after {
    display: none !important;
  }

  /* Primary variant */
  &-primary {
    background-color: var(--vp-c-brand-1);
    color: white;
    box-shadow:
      0 4px 20px color-mix(in srgb, var(--vp-c-brand-1) 25%, transparent);

    &:hover {
      transform: translateY(-4px) scale(1.02);
      background-color: var(--vp-c-brand-2);
      box-shadow:
        0 12px 32px color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent);
    }

    &:active {
      transform: translateY(-1px) scale(0.98);
    }
  }

  /* Secondary variant */
  &-secondary {
    background: var(--vp-c-bg-elv);
    color: var(--vp-c-text-1);
    padding: 14px 30px;
    border: 2px solid var(--vp-c-border);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    &:hover {
      border-color: var(--vp-c-brand-1);
      color: var(--vp-c-brand-1);
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
    }

    &:active {
      transform: translateY(-1px) scale(0.98);
    }
  }

  /* GitHub variant */
  &-github {
    background: var(--vp-c-text-1);
    color: var(--vp-c-bg);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);

    &:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    }

    &:active {
      transform: translateY(-1px) scale(0.98);
    }
  }
}
</style>
