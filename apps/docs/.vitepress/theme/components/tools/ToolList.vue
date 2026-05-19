<script setup lang="ts">
import { ArrowRight, Contrast } from '@lucide/vue';
import type { Component } from 'vue';

type Tool = {
  slug: string;
  href: string;
  name: string;
  description: string;
  icon: Component;
  iconBg: string;
};

const tools: Tool[] = [
  {
    slug: 'contrast',
    href: '/tools/contrast/',
    name: 'WCAG Contrast Picker',
    description:
      'Explore which contrast color DiceBear would pick for any background. Uses the exact WCAG 2.1 contrast ratio implementation from <code>@dicebear/core</code>.',
    icon: Contrast,
    iconBg: 'linear-gradient(135deg, #1e293b 50%, #f8fafc 50%)',
  },
];
</script>

<template>
  <div class="tool-list">
    <div class="tool-list-grid">
      <a
        v-for="tool in tools"
        :key="tool.slug"
        :href="tool.href"
        class="tool-list-card"
      >
        <div class="tool-list-card-icon" :style="{ background: tool.iconBg }">
          <component :is="tool.icon" :size="28" />
        </div>

        <div class="tool-list-card-content">
          <h3 class="tool-list-card-name">{{ tool.name }}</h3>
          <p class="tool-list-card-description" v-html="tool.description" />
        </div>

        <div class="tool-list-card-arrow">
          <ArrowRight :size="18" />
        </div>
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tool-list {
  margin-top: 32px;
  margin-bottom: 96px;

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
  }

  &-card {
    display: flex;
    align-items: flex-start;
    gap: 18px;
    background: var(--vp-c-bg-soft);
    border-radius: var(--vp-radius-md);
    padding: 24px;
    text-decoration: none;
    transition: all var(--duration-fast) ease;
    border: 2px solid transparent;
    position: relative;

    &::after {
      display: none !important;
    }

    &:hover {
      border-color: var(--vp-c-brand-1);
      transform: translateY(-4px);
      box-shadow: var(--vp-shadow-3);
    }

    &-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--vp-radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--vp-c-brand-1);
      flex-shrink: 0;
      box-shadow: var(--vp-shadow-1);
      mix-blend-mode: normal;

      :deep(svg) {
        color: var(--vp-c-bg);
        filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.25));
      }
    }

    &-content {
      flex: 1;
      min-width: 0;
    }

    &-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--vp-c-text-1);
      margin: 0 0 8px;
    }

    &-description {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
      color: var(--vp-c-text-2);
    }

    &-arrow {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--vp-c-bg);
      border-radius: var(--vp-radius-xs);
      opacity: 0;
      transform: translateX(-8px);
      transition: all var(--duration-fast) ease;

      svg {
        color: var(--vp-c-brand-1);
      }
    }

    &:hover &-arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 640px) {
    &-grid {
      grid-template-columns: 1fr;
    }

    &-card-arrow {
      display: none;
    }
  }
}
</style>
