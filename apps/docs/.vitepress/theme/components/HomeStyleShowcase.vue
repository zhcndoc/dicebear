<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ThemeOptions } from '@shared/types';
import { useData } from 'vitepress';
import { kebabCase } from 'change-case';
import Prando from 'prando';
import { mdiArrowRight } from '@mdi/js';

const { theme } = useData<ThemeOptions>();

const avatarStyleList = computed(() => Object.keys(theme.value.avatarStyles));

const seeds = ['Felix', 'Aneka', 'Milo', 'Luna', 'Max', 'Sophie', 'Leo', 'Emma', 'Noah', 'Aria', 'Zoe', 'Oscar'];

const showcaseAvatars = computed(() => {
  const prng = new Prando(42);
  const avatars: Array<{ style: string; seed: string; src: string }> = [];

  for (const style of avatarStyleList.value) {
    const seed = seeds[prng.nextInt(0, seeds.length - 1)];
    avatars.push({
      style: kebabCase(style),
      seed,
      src: `https://api.dicebear.com/9.x/${kebabCase(style)}/svg?seed=${seed}&size=100`
    });
  }

  return avatars;
});

const scrollPosition = ref(0);
let animationFrame: number;
let isPaused = false;

function animate() {
  if (!isPaused) {
    scrollPosition.value += 0.4;
    // Reset seamlessly - we duplicate the avatars so it loops
    const itemWidth = 108; // 92px avatar + 16px gap
    const totalWidth = showcaseAvatars.value.length * itemWidth;
    if (scrollPosition.value >= totalWidth) {
      scrollPosition.value = 0;
    }
  }
  animationFrame = requestAnimationFrame(animate);
}

function pauseAnimation() {
  isPaused = true;
}

function resumeAnimation() {
  isPaused = false;
}

onMounted(() => {
  animationFrame = requestAnimationFrame(animate);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrame);
});
</script>

<template>
  <section class="style-showcase">
    <div class="style-showcase-header">
      <span class="style-showcase-badge">Explore the Collection</span>
      <h2 class="style-showcase-title">30+ Unique Avatar Styles</h2>
      <p class="style-showcase-description">
        From cute characters to abstract patterns, pixel art to professional illustrations.
        Every style crafted by talented artists.
      </p>
    </div>

    <div
      class="style-showcase-scroll"
      @mouseenter="pauseAnimation"
      @mouseleave="resumeAnimation"
      @touchstart="pauseAnimation"
      @touchend="resumeAnimation"
    >
      <div
        class="style-showcase-track"
        :style="{ transform: `translateX(-${scrollPosition}px)` }"
      >
        <a
          v-for="(avatar, index) in [...showcaseAvatars, ...showcaseAvatars]"
          :key="`${avatar.style}-${index}`"
          :href="`/styles/${avatar.style}/`"
          class="style-showcase-item"
        >
          <div class="style-showcase-avatar">
            <img :src="avatar.src" :alt="`${avatar.style} style`" loading="lazy" />
          </div>
          <span class="style-showcase-label">{{ avatar.style }}</span>
        </a>
      </div>
    </div>

    <div class="style-showcase-cta">
      <a href="/styles/" class="style-showcase-button">
        Browse All Styles
        <svg viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
      </a>
    </div>
  </section>
</template>

<style scoped>
.style-showcase {
  padding: 80px 0;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.style-showcase-header {
  text-align: center;
  padding: 0 24px;
  margin-bottom: 48px;
}

.style-showcase-badge {
  display: inline-block;
  padding: 6px 14px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}

.style-showcase-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 16px;
}

.style-showcase-description {
  font-size: 18px;
  color: var(--vp-c-text-2);
  margin: 0 auto;
  max-width: 500px;
  line-height: 1.6;
}

.style-showcase-scroll {
  overflow: hidden;
  padding: 12px 0;
}

.style-showcase-track {
  display: flex;
  gap: 16px;
  width: max-content;
}

.style-showcase-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.style-showcase-item:hover {
  transform: translateY(-6px);
}

.style-showcase-item::after {
  display: none !important;
}

.style-showcase-avatar {
  width: 92px;
  height: 92px;
  border-radius: 16px;
  overflow: hidden;
  background: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-2);
  transition: box-shadow 0.2s ease;
}

.style-showcase-item:hover .style-showcase-avatar {
  box-shadow: var(--vp-shadow-4);
}

.style-showcase-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.style-showcase-label {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-weight: 500;
  max-width: 92px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.style-showcase-cta {
  text-align: center;
  margin-top: 48px;
}

.style-showcase-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--vp-c-brand-3);
  color: var(--vp-c-white);
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  text-decoration: none;
  transition: background 0.2s ease;
}

.style-showcase-button:hover {
  background: var(--vp-c-brand-2);
}

.style-showcase-button::after {
  display: none !important;
}

.style-showcase-button svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 640px) {
  .style-showcase {
    padding: 60px 0;
  }

  .style-showcase-title {
    font-size: 24px;
  }

  .style-showcase-description {
    font-size: 16px;
  }

  .style-showcase-avatar {
    width: 72px;
    height: 72px;
  }

  .style-showcase-label {
    max-width: 72px;
    font-size: 11px;
  }

  .style-showcase-track {
    gap: 12px;
  }
}
</style>
