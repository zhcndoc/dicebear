<script setup lang="ts">
import { useData } from 'vitepress';
import { Play, ArrowRight, Star } from '@lucide/vue';
import { siGithub } from 'simple-icons';
import type { ThemeOptions } from '@theme/types';
import { UiButton, UiIcon } from '../ui';
import { useTypewriter } from '../../composables/useTypewriter';

const TYPEWRITER_PHRASES = [
  'user profiles',
  'chat applications',
  'gaming platforms',
  'social networks',
  'team tools',
  'any project',
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
      <span>Open Source Avatar Library</span>
      <span class="app-hero-badge-divider"></span>
      <Star :size="13" class="app-hero-badge-star" />
      <span class="app-hero-badge-count">{{ theme.githubStars?.['dicebear/dicebear'] || '8k+' }}</span>
    </a>

    <h1 class="app-hero-title">
      <span class="app-hero-title-line">Unique Avatars for</span>
      <span class="app-hero-title-dynamic">
        <span class="app-hero-title-text">{{ displayedText }}</span>
        <span class="app-hero-cursor"></span>
      </span>
    </h1>

    <p class="app-hero-description">
      DiceBear is a privacy-focused, open source avatar library with
      <span class="app-hero-highlight" style="white-space: nowrap">30+ SVG styles</span>&nbsp;crafted by talented artists.
      Generate deterministic profile pictures via API, JS&nbsp;library &amp; CLI.
    </p>

    <div class="app-hero-actions">
      <UiButton href="/playground/" class="app-hero-btn-primary app-hero-action-btn">
        <Play :size="20" />
        Try Playground
      </UiButton>
      <UiButton href="/introduction/" variant="secondary" class="app-hero-action-btn">
        Get Started
        <ArrowRight :size="20" class="app-hero-arrow-icon" />
      </UiButton>
    </div>
  </div>
</template>
