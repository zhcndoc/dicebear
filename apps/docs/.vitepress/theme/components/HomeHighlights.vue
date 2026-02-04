<script setup lang="ts">
import UiHeadline from './UiHeadline.vue';
import UiDescription from './UiDescription.vue';
import UiBadge from './UiBadge.vue';
import UiContainer from './UiContainer.vue';
import UiSection from './UiSection.vue';
import UiIconBox from './UiIconBox.vue';
import UiCard from './UiCard.vue';
import {
  mdiPalette,
  mdiTargetAccount,
  mdiLightningBolt,
  mdiTune,
  mdiPackageVariant,
} from '@mdi/js';
import { siGithub } from 'simple-icons';
import { useVisibility } from '../composables/useVisibility';

const isVisible = useVisibility('.highlights', { threshold: 0.15 });

const highlights = [
  {
    icon: mdiPalette,
    title: '30+ Avatar Styles',
    description: 'Carefully crafted styles from talented artists. Characters, abstract, pixel art, and more.',
    color: '#a855f7',
  },
  {
    icon: mdiTargetAccount,
    title: 'Deterministic',
    description: 'Same seed always generates the same avatar. Perfect for user profiles and consistent identities.',
    color: '#1689cc',
  },
  {
    icon: siGithub.path,
    title: '100% Open Source',
    description: 'MIT licensed core, transparent development. Contribute, fork, or self-host with confidence.',
    color: `#${siGithub.hex}`,
  },
  {
    icon: mdiLightningBolt,
    title: 'Lightning Fast',
    description: 'Global CDN delivers avatars in milliseconds. Optimized SVGs keep your pages fast.',
    color: '#f59e0b',
  },
  {
    icon: mdiTune,
    title: 'Fully Customizable',
    description: 'Colors, accessories, backgrounds, and more. Fine-tune every detail to match your brand.',
    color: '#22c55e',
  },
  {
    icon: mdiPackageVariant,
    title: 'Multiple Formats',
    description: 'Export as SVG, PNG, JPEG, WebP, or AVIF. Use our API or JavaScript library.',
    color: '#ec4899',
  },
];
</script>

<template>
  <UiSection class="highlights" :class="{ visible: isVisible }" background="soft" divider>
    <div class="highlights-bg">
      <div class="bg-gradient"></div>
    </div>
    <UiContainer class="highlights-container">
      <div class="highlights-header">
        <UiBadge>Why DiceBear?</UiBadge>
        <UiHeadline>Built for <span class="highlight">Developers</span>, Loved by Users</UiHeadline>
        <UiDescription>
          Everything you need to create beautiful, unique avatars for your applications.
        </UiDescription>
      </div>

      <div class="highlights-grid">
        <UiCard
          v-for="(highlight, index) in highlights"
          :key="index"
          variant="default"
          padding="lg"
          radius="md"
          hoverable
          class="highlight-card"
          :style="{ '--accent-color': highlight.color, animationDelay: `${index * 0.1}s` }"
        >
          <UiIconBox size="lg" :color="highlight.color" glow class="highlight-icon-wrapper">
            <svg viewBox="0 0 24 24"><path :d="highlight.icon" fill="currentColor" /></svg>
          </UiIconBox>
          <h3 class="highlight-title">{{ highlight.title }}</h3>
          <p class="highlight-description">{{ highlight.description }}</p>
          <div class="highlight-line"></div>
        </UiCard>
      </div>
    </UiContainer>

  </UiSection>
</template>

<style scoped>
.highlights-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.highlights-bg .bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 50% at 0% 0%, color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent), transparent),
    radial-gradient(ellipse 50% 50% at 100% 100%, color-mix(in srgb, var(--vp-c-purple-1) 6%, transparent), transparent);
}

.dark .highlights-bg .bg-gradient {
  background:
    radial-gradient(ellipse 50% 50% at 0% 0%, color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent), transparent),
    radial-gradient(ellipse 50% 50% at 100% 100%, color-mix(in srgb, var(--vp-c-purple-1) 6%, transparent), transparent);
}

.highlights-container {
  position: relative;
  z-index: 1;
}

.highlights-header {
  text-align: center;
  margin-bottom: 64px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.highlights.visible .highlights-header {
  opacity: 1;
  transform: translateY(0);
}




.highlights-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.highlight-card {
  opacity: 0;
  transform: translateY(30px);
}

.highlights.visible .highlight-card {
  animation: card-reveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes card-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.highlight-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent-color);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.highlight-card:hover .highlight-line {
  transform: scaleX(1);
}

.highlight-icon-wrapper {
  margin-bottom: 24px;
}

.highlight-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 12px;
}

.highlight-description {
  font-size: 15px;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.7;
}

@media (max-width: 1000px) {
  .highlights-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .highlights-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
