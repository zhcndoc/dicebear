<script setup lang="ts">
import { useData } from 'vitepress';
import { Play, ArrowRight, Star } from '@lucide/vue';
import { siGithub } from 'simple-icons';
import type { ThemeOptions } from '@theme/types';
import { UiButton, UiIcon } from '../ui';
import { useTypewriter } from '../../composables/useTypewriter';

const TYPEWRITER_PHRASES = [
  '用户资料',
  '聊天应用',
  '游戏平台',
  '社交网络',
  '团队工具',
  '任何项目',
];

const { theme } = useData<ThemeOptions>();
const { displayedText } = useTypewriter(TYPEWRITER_PHRASES);
</script>

<template>
  <div class="app-hero-content">
    <a
      href="https://github.com/dicebear/dicebear"
      target="_blank"
      rel="noopener"
      class="app-hero-badge"
    >
      <UiIcon :path="siGithub.path" :size="14" class="app-hero-badge-icon" />
      <span>开源头像库</span>
      <span class="app-hero-badge-divider"></span>
      <Star :size="13" class="app-hero-badge-star" />
      <span class="app-hero-badge-count">{{ theme.githubStars?.['dicebear/dicebear'] || '8k+' }}</span>
    </a>

    <h1 class="app-hero-title">
      <span class="app-hero-title-line">为以下场景打造独特头像</span>
      <span class="app-hero-title-dynamic">
        <span class="app-hero-title-text">{{ displayedText }}</span>
        <span class="app-hero-cursor"></span>
      </span>
    </h1>

    <p class="app-hero-description">
      DiceBear 是一个注重隐私的开源头像库，提供由优秀设计师打造的
      <span class="app-hero-highlight" style="white-space: nowrap">30+ 种 SVG 风格</span>。
      通过 API、JS 库和 CLI 生成确定性的个人资料图片。
    </p>

    <div class="app-hero-actions">
      <UiButton href="/playground/" class="app-hero-btn-primary app-hero-action-btn">
        <Play :size="20" />
        试用 Playground
      </UiButton>
      <UiButton href="/introduction/" variant="secondary" class="app-hero-action-btn">
        立即开始
        <ArrowRight :size="20" class="app-hero-arrow-icon" />
      </UiButton>
    </div>
  </div>
</template>
