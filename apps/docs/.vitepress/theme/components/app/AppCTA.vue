<script setup lang="ts">
import { ref, computed } from 'vue';
import { ThemeOptions } from '@theme/types';
import { useData } from 'vitepress';
import { kebabCase } from 'change-case';
import Prando from 'prando';
import { Play, ArrowRight } from 'lucide-vue-next';
import { UiAvatar, UiButton, UiBadge, UiHeadline, UiDescription, UiContainer, UiSection } from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const { theme } = useData<ThemeOptions>();
const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { once: false, threshold: 0.1 });

const avatarStyleList = computed(() => Object.keys(theme.value.avatarStyles));

const bgAvatars = computed(() => {
  const prng = new Prando(123);
  const avatars = [];
  const seeds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  for (let i = 0; i < 12; i++) {
    const style = kebabCase(avatarStyleList.value[i % avatarStyleList.value.length]);
    avatars.push({
      style,
      seed: seeds[i],
      x: (i % 6) * 18 + prng.next() * 5,
      y: Math.floor(i / 6) * 50 + prng.next() * 10 + 20,
      rotation: prng.next() * 20 - 10,
      delay: prng.next() * 2,
    });
  }

  return avatars;
});
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider center>
    <template #background>
      <div class="app-cta-gradient"></div>
      <div
        v-for="(avatar, index) in bgAvatars"
        :key="index"
        class="app-cta-bg-avatar"
        :style="{
          left: `${avatar.x}%`,
          top: `${avatar.y}%`,
          transform: `rotate(${avatar.rotation}deg)`,
          animationDelay: `${avatar.delay}s`,
        }"
      >
        <UiAvatar :style-name="avatar.style" :style-options="{ seed: avatar.seed, size: 80 }" :alt="avatar.style" />
      </div>
    </template>
    <UiContainer class="app-cta-container">
      <UiHeadline>Ready to create <strong>amazing</strong> avatars?</UiHeadline>
      <UiDescription class="app-cta-description">
        Start building with our free avatar generator today. Create profile pictures, forever free.
      </UiDescription>

      <div class="app-cta-actions">
        <UiButton href="/playground/">
          <Play :size="20" />
          Open Playground
        </UiButton>
        <UiButton href="/introduction/" variant="secondary">
          Read the Docs
          <ArrowRight />
        </UiButton>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-cta {
  &-gradient {
    background:
      radial-gradient(ellipse 50% 80% at 50% 0%, color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent), transparent),
      radial-gradient(ellipse 50% 80% at 50% 100%, color-mix(in srgb, var(--vp-c-purple-1) 6%, transparent), transparent);
  }

  &-bg-avatar {
    position: absolute;
    width: 64px;
    height: 64px;
    border-radius: 16px;
    overflow: hidden;
    opacity: 0.08;
    animation: app-cta-float-gentle 6s ease-in-out infinite;
    animation-play-state: paused;

    .visible & {
      animation-play-state: running;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
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
    margin-bottom: 48px;
    max-width: 600px;
  }

  &-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }
}

@keyframes app-cta-float-gentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .app-cta {
    &-actions {
      flex-direction: column;
    }
  }
}
</style>
