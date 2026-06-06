<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ChevronDown } from '@lucide/vue';
import AppHeroContent from './AppHeroContent.vue';
import AppHeroSwarm from './AppHeroSwarm.vue';
import { useVisibility } from '../../composables/useVisibility';
import { useParallax } from '../../composables/useParallax';

const isVisible = useVisibility('.app-hero', { once: false, threshold: 0.1 });
const heroRef = ref<HTMLElement>();
const { setContainer, handleMouseMove } = useParallax(isVisible);

function scrollToContent() {
  const next = heroRef.value?.nextElementSibling;

  if (next) {
    next.scrollIntoView({ behavior: 'smooth' });
  }
}

onMounted(() => {
  if (heroRef.value) {
    setContainer(heroRef.value);
  }
});
</script>

<template>
  <section
    ref="heroRef"
    class="app-hero"
    :class="{ 'app-hero--paused': !isVisible }"
    @mousemove="handleMouseMove"
  >
    <div class="app-hero-gradient"></div>

    <div class="app-hero-shape app-hero-shape-1"></div>
    <div class="app-hero-shape app-hero-shape-2"></div>
    <div class="app-hero-shape app-hero-shape-3"></div>
    <div class="app-hero-shape app-hero-shape-4"></div>

    <div class="app-hero-grid">
      <AppHeroContent />
      <AppHeroSwarm />
    </div>

    <button
      class="app-hero-scroll"
      @click="scrollToContent"
      aria-label="Scroll to content"
    >
      <ChevronDown />
    </button>
  </section>
</template>

<style lang="scss">
:root {
  --app-hero-gradient:
    radial-gradient(
      ellipse 80% 50% at 50% -20%,
      rgba(59, 130, 246, 0.12),
      transparent
    ),
    radial-gradient(
      ellipse 60% 40% at 80% 50%,
      rgba(236, 72, 153, 0.08),
      transparent
    ),
    radial-gradient(
      ellipse 60% 40% at 20% 80%,
      rgba(20, 184, 166, 0.06),
      transparent
    );
}
.dark {
  --app-hero-gradient:
    radial-gradient(
      ellipse 80% 50% at 50% -20%,
      rgba(59, 130, 246, 0.15),
      transparent
    ),
    radial-gradient(
      ellipse 60% 40% at 80% 50%,
      rgba(236, 72, 153, 0.1),
      transparent
    ),
    radial-gradient(
      ellipse 60% 40% at 20% 80%,
      rgba(20, 184, 166, 0.08),
      transparent
    );
}

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
    .app-hero-scroll,
    .app-hero-title-text,
    .app-hero-shape,
    .app-hero-swarm-tile {
      animation-play-state: paused;
    }
  }

  &-grid {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1180px;
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: 64px;
    align-items: center;
  }

  &-gradient {
    position: absolute;
    inset: 0;
    background: var(--app-hero-gradient);
    animation: app-hero-gradient-shift 20s ease-in-out infinite;
  }

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
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent) 0%,
        transparent 70%
      );
      animation: shape-float 18s ease-in-out infinite;
    }

    &-2 {
      width: 350px;
      height: 350px;
      bottom: -5%;
      left: -3%;
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--vp-c-pink-2) 8%, transparent) 0%,
        transparent 70%
      );
      animation: shape-float 22s ease-in-out infinite reverse;
    }

    &-3 {
      width: 200px;
      height: 200px;
      top: 30%;
      left: 8%;
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--vp-c-green-1) 10%, transparent) 0%,
        transparent 70%
      );
      animation: shape-float 15s ease-in-out infinite;
      animation-delay: -5s;
    }

    &-4 {
      width: 160px;
      height: 160px;
      top: 20%;
      right: 12%;
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--vp-c-pink-2) 8%, transparent) 0%,
        transparent 70%
      );
      animation: shape-float 20s ease-in-out infinite;
      animation-delay: -10s;
    }
  }

  &-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    animation: fade-up var(--duration-reveal) var(--ease-smooth);
  }

  &-title {
    margin: 0 0 28px;
    line-height: 1.02;
    letter-spacing: -0.035em;
    animation: fade-up var(--duration-reveal) var(--ease-smooth) 0.2s both;

    &-line {
      display: block;
      font-size: clamp(44px, 6vw, 68px);
      font-weight: 800;
      color: var(--vp-c-text-1);
    }

    &-text {
      background: linear-gradient(
        120deg,
        var(--vp-c-brand-1) 0%,
        var(--vp-c-pink-2) 50%,
        var(--vp-c-brand-1) 100%
      );
      background-size: 300% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: app-hero-gradient-text 6s linear infinite;
    }
  }

  &-description {
    font-size: 20px;
    color: var(--vp-c-text-2);
    line-height: 1.7;
    margin: 0 0 40px;
    max-width: 540px;
    animation: fade-up var(--duration-reveal) var(--ease-smooth) 0.3s both;
  }

  &-highlight {
    color: var(--vp-c-brand-1);
    font-weight: 700;
  }

  &-actions {
    display: flex;
    justify-content: flex-start;
    gap: 16px;
    animation: fade-up var(--duration-reveal) var(--ease-smooth) 0.4s both;
  }

  &-btn-primary {
    padding: 18px 36px;
    font-size: 17px;
  }

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
  0%,
  100% {
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

@keyframes app-hero-bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(8px);
  }
}

@media (max-width: 960px) {
  .app-hero {
    &-grid {
      grid-template-columns: 1fr;
      gap: 48px;
    }

    &-content {
      align-items: center;
      text-align: center;
    }

    &-title {
      &-dynamic {
        justify-content: center;
      }
    }

    &-description {
      margin-left: auto;
      margin-right: auto;
    }

    &-actions {
      justify-content: center;
    }
  }
}

@media (max-width: 768px) {
  .app-hero {
    min-height: auto;
    padding: 100px 16px 80px;

    &-title {
      &-line {
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

    &-shape {
      &-1 {
        width: 250px;
        height: 250px;
      }
      &-2 {
        width: 180px;
        height: 180px;
      }
      &-3,
      &-4 {
        display: none;
      }
    }

    &-scroll {
      display: none;
    }
  }
}
</style>
