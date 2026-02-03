<script setup lang="ts">
import { computed } from 'vue';
import { ThemeOptions } from '@shared/types';
import { useData } from 'vitepress';
import { kebabCase } from 'change-case';
import Prando from 'prando';
import {
  mdiPlay,
  mdiBookOpenPageVariant,
  mdiViewGrid,
  mdiGithub,
  mdiPencil,
  mdiArrowRight,
} from '@mdi/js';
import UiButton from './UiButton.vue';
import UiHeadline from './UiHeadline.vue';
import UiDescription from './UiDescription.vue';
import UiContainer from './UiContainer.vue';
import UiSection from './UiSection.vue';
import UiCard from './UiCard.vue';
import { useVisibility } from '../composables/useVisibility';

const { theme } = useData<ThemeOptions>();
const isVisible = useVisibility('.cta');

const avatarStyleList = computed(() => Object.keys(theme.value.avatarStyles));

// Generate random avatars for the background
const bgAvatars = computed(() => {
  const prng = new Prando(123);
  const avatars = [];
  const seeds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  for (let i = 0; i < 12; i++) {
    const style = kebabCase(avatarStyleList.value[i % avatarStyleList.value.length]);
    avatars.push({
      style,
      seed: seeds[i],
      src: `https://api.dicebear.com/9.x/${style}/svg?seed=${seeds[i]}&size=80`,
      x: (i % 6) * 18 + prng.next() * 5,
      y: Math.floor(i / 6) * 50 + prng.next() * 10 + 20,
      rotation: prng.next() * 20 - 10,
      delay: prng.next() * 2,
    });
  }

  return avatars;
});

const links = {
  start: [
    { icon: mdiBookOpenPageVariant, label: 'Documentation', href: '/introduction/' },
    { icon: mdiPlay, label: 'Playground', href: '/playground/' },
    { icon: mdiViewGrid, label: 'All Styles', href: '/styles/' },
  ],
  resources: [
    { icon: mdiGithub, label: 'GitHub', href: 'https://github.com/dicebear/dicebear', external: true },
    { icon: mdiPencil, label: 'Editor', href: 'https://editor.dicebear.com', external: true },
  ],
};
</script>

<template>
  <UiSection class="cta" :class="{ visible: isVisible }" divider>
    <!-- Floating avatar background -->
    <div class="cta-bg">
      <div
        v-for="(avatar, index) in bgAvatars"
        :key="index"
        class="cta-bg-avatar"
        :style="{
          left: `${avatar.x}%`,
          top: `${avatar.y}%`,
          transform: `rotate(${avatar.rotation}deg)`,
          animationDelay: `${avatar.delay}s`,
        }"
      >
        <img :src="avatar.src" :alt="avatar.style" loading="lazy" />
      </div>
    </div>

    <UiContainer class="cta-container">
      <UiCard variant="gradient" padding="xl" radius="xl" class="cta-card">
        <UiHeadline class="cta-title">Ready to create <span class="highlight">amazing</span> avatars?</UiHeadline>
        <UiDescription class="cta-description">
          Start building with DiceBear today. Free to use, forever.
        </UiDescription>

        <div class="cta-actions">
          <UiButton href="/playground/">
            <svg viewBox="0 0 24 24"><path :d="mdiPlay" fill="currentColor" /></svg>
            Open Playground
          </UiButton>
          <UiButton href="/introduction/" variant="secondary">
            Read the Docs
            <svg viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
          </UiButton>
        </div>
      </UiCard>

      <div class="cta-links">
        <div class="cta-link-group">
          <h3 class="cta-link-title">Get Started</h3>
          <nav class="cta-nav">
            <a
              v-for="link in links.start"
              :key="link.label"
              :href="link.href"
              class="cta-nav-link"
            >
              <svg viewBox="0 0 24 24"><path :d="link.icon" fill="currentColor" /></svg>
              {{ link.label }}
            </a>
          </nav>
        </div>

        <div class="cta-link-group">
          <h3 class="cta-link-title">Resources</h3>
          <nav class="cta-nav">
            <a
              v-for="link in links.resources"
              :key="link.label"
              :href="link.href"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener' : undefined"
              class="cta-nav-link"
            >
              <svg viewBox="0 0 24 24"><path :d="link.icon" fill="currentColor" /></svg>
              {{ link.label }}
            </a>
          </nav>
        </div>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style scoped>
.cta-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.08;
}

.cta-bg-avatar {
  position: absolute;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  overflow: hidden;
  animation: float-gentle 6s ease-in-out infinite;
}

@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0) rotate(var(--rotation, 0deg));
  }
  50% {
    transform: translateY(-10px) rotate(var(--rotation, 0deg));
  }
}

.cta-bg-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cta-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta.visible .cta-container {
  opacity: 1;
  transform: translateY(0);
}

.cta-card {
  text-align: center;
  width: 100%;
  max-width: 700px;
}

.cta-title {
  font-size: 36px;
}

.cta-description {
  margin-bottom: 32px;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.cta-links {
  display: flex;
  gap: 80px;
}

.cta-link-group {
  text-align: center;
}

.cta-link-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--vp-c-text-3);
  margin: 0 0 16px;
}

.cta-nav {
  display: flex;
  gap: 8px;
}

.cta-nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.cta-nav-link::after {
  display: none !important;
}

.cta-nav-link:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
}

.cta-nav-link svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 768px) {
  .cta-title {
    font-size: 28px;
  }

  .cta-actions {
    flex-direction: column;
  }

  .cta-links {
    flex-direction: column;
    gap: 40px;
  }

  .cta-nav {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
