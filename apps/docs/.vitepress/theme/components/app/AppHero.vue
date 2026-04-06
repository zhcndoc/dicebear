<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useThrottleFn } from '@vueuse/core';
import { ThemeOptions } from '@theme/types';
import { useData } from 'vitepress';
import { kebabCase } from 'change-case';
import Prando from 'prando';
import { Play, ArrowRight, ChevronDown, Star } from '@lucide/vue';
import { siGithub } from 'simple-icons';
import { UiAvatar, UiButton, UiIcon } from '../ui';
import { useVisibility } from '../../composables/useVisibility';
import { useTypewriter } from '../../composables/useTypewriter';
import { useParallax } from '../../composables/useParallax';
import { useAvatarStyleList } from '../../composables/avatar';

const { theme } = useData<ThemeOptions>();

const isVisible = useVisibility('.app-hero', { once: false, threshold: 0.1 });

const avatarStyleList = useAvatarStyleList();

const heroRef = ref<HTMLElement>();
const { setContainer, handleMouseMove } = useParallax(isVisible);

// Responsive grid size
const screenSize = ref<'mobile' | 'tablet' | 'desktop'>('desktop');

function updateScreenSize() {
  const width = window.innerWidth;
  if (width < 768) {
    screenSize.value = 'mobile';
  } else if (width < 1024) {
    screenSize.value = 'tablet';
  } else {
    screenSize.value = 'desktop';
  }
}

// Generate floating avatars for background with grid positioning
const floatingAvatars = computed(() => {
  const prng = new Prando(777);
  const avatars = [];
  const seeds = ['Luna', 'Max', 'Sophie', 'Felix', 'Emma', 'Leo', 'Mia', 'Noah', 'Aria', 'Liam', 'Zoe', 'Oscar', 'Ivy', 'Jack', 'Ruby', 'Finn'];
  const styles = avatarStyleList.value;

  const gridConfig = {
    mobile: { cols: 5, rows: 5 },
    tablet: { cols: 6, rows: 5 },
    desktop: { cols: 7, rows: 6 },
  };

  const { cols, rows } = gridConfig[screenSize.value];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = row * cols + col;
      const style = kebabCase(styles[i % styles.length]);
      const seed = seeds[i % seeds.length];
      const baseX = (col / cols) * 100 + (prng.next() * 10 - 5);
      const baseY = (row / rows) * 100 + (prng.next() * 10 - 5);

      avatars.push({
        style,
        seed,
        x: baseX,
        y: baseY,
        size: 48 + prng.next() * 32,
        delay: prng.next() * 3,
        duration: 8 + prng.next() * 8,
        parallaxFactor: 0.5 + prng.next() * 1.5,
      });
    }
  }
  return avatars;
});

const { displayedText } = useTypewriter([
  'user profiles',
  'chat applications',
  'gaming platforms',
  'social networks',
  'team tools',
  'any project',
]);

function scrollToContent() {
  const section = document.querySelector('.seed-demo');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

const throttledUpdateScreenSize = useThrottleFn(updateScreenSize, 200);

onMounted(() => {
  updateScreenSize();
  window.addEventListener('resize', throttledUpdateScreenSize);
  if (heroRef.value) {
    setContainer(heroRef.value);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', throttledUpdateScreenSize);
});
</script>

<template>
  <section ref="heroRef" class="app-hero" :class="{ 'app-hero--paused': !isVisible }" @mousemove="handleMouseMove">
    <!-- Animated gradient background -->
    <div class="app-hero-gradient"></div>

    <!-- Decorative geometric shapes -->
    <div class="app-hero-shape app-hero-shape-1"></div>
    <div class="app-hero-shape app-hero-shape-2"></div>
    <div class="app-hero-shape app-hero-shape-3"></div>
    <div class="app-hero-shape app-hero-shape-4"></div>

    <!-- Floating avatars background with parallax -->
    <div class="app-hero-bg">
      <div
        v-for="(avatar, index) in floatingAvatars"
        :key="index"
        class="app-hero-floating-avatar"
        :style="{
          left: `${avatar.x}%`,
          top: `${avatar.y}%`,
          width: `${avatar.size}px`,
          height: `${avatar.size}px`,
          animationDelay: `${avatar.delay}s`,
          animationDuration: `${avatar.duration}s`,
          '--parallax-factor': avatar.parallaxFactor,
        }"
      >
        <UiAvatar :style-name="avatar.style" :style-options="{ seed: avatar.seed, size: 80 }" :alt="avatar.style" />
      </div>
    </div>

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

    <!-- Scroll indicator -->
    <button class="app-hero-scroll" @click="scrollToContent" aria-label="Scroll to content">
      <ChevronDown />
    </button>
  </section>
</template>

<style lang="scss">
:root {
  --app-hero-gradient:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14, 165, 233, 0.12), transparent),
    radial-gradient(ellipse 60% 40% at 80% 50%, rgba(124, 58, 237, 0.08), transparent),
    radial-gradient(ellipse 60% 40% at 20% 80%, rgba(20, 184, 166, 0.06), transparent);
  --app-hero-badge-bg: rgba(255, 255, 255, 0.8);
  --app-hero-badge-border: rgba(0, 0, 0, 0.08);
  --app-hero-star-color: #f59e0b;
}
.dark {
  --app-hero-gradient:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14, 165, 233, 0.15), transparent),
    radial-gradient(ellipse 60% 40% at 80% 50%, rgba(124, 58, 237, 0.1), transparent),
    radial-gradient(ellipse 60% 40% at 20% 80%, rgba(20, 184, 166, 0.08), transparent);
  --app-hero-badge-bg: rgba(35, 35, 40, 0.85);
  --app-hero-badge-border: rgba(255, 255, 255, 0.1);
  --app-hero-star-color: #fbbf24;
}
</style>

<style lang="scss" scoped>
.app-hero {
  position: relative;
  min-height: calc(100vh - var(--vp-nav-height, 64px));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  overflow: hidden;

  &--paused {
    .app-hero-gradient,
    .app-hero-cursor,
    .app-hero-scroll,
    .app-hero-title-text,
    .app-hero-shape {
      animation-play-state: paused;
    }
  }

  &:hover .app-hero-bg {
    opacity: 0.2;
  }

  /* Animated gradient background */
  &-gradient {
    position: absolute;
    inset: 0;
    background: var(--app-hero-gradient);
    animation: app-hero-gradient-shift 20s ease-in-out infinite;
  }

  /* Decorative geometric shapes */
  &-shape {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    will-change: transform;

    &-1 {
      width: 500px;
      height: 500px;
      top: -15%;
      right: -5%;
      background: radial-gradient(circle, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent) 0%, transparent 70%);
      animation: shape-float 18s ease-in-out infinite;
    }

    &-2 {
      width: 350px;
      height: 350px;
      bottom: -5%;
      left: -3%;
      background: radial-gradient(circle, color-mix(in srgb, var(--vp-c-purple-1) 8%, transparent) 0%, transparent 70%);
      animation: shape-float 22s ease-in-out infinite reverse;
    }

    &-3 {
      width: 200px;
      height: 200px;
      top: 30%;
      left: 8%;
      background: radial-gradient(circle, color-mix(in srgb, var(--vp-c-green-1) 10%, transparent) 0%, transparent 70%);
      animation: shape-float 15s ease-in-out infinite;
      animation-delay: -5s;
    }

    &-4 {
      width: 160px;
      height: 160px;
      top: 20%;
      right: 12%;
      background: radial-gradient(circle, color-mix(in srgb, var(--vp-c-coral-2, var(--vp-c-yellow-2)) 8%, transparent) 0%, transparent 70%);
      animation: shape-float 20s ease-in-out infinite;
      animation-delay: -10s;
    }
  }

  /* Floating avatars background */
  &-bg {
    position: absolute;
    inset: -10%;
    overflow: hidden;
    opacity: 0.15;
    pointer-events: none;
    transition: opacity var(--duration-mid) ease;
  }

  &-floating-avatar {
    position: absolute;
    border-radius: var(--vp-radius-md);
    overflow: hidden;
    will-change: transform;
    contain: layout style paint;
    transform: translate(
      calc((var(--parallax-x, 0.5) - 0.5) * 30px * var(--parallax-factor, 1)),
      calc((var(--parallax-y, 0.5) - 0.5) * 30px * var(--parallax-factor, 1))
    );

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  /* Content */
  &-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 900px;
    animation: fade-up var(--duration-reveal) var(--ease-smooth);
  }

  /* Top badge with GitHub stars */
  &-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 18px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 600;
    color: var(--vp-c-text-2);
    background: var(--app-hero-badge-bg);
    border: 1px solid var(--app-hero-badge-border);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    text-decoration: none;
    margin-bottom: 32px;
    transition: all var(--duration-mid) var(--ease-spring);
    animation: fade-up var(--duration-reveal) var(--ease-smooth) 0.1s both;

    &::after {
      display: none !important;
    }

    &:hover {
      transform: translateY(-2px) scale(1.03);
      border-color: var(--app-hero-star-color);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    }

    &-icon {
      color: var(--vp-c-text-1);
    }

    &-divider {
      width: 1px;
      height: 14px;
      background: var(--vp-c-border);
    }

    &-star {
      color: var(--app-hero-star-color);
      fill: var(--app-hero-star-color);
      animation: app-hero-star-pulse 2s ease-in-out infinite;
    }

    &-count {
      font-weight: 800;
      color: var(--vp-c-text-1);
    }
  }

  &-title {
    margin: 0 0 28px;
    line-height: 1.1;
    animation: fade-up var(--duration-reveal) var(--ease-smooth) 0.2s both;

    &-line {
      display: block;
      font-size: clamp(48px, 8vw, 80px);
      font-weight: 800;
      color: var(--vp-c-text-1);
      letter-spacing: -0.04em;
      margin-bottom: 8px;
    }

    &-dynamic {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: clamp(48px, 8vw, 80px);
      font-weight: 800;
      min-height: 1.2em;
    }

    &-text {
      background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-purple-1) 40%, var(--vp-c-coral-2, var(--vp-c-red-2)) 80%, var(--vp-c-brand-1) 100%);
      background-size: 300% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: app-hero-gradient-text 6s linear infinite;
      white-space: nowrap;
    }
  }

  &-cursor {
    display: inline-block;
    width: 4px;
    height: 0.85em;
    background: var(--vp-c-brand-1);
    margin-left: 4px;
    border-radius: 2px;
    animation: app-hero-cursor-blink 1s step-end infinite;
  }

  &-description {
    font-size: 20px;
    color: var(--vp-c-text-2);
    line-height: 1.7;
    margin: 0 0 40px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    animation: fade-up var(--duration-reveal) var(--ease-smooth) 0.3s both;
  }

  &-highlight {
    color: var(--vp-c-brand-1);
    font-weight: 700;
  }

  &-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    animation: fade-up var(--duration-reveal) var(--ease-smooth) 0.4s both;
  }

  &-btn-primary {
    padding: 18px 36px;
    font-size: 17px;
  }

  /* Scroll indicator */
  &-scroll {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vp-c-bg-elv);
    border: 2px solid var(--vp-c-border);
    border-radius: 50%;
    cursor: pointer;
    transition: all var(--duration-mid) var(--ease-spring);
    animation: app-hero-bounce 2s ease-in-out infinite;
    z-index: 10;

    &:hover {
      border-color: var(--vp-c-brand-1);
      background: var(--vp-c-brand-soft);
      transform: translateX(-50%) scale(1.1);

      svg {
        color: var(--vp-c-brand-1);
      }
    }

    svg {
      width: 24px;
      height: 24px;
      color: var(--vp-c-text-2);
    }
  }
}

@keyframes app-hero-gradient-shift {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.05) rotate(2deg);
  }
}

@keyframes app-hero-gradient-text {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 300% center;
  }
}

@keyframes app-hero-cursor-blink {
  50% {
    opacity: 0;
  }
}

@keyframes app-hero-bounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(8px);
  }
}

@keyframes app-hero-star-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@media (max-width: 768px) {
  .app-hero {
    min-height: auto;
    padding: 100px 16px 80px;

    &-title {
      &-line,
      &-dynamic {
        font-size: clamp(36px, 8vw, 48px);
      }
    }

    &-description {
      font-size: 17px;
    }

    &-actions {
      flex-direction: column;
      align-items: center;

      .app-hero-action-btn {
        width: 100%;
        max-width: 280px;
      }
    }

    &-btn-primary {
      padding: 16px 28px;
    }

    &-shape {
      &-1 {
        width: 250px;
        height: 250px;
      }
      &-2 {
        width: 180px;
        height: 180px;
      }
      &-3, &-4 {
        display: none;
      }
    }

    &-scroll {
      display: none;
    }
  }
}
</style>
