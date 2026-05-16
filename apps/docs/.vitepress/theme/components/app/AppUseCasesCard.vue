<script setup lang="ts">
import { UiCard } from '../ui';

defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <UiCard padding="md" radius="md" class="uc-card">
    <div class="uc-card-visual">
      <slot />
    </div>
    <h3 class="uc-card-title">{{ title }}</h3>
    <p class="uc-card-text">{{ description }}</p>
  </UiCard>
</template>

<style lang="scss" scoped>
.uc-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 340px;
  transition:
    transform var(--duration-mid) var(--ease-spring),
    box-shadow var(--duration-mid) var(--ease-smooth),
    border-color var(--duration-mid) var(--ease-smooth);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 48px -16px rgba(15, 23, 42, 0.14);
    border-color: var(--vp-c-brand-1);
  }

  &-title {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--vp-c-text-1);
    margin: 0;
  }

  &-text {
    font-size: 14.5px;
    line-height: 1.5;
    color: var(--vp-c-text-2);
    margin: 0;
  }

  &-visual {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;

    > * {
      width: 100%;
    }
  }
}
</style>
