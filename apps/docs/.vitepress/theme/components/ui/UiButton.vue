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
  border-radius: 14px;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;

  &::after {
    display: none !important;
  }

  /* Primary variant */
  &-primary {
    background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-2) 100%);
    color: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }
  }


  /* Secondary variant */
  &-secondary {
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
    padding: 14px 30px;
    border: 2px solid var(--vp-c-border);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

    &:hover {
      border-color: var(--vp-c-brand-1);
      color: var(--vp-c-brand-1);
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }
  }

  /* GitHub variant */
  &-github {
    background: var(--vp-c-text-1);
    color: var(--vp-c-bg);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }
  }
}

</style>
