<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ThemeOptions } from '@theme/types';
import { useData } from 'vitepress';
import { kebabCase } from 'change-case';
import Prando from 'prando';
import { Play, ArrowRight, ChevronDown } from 'lucide-vue-next';
import { UiAvatar, UiButton } from '../ui';
import { useVisibility } from '../../composables/useVisibility';
import { useTypewriter } from '../../composables/useTypewriter';
import { useParallax } from '../../composables/useParallax';

const { theme } = useData<ThemeOptions>();

const isVisible = useVisibility('.app-hero', { once: false, threshold: 0.1 });

const prng = new Prando(777);
const avatarStyleList = computed(() => Object.keys(theme.value.avatarStyles));

const { mouseX, mouseY, handleMouseMove } = useParallax(isVisible);

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

onMounted(() => {
  updateScreenSize();
  window.addEventListener('resize', updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize);
});
</script>

<template>
  <section class="app-hero" @mousemove="handleMouseMove">
    <!-- Animated gradient background -->
    <div class="app-hero-gradient"></div>

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
          transform: `translate(${(mouseX - 0.5) * 30 * avatar.parallaxFactor}px, ${(mouseY - 0.5) * 30 * avatar.parallaxFactor}px)`,
        }"
      >
        <UiAvatar :style-name="avatar.style" :style-options="{ seed: avatar.seed, size: 80 }" :alt="avatar.style" />
      </div>
    </div>

    <div class="app-hero-content">
      <h1 class="app-hero-title">
        <span class="app-hero-title-line">Unique Avatars for</span>
        <span class="app-hero-title-dynamic">
          <span class="app-hero-title-text">{{ displayedText }}</span>
          <span class="app-hero-cursor"></span>
        </span>
      </h1>

      <p class="app-hero-description">
        Open source avatar generator with
        <span class="app-hero-highlight" style="white-space: nowrap">30+ styles</span>&nbsp;crafted by talented artists.
        Create profile pictures via avatar&nbsp;API, JavaScript&nbsp;library &amp; CLI.
      </p>

      <div class="app-hero-actions">
        <UiButton href="/playground/" class="app-hero-btn-primary app-hero-action-btn">
          <Play :size="20" />
          Try Playground
          <span class="app-hero-btn-shine"></span>
        </UiButton>
        <UiButton href="/introduction/" variant="secondary" class="app-hero-action-btn">
          Get Started
          <ArrowRight :size="20" class="app-hero-arrow-icon" />
        </UiButton>
      </div>

      <div class="app-hero-stats">
        <div class="app-hero-stat">
          <span class="app-hero-stat-value">
            <span class="app-hero-counter" data-target="30">30</span>+
          </span>
          <span class="app-hero-stat-label">Avatar Styles</span>
        </div>
        <div class="app-hero-stat-divider"></div>
        <div class="app-hero-stat">
          <span class="app-hero-stat-value">
            {{ theme.githubStars?.['dicebear/dicebear'] || '8k+' }}
          </span>
          <span class="app-hero-stat-label">GitHub Stars</span>
        </div>
        <div class="app-hero-stat-divider"></div>
        <div class="app-hero-stat">
          <span class="app-hero-stat-value">
            <span class="app-hero-counter" data-target="1.25">1.25</span>B+
          </span>
          <span class="app-hero-stat-label">Monthly API Requests</span>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <button class="app-hero-scroll" @click="scrollToContent" aria-label="Scroll to content">
      <ChevronDown />
    </button>

    <!-- Decorative elements -->
    <div class="app-hero-orb app-hero-orb-1"></div>
    <div class="app-hero-orb app-hero-orb-2"></div>
    <div class="app-hero-orb app-hero-orb-3"></div>
  </section>
</template>

<style lang="scss">
:root {
  --app-hero-gradient:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14, 165, 233, 0.15), transparent),
    radial-gradient(ellipse 60% 40% at 80% 50%, rgba(124, 58, 237, 0.1), transparent),
    radial-gradient(ellipse 60% 40% at 20% 80%, rgba(14, 165, 233, 0.08), transparent);
  --app-hero-orb-1-bg: rgba(14, 165, 233, 0.25);
  --app-hero-orb-2-bg: rgba(124, 58, 237, 0.2);
  --app-hero-orb-3-bg: rgba(52, 211, 153, 0.15);
  --app-hero-stats-bg: rgba(255, 255, 255, 0.6);
  --app-hero-stats-border: rgba(255, 255, 255, 0.3);
}
.dark {
  --app-hero-gradient:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14, 165, 233, 0.2), transparent),
    radial-gradient(ellipse 60% 40% at 80% 50%, rgba(124, 58, 237, 0.15), transparent),
    radial-gradient(ellipse 60% 40% at 20% 80%, rgba(14, 165, 233, 0.1), transparent);
  --app-hero-orb-1-bg: rgba(14, 165, 233, 0.18);
  --app-hero-orb-2-bg: rgba(124, 58, 237, 0.15);
  --app-hero-orb-3-bg: rgba(52, 211, 153, 0.1);
  --app-hero-stats-bg: rgba(30, 30, 30, 0.6);
  --app-hero-stats-border: rgba(255, 255, 255, 0.1);
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

  &:hover .app-hero-bg {
    opacity: 0.2;
  }

  /* Animated gradient background */
  &-gradient {
    position: absolute;
    inset: 0;
    background: var(--app-hero-gradient);
    animation: app-hero-gradient-shift 15s ease-in-out infinite;
  }

  /* Floating avatars background */
  &-bg {
    position: absolute;
    inset: -10%;
    overflow: hidden;
    opacity: 0.15;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  &-floating-avatar {
    position: absolute;
    border-radius: 16px;
    overflow: hidden;
    will-change: transform;
    transform: translateZ(0);
    contain: layout style paint;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  /* Gradient orbs */
  &-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    animation: app-hero-orb-float 20s ease-in-out infinite;

    &-1 {
      width: 600px;
      height: 600px;
      background: var(--app-hero-orb-1-bg);
      top: -200px;
      right: -100px;
      animation-delay: 0s;
    }

    &-2 {
      width: 400px;
      height: 400px;
      background: var(--app-hero-orb-2-bg);
      bottom: -100px;
      left: -100px;
      animation-delay: -7s;
    }

    &-3 {
      width: 300px;
      height: 300px;
      background: var(--app-hero-orb-3-bg);
      top: 40%;
      left: 60%;
      animation-delay: -14s;
    }
  }

  /* Content */
  &-content {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 900px;
    animation: app-hero-fade-up 1s ease-out;
  }

  &-title {
    margin: 0 0 28px;
    line-height: 1.1;

    &-line {
      display: block;
      font-size: clamp(48px, 8vw, 76px);
      font-weight: 800;
      color: var(--vp-c-text-1);
      letter-spacing: -0.03em;
      margin-bottom: 8px;
    }

    &-dynamic {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: clamp(48px, 8vw, 76px);
      font-weight: 800;
      min-height: 1.2em;
    }

    &-text {
      background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-purple-1) 50%, var(--vp-c-brand-1) 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: app-hero-gradient-text 4s linear infinite;
      white-space: nowrap;
    }
  }

  &-cursor {
    display: inline-block;
    width: 4px;
    height: 0.9em;
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
  }

  &-highlight {
    color: var(--vp-c-brand-1);
    font-weight: 600;
  }

  &-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 56px;
  }

  &-btn-primary {
    padding: 18px 36px;
    font-size: 17px;

    &:hover {
      box-shadow:
        0 8px 30px rgba(14, 165, 233, 0.5),
        0 0 0 4px rgba(14, 165, 233, 0.1);
    }
  }

  &-btn-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: app-hero-shine 3s ease-in-out infinite;
  }

  &-stats {
    display: inline-flex;
    align-items: center;
    gap: 40px;
    padding: 24px 48px;
    background: var(--app-hero-stats-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 20px;
    border: 1px solid var(--app-hero-stats-border);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  }

  &-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    &-value {
      font-size: 32px;
      font-weight: 800;
      color: var(--vp-c-text-1);
      letter-spacing: -0.02em;
    }

    &-label {
      font-size: 13px;
      color: var(--vp-c-text-3);
      font-weight: 500;
      white-space: nowrap;
    }

    &-divider {
      width: 1px;
      height: 48px;
      background: linear-gradient(180deg, transparent, var(--vp-c-border), transparent);
    }
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
    background: var(--vp-c-bg);
    border: 2px solid var(--vp-c-border);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    animation: app-hero-bounce 2s ease-in-out infinite;
    z-index: 10;

    &:hover {
      border-color: var(--vp-c-brand-1);
      background: var(--vp-c-brand-soft);

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
    transform: scale(1.1) rotate(3deg);
  }
}

@keyframes app-hero-orb-float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.95);
  }
}

@keyframes app-hero-fade-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes app-hero-gradient-text {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}

@keyframes app-hero-cursor-blink {
  50% {
    opacity: 0;
  }
}

@keyframes app-hero-shine {
  0%, 100% {
    left: -100%;
  }
  50% {
    left: 100%;
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

    &-stats {
      flex-direction: column;
      gap: 20px;
      padding: 28px 36px;
    }

    &-stat-divider {
      width: 80px;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--vp-c-border), transparent);
    }

    &-orb {
      &-1 {
        width: 300px;
        height: 300px;
      }

      &-2 {
        width: 200px;
        height: 200px;
      }

      &-3 {
        width: 150px;
        height: 150px;
      }
    }

    &-scroll {
      display: none;
    }
  }
}
</style>
