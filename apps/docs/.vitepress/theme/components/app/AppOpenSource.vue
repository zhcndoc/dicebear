<script setup lang="ts">
import { ref } from 'vue';
import { Star, Users, Palette, Heart } from 'lucide-vue-next';
import { siGithub } from 'simple-icons';
import { ThemeOptions } from '@theme/types';
import { useData } from 'vitepress';
import { UiButton, UiHeadline, UiDescription, UiContainer, UiSection, UiIconBox, UiIcon } from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const { theme } = useData<ThemeOptions>();
const sectionRef = ref();
const isVisible = useVisibility(sectionRef);

const stats = [
  { icon: Star, value: theme.value.githubStars?.['dicebear/dicebear'] || '8k+', label: 'GitHub Stars' },
  { icon: Users, value: '10+', label: 'Contributors' },
  { icon: Palette, value: '30+', label: 'Avatar Styles' },
];
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" background="soft" divider center>
    <template #background>
      <div class="app-open-source-gradient"></div>
    </template>
    <UiContainer size="narrow" class="app-open-source-container">
      <UiHeadline>Free and <strong>Open Source</strong>.<br />Forever.</UiHeadline>

      <UiDescription class="app-open-source-description">
        DiceBear is built in the open. Our core library is MIT licensed, and we believe
        in transparent development. Star us on GitHub, contribute code, or simply use it
        with confidence knowing the source is always available.
      </UiDescription>

      <div class="app-open-source-stats">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="app-open-source-stat"
          :style="{ animationDelay: `${index * 0.15}s` }"
        >
          <UiIconBox size="md" class="app-open-source-stat-icon">
            <component :is="stat.icon" />
          </UiIconBox>
          <span class="app-open-source-stat-value">{{ stat.value }}</span>
          <span class="app-open-source-stat-label">{{ stat.label }}</span>
        </div>
      </div>

      <div class="app-open-source-actions">
        <UiButton
          href="https://github.com/dicebear/dicebear"
          variant="github"
          :external="true"
        >
          <UiIcon :path="siGithub.path" :size="20" />
          Star on GitHub
        </UiButton>
        <UiButton
          href="/guides/contribute-to-the-library/"
          variant="secondary"
          class="app-open-source-contribute"
        >
          <Heart :size="20" class="app-open-source-heart-icon" />
          Contribute
        </UiButton>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-open-source {
  &-gradient {
    background:
      radial-gradient(ellipse 50% 80% at 50% 0%, color-mix(in srgb, var(--vp-c-yellow-1) 5%, transparent), transparent),
      radial-gradient(ellipse 50% 80% at 50% 100%, color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent), transparent);
  }

  &-container {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-description {
    margin-bottom: 64px;
    max-width: 600px;
  }

  &-stats {
    display: flex;
    justify-content: center;
    gap: 56px;
    margin-bottom: 48px;
  }

  &-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    opacity: 0;
    transform: translateY(20px);

    .visible & {
      animation: app-open-source-stat-appear 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    &-icon {
      margin-bottom: 8px;
    }

    &-value {
      font-size: 36px;
      font-weight: 800;
      color: var(--vp-c-text-1);
      letter-spacing: -0.02em;
    }

    &-label {
      font-size: 14px;
      color: var(--vp-c-text-2);
      font-weight: 500;
    }
  }

  &-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  &-heart-icon {
    color: #ec4899;
  }
}

@keyframes app-open-source-stat-appear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .app-open-source {
    &-stats {
      flex-direction: column;
      gap: 32px;
    }

    &-actions {
      flex-direction: column;
    }
  }
}
</style>
