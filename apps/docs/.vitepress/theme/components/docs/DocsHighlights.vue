<script setup lang="ts">
import type { Component } from 'vue';
import { UiIconBox } from '../ui';

defineProps<{
  highlights: Array<{
    icon: Component;
    title: string;
    description: string;
    color: string;
    link?: string;
  }>;
}>();
</script>

<template>
  <div class="docs-highlights">
    <component
      :is="highlight.link ? 'a' : 'div'"
      v-for="highlight in highlights"
      :key="highlight.title"
      :href="highlight.link"
      class="docs-highlights-card"
      :class="{ 'docs-highlights-card-link': highlight.link }"
    >
      <UiIconBox
        size="md"
        :color="highlight.color"
        class="docs-highlights-icon"
      >
        <component :is="highlight.icon" />
      </UiIconBox>
      <h3 class="docs-highlights-title">{{ highlight.title }}</h3>
      <p class="docs-highlights-desc">{{ highlight.description }}</p>
    </component>
  </div>
</template>

<style lang="scss" scoped>
.docs-highlights {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 24px 0;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  &-card {
    display: flex;
    flex-direction: column;
    gap: 0;
    background: var(--vp-c-bg);
    border: 1px solid var(--ui-card-border-color);
    border-radius: var(--vp-radius-lg);
    padding: 32px;
    transition: all var(--duration-mid) var(--ease-smooth);

    @media (max-width: 640px) {
      padding: 24px;
      border-radius: var(--vp-radius-lg);
    }

    &-link {
      text-decoration: none;
      cursor: pointer;

      &:hover {
        border-color: var(--vp-c-brand-1);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      }

      &::after {
        display: none !important;
      }
    }
  }

  &-icon {
    margin-bottom: 16px;
  }

  &-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--vp-c-text-1);
    margin: 0 0 8px;
    border: none;
    padding: 0;
  }

  &-desc {
    font-size: 14px;
    color: var(--vp-c-text-2);
    margin: 0;
    line-height: 1.7;
  }
}
</style>
