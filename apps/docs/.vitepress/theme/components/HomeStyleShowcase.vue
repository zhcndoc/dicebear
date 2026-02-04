<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { ThemeOptions } from '@shared/types';
import { useData } from 'vitepress';
import { kebabCase } from 'change-case';
import Prando from 'prando';
import { mdiArrowRight, mdiArrowLeft } from '@mdi/js';
import UiButton from './UiButton.vue';
import UiHeadline from './UiHeadline.vue';
import UiDescription from './UiDescription.vue';
import UiBadge from './UiBadge.vue';
import UiContainer from './UiContainer.vue';
import UiSection from './UiSection.vue';
import { useVisibility } from '../composables/useVisibility';

const { theme } = useData<ThemeOptions>();

const isVisible = useVisibility('.style-showcase', { once: false, threshold: 0.1 });
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
      src: `https://api.dicebear.com/9.x/${kebabCase(style)}/svg?seed=${seed}&size=120`
    });
  }

  return avatars;
});

const scrollPosition = ref(0);
let animationFrame: number | null = null;
let isPaused = false;
let scrollDirection = 1;

function animate() {
  if (!isVisible.value) {
    animationFrame = null;
    return;
  }
  if (!isPaused) {
    scrollPosition.value += 0.5 * scrollDirection;
    const itemWidth = 140;
    const totalWidth = showcaseAvatars.value.length * itemWidth;
    if (scrollPosition.value >= totalWidth) {
      scrollPosition.value = 0;
    }
    if (scrollPosition.value < 0) {
      scrollPosition.value = totalWidth;
    }
  }
  animationFrame = requestAnimationFrame(animate);
}

function startAnimation() {
  if (animationFrame === null && isVisible.value) {
    animationFrame = requestAnimationFrame(animate);
  }
}

function pauseAnimation() {
  isPaused = true;
}

function resumeAnimation() {
  isPaused = false;
}

function scrollLeft() {
  scrollPosition.value -= 300;
}

function scrollRight() {
  scrollPosition.value += 300;
}

watch(isVisible, (visible) => {
  if (visible) {
    startAnimation();
  }
});

onMounted(() => {
  if (isVisible.value) {
    startAnimation();
  }
});

onUnmounted(() => {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<template>
  <UiSection class="style-showcase" :class="{ visible: isVisible }" background="soft" no-padding divider>
    <div class="style-showcase-bg">
      <div class="bg-gradient"></div>
    </div>
    <UiContainer class="style-showcase-header">
      <UiBadge>Explore the Collection</UiBadge>
      <UiHeadline><span class="highlight">30+</span> Unique Avatar Styles</UiHeadline>
      <UiDescription class="style-showcase-description">
        From cute characters to abstract patterns, pixel art to professional illustrations.
        Every style crafted by talented artists and designers.
      </UiDescription>
    </UiContainer>

    <div class="style-showcase-outer">
      <button class="scroll-btn scroll-btn-left" @click="scrollLeft" aria-label="Scroll left">
        <svg viewBox="0 0 24 24"><path :d="mdiArrowLeft" fill="currentColor" /></svg>
      </button>

      <div class="style-showcase-wrapper">
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
                <div class="avatar-glow"></div>
              </div>
              <span class="style-showcase-label">{{ avatar.style }}</span>
            </a>
          </div>
        </div>
      </div>

      <button class="scroll-btn scroll-btn-right" @click="scrollRight" aria-label="Scroll right">
        <svg viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
      </button>
    </div>


    <UiContainer class="style-showcase-cta">
      <UiButton href="/styles/">
        Browse All Styles
        <svg viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
      </UiButton>
    </UiContainer>
  </UiSection>
</template>

<style scoped>
.style-showcase-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.style-showcase-bg .bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 80% at 0% 50%, color-mix(in srgb, var(--vp-c-purple-1) 6%, transparent), transparent),
    radial-gradient(ellipse 60% 80% at 100% 50%, color-mix(in srgb, var(--vp-c-indigo-1) 5%, transparent), transparent);
}

.dark .style-showcase-bg .bg-gradient {
  background:
    radial-gradient(ellipse 60% 80% at 0% 50%, color-mix(in srgb, var(--vp-c-purple-1) 6%, transparent), transparent),
    radial-gradient(ellipse 60% 80% at 100% 50%, color-mix(in srgb, var(--vp-c-indigo-1) 5%, transparent), transparent);
}

.style-showcase-header {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 0 24px;
  margin-bottom: 56px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.style-showcase.visible .style-showcase-header {
  opacity: 1;
  transform: translateY(0);
}



.style-showcase-description {
  max-width: 550px;
}

.style-showcase-outer {
  position: relative;
  padding: 0 60px;
}

.style-showcase-wrapper {
  overflow-x: clip;
  overflow-y: visible;
  mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
}

.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-border);
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  box-shadow: var(--vp-shadow-2);
}

.scroll-btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.scroll-btn svg {
  width: 20px;
  height: 20px;
  color: var(--vp-c-text-2);
  transition: color 0.2s ease;
}

.scroll-btn:hover svg {
  color: var(--vp-c-brand-1);
}

.scroll-btn-left {
  left: 24px;
}

.scroll-btn-right {
  right: 24px;
}

.style-showcase-scroll {
  overflow: visible;
  padding: 30px 0;
  margin: -30px 0;
}

.style-showcase-track {
  display: flex;
  gap: 24px;
  width: max-content;
  will-change: transform;
  transform: translateZ(0);
}

.style-showcase-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.style-showcase-item:hover {
  transform: translateY(-10px) scale(1.05);
}

.style-showcase-item::after {
  display: none !important;
}

.style-showcase-avatar {
  width: 116px;
  height: 116px;
  border-radius: 24px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  box-shadow: var(--vp-shadow-3);
  transition: all 0.3s ease;
  position: relative;
}

.style-showcase-item:hover .style-showcase-avatar {
  box-shadow:
    var(--vp-shadow-5),
    0 0 40px -10px var(--vp-c-brand-1);
}

.avatar-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 40%, rgba(22, 137, 204, 0.2));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.style-showcase-item:hover .avatar-glow {
  opacity: 1;
}

.style-showcase-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.style-showcase-label {
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-weight: 500;
  max-width: 116px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.style-showcase-item:hover .style-showcase-label {
  color: var(--vp-c-brand-1);
}

.style-showcase-cta {
  text-align: center;
  margin-top: 40px;
}

@media (max-width: 768px) {
  .style-showcase-outer {
    padding: 0;
  }

  .scroll-btn {
    display: none;
  }

  .style-showcase-avatar {
    width: 88px;
    height: 88px;
    border-radius: 18px;
  }

  .style-showcase-track {
    gap: 16px;
  }

  .style-showcase-label {
    max-width: 88px;
    font-size: 11px;
  }
}
</style>
