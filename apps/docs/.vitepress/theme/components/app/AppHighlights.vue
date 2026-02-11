<script setup lang="ts">
import { ref } from 'vue';
import { UiContainer, UiSection, UiSectionHeader, UiIconBox, UiCard, UiIcon } from '../ui';
import { Target, Palette, Zap, SlidersHorizontal, Package, Globe } from 'lucide-vue-next';
import { siGithub } from 'simple-icons';
import { useVisibility } from '../../composables/useVisibility';

withDefaults(defineProps<{
  badge?: string;
  headline?: string;
  description?: string;
}>(), {
  badge: 'Why DiceBear?',
  headline: 'Built for <strong>Developers</strong>, Loved by Users',
  description: 'Everything you need to create beautiful, unique avatars for your applications.',
});

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });

const highlights = [
  {
    icon: Target,
    title: 'Deterministic Avatars',
    description: 'Same seed always generates the same avatar. Perfect for user profiles and consistent identities.',
    color: '#1689cc',
  },
  {
    icon: Palette,
    title: '30+ Avatar Styles',
    description: 'Carefully crafted styles from talented artists. Characters, abstract, pixel art, and more.',
    color: '#a855f7',
  },
  {
    icon: Globe,
    title: 'Free Avatar API',
    description: 'Our profile picture API handles millions of daily requests. Global CDN delivers random user avatars in milliseconds.',
    color: '#22c55e',
  },
  {
    icon: Zap,
    title: 'JS Library & CLI',
    description: 'No data sent to external servers. Full control over avatar generation in your app.',
    color: '#f59e0b',
  },
  {
    icon: SlidersHorizontal,
    title: 'Fully Customizable',
    description: 'Colors, accessories, backgrounds, and more. Fine-tune every detail to match your brand.',
    color: '#ec4899',
  },
  {
    iconPath: siGithub.path,
    title: '100% Open Source',
    description: 'MIT licensed core, transparent development. Contribute, fork, or self-host with confidence.',
    color: 'var(--vp-c-text-1)',
  },
];
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-highlights-gradient"></div>
    </template>
    <UiContainer>
      <UiSectionHeader
        class="app-highlights-header"
        :badge="badge"
        :headline="headline"
        :description="description"
      />

      <div class="app-highlights-grid">
        <UiCard
          v-for="(highlight, index) in highlights"
          :key="index"
          padding="lg"
          radius="md"
          class="app-highlights-card"
          :style="{ '--accent-color': highlight.color, animationDelay: `${index * 0.1}s` }"
        >
          <UiIconBox size="lg" :color="highlight.color" class="app-highlights-icon-wrapper">
            <UiIcon v-if="highlight.iconPath" :path="highlight.iconPath" />
            <component v-else :is="highlight.icon" />
          </UiIconBox>
          <h3 class="app-highlights-title">{{ highlight.title }}</h3>
          <p class="app-highlights-description">{{ highlight.description }}</p>
        </UiCard>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-highlights {
  &-gradient {
    background:
      radial-gradient(ellipse 50% 50% at 50% 0%, color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent), transparent),
      radial-gradient(ellipse 50% 50% at 50% 100%, color-mix(in srgb, var(--vp-c-purple-1) 6%, transparent), transparent);
  }

  &-header {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-card {
    opacity: 0;
    transform: translateY(30px);

    .visible & {
      animation: app-highlights-card-reveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  &-icon-wrapper {
    margin-bottom: 24px;
  }

  &-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--vp-c-text-1);
    margin: 0 0 12px;
  }

  &-description {
    font-size: 15px;
    color: var(--vp-c-text-2);
    margin: 0;
    line-height: 1.7;
  }
}

@keyframes app-highlights-card-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1000px) {
  .app-highlights {
    &-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 640px) {
  .app-highlights {
    &-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
}
</style>
