<script setup lang="ts">
import {
  mdiPalette,
  mdiTargetAccount,
  mdiGithub,
  mdiLightningBolt,
  mdiTune,
  mdiPackageVariant,
} from '@mdi/js';

const highlights = [
  {
    icon: mdiPalette,
    title: '30+ Avatar Styles',
    description: 'Carefully crafted styles from talented artists. Characters, abstract, pixel art, and more.',
  },
  {
    icon: mdiTargetAccount,
    title: 'Deterministic',
    description: 'Same seed always generates the same avatar. Perfect for user profiles and consistent identities.',
  },
  {
    icon: mdiGithub,
    title: '100% Open Source',
    description: 'MIT licensed core, transparent development. Contribute, fork, or self-host with confidence.',
  },
  {
    icon: mdiLightningBolt,
    title: 'Lightning Fast',
    description: 'Global CDN delivers avatars in milliseconds. Optimized SVGs keep your pages fast.',
  },
  {
    icon: mdiTune,
    title: 'Fully Customizable',
    description: 'Colors, accessories, backgrounds, and more. Fine-tune every detail to match your brand.',
  },
  {
    icon: mdiPackageVariant,
    title: 'Multiple Formats',
    description: 'Export as SVG, PNG, JPEG, WebP, or AVIF. Use our API or JavaScript library.',
  },
];
</script>

<template>
  <section class="highlights">
    <div class="highlights-container">
      <div class="highlights-header">
        <span class="highlights-badge">Why DiceBear?</span>
        <h2 class="highlights-title">Built for Developers, Loved by Users</h2>
        <p class="highlights-description">
          Everything you need to create beautiful, unique avatars for your applications.
        </p>
      </div>

      <div class="highlights-grid">
        <div
          v-for="(highlight, index) in highlights"
          :key="index"
          class="highlight-card"
        >
          <div class="highlight-icon">
            <svg viewBox="0 0 24 24"><path :d="highlight.icon" fill="currentColor" /></svg>
          </div>
          <h3 class="highlight-title">{{ highlight.title }}</h3>
          <p class="highlight-description">{{ highlight.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.highlights {
  padding: 80px 24px;
  background: var(--vp-c-bg);
}

.highlights-container {
  max-width: 1100px;
  margin: 0 auto;
}

.highlights-header {
  text-align: center;
  margin-bottom: 56px;
}

.highlights-badge {
  display: inline-block;
  padding: 6px 14px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}

.highlights-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 16px;
}

.highlights-description {
  font-size: 18px;
  color: var(--vp-c-text-2);
  margin: 0;
  max-width: 500px;
  margin: 0 auto;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.highlight-card {
  padding: 28px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}

.highlight-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-brand-soft);
  border-radius: 10px;
  margin-bottom: 20px;
}

.highlight-icon svg {
  width: 24px;
  height: 24px;
  color: var(--vp-c-brand-1);
}

.highlight-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 10px;
}

.highlight-description {
  font-size: 15px;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 900px) {
  .highlights-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .highlights {
    padding: 60px 16px;
  }

  .highlights-title {
    font-size: 24px;
  }

  .highlights-description {
    font-size: 16px;
  }

  .highlights-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .highlight-card {
    padding: 24px;
  }
}
</style>
