<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ThemeOptions } from '@shared/types';
import { useData } from 'vitepress';
import { kebabCase } from 'change-case';
import Prando from 'prando';
import { mdiPlay, mdiArrowRight } from '@mdi/js';

const { theme } = useData<ThemeOptions>();

const prng = new Prando(777);
const avatarStyleList = computed(() => Object.keys(theme.value.avatarStyles));

// Generate floating avatars for background
const floatingAvatars = computed(() => {
  const avatars = [];
  const seeds = ['Luna', 'Max', 'Sophie', 'Felix', 'Emma', 'Leo', 'Mia', 'Noah', 'Aria', 'Liam', 'Zoe', 'Oscar'];
  const styles = avatarStyleList.value;

  for (let i = 0; i < 24; i++) {
    const style = kebabCase(styles[i % styles.length]);
    const seed = seeds[i % seeds.length];
    avatars.push({
      src: `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&size=80`,
      style,
      x: prng.next() * 100,
      y: prng.next() * 100,
      size: 40 + prng.next() * 40,
      delay: prng.next() * 5,
      duration: 15 + prng.next() * 10,
    });
  }
  return avatars;
});

// Typewriter effect for tagline
const taglines = [
  'for user profiles',
  'for chat applications',
  'for gaming platforms',
  'for social networks',
  'for team collaboration',
  'for any project',
];

const currentTagline = ref(0);
const displayedText = ref('');
const isDeleting = ref(false);

let typewriterTimeout: ReturnType<typeof setTimeout>;

function typeWriter() {
  const fullText = taglines[currentTagline.value];

  if (!isDeleting.value) {
    displayedText.value = fullText.substring(0, displayedText.value.length + 1);

    if (displayedText.value === fullText) {
      typewriterTimeout = setTimeout(() => {
        isDeleting.value = true;
        typeWriter();
      }, 2000);
      return;
    }
  } else {
    displayedText.value = fullText.substring(0, displayedText.value.length - 1);

    if (displayedText.value === '') {
      isDeleting.value = false;
      currentTagline.value = (currentTagline.value + 1) % taglines.length;
    }
  }

  typewriterTimeout = setTimeout(typeWriter, isDeleting.value ? 30 : 80);
}

onMounted(() => {
  typeWriter();
});

onUnmounted(() => {
  clearTimeout(typewriterTimeout);
});
</script>

<template>
  <section class="hero">
    <!-- Floating avatars background -->
    <div class="hero-bg">
      <div
        v-for="(avatar, index) in floatingAvatars"
        :key="index"
        class="floating-avatar"
        :style="{
          left: `${avatar.x}%`,
          top: `${avatar.y}%`,
          width: `${avatar.size}px`,
          height: `${avatar.size}px`,
          animationDelay: `${avatar.delay}s`,
          animationDuration: `${avatar.duration}s`,
        }"
      >
        <img :src="avatar.src" :alt="avatar.style" loading="lazy" />
      </div>
    </div>

    <div class="hero-content">
      <h1 class="hero-title">
        <span class="hero-title-main">Unique Avatars</span>
        <span class="hero-title-dynamic">{{ displayedText }}<span class="cursor">|</span></span>
      </h1>

      <p class="hero-description">
        Generate beautiful, deterministic avatars from any seed.
        30+&nbsp;styles crafted by talented artists. Free&nbsp;API, JavaScript&nbsp;library, and CLI.
      </p>

      <div class="hero-actions">
        <a href="/playground/" class="hero-btn primary">
          <svg viewBox="0 0 24 24"><path :d="mdiPlay" fill="currentColor" /></svg>
          Try Playground
        </a>
        <a href="/introduction/" class="hero-btn secondary">
          Get Started
          <svg viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
        </a>
      </div>

      <div class="hero-stats">
        <div class="hero-stat">
          <span class="hero-stat-value">30+</span>
          <span class="hero-stat-label">Avatar Styles</span>
        </div>
        <div class="hero-stat-divider"></div>
        <div class="hero-stat">
          <span class="hero-stat-value">8k+</span>
          <span class="hero-stat-label">GitHub Stars</span>
        </div>
        <div class="hero-stat-divider"></div>
        <div class="hero-stat">
          <span class="hero-stat-value">1.25B+</span>
          <span class="hero-stat-label">Monthly API Requests</span>
        </div>
      </div>
    </div>

    <!-- Decorative gradient orbs -->
    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  overflow: hidden;
  background: linear-gradient(180deg,
    rgba(22, 137, 204, 0.06) 0%,
    var(--vp-c-bg) 50%,
    rgba(111, 66, 193, 0.04) 100%
  );
}

.dark .hero {
  background: linear-gradient(180deg,
    rgba(22, 137, 204, 0.08) 0%,
    var(--vp-c-bg) 50%,
    rgba(111, 66, 193, 0.05) 100%
  );
}

/* Floating avatars background */
.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  opacity: 0.12;
  pointer-events: none;
}

.floating-avatar {
  position: absolute;
  border-radius: 12px;
  overflow: hidden;
  animation: float-around 20s ease-in-out infinite;
}

.floating-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@keyframes float-around {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(10px, -20px) rotate(5deg);
  }
  50% {
    transform: translate(-5px, 10px) rotate(-3deg);
  }
  75% {
    transform: translate(-15px, -10px) rotate(3deg);
  }
}

/* Gradient orbs */
.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
}

.hero-orb-1 {
  width: 600px;
  height: 600px;
  background: rgba(22, 137, 204, 0.25);
  top: -200px;
  right: -100px;
}

.hero-orb-2 {
  width: 400px;
  height: 400px;
  background: rgba(111, 66, 193, 0.2);
  bottom: -100px;
  left: -100px;
}

.dark .hero-orb-1 {
  background: rgba(22, 137, 204, 0.15);
}

.dark .hero-orb-2 {
  background: rgba(111, 66, 193, 0.12);
}

/* Content */
.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin-bottom: 32px;
}

.hero-badge svg {
  width: 16px;
  height: 16px;
}

.hero-title {
  margin: 0 0 24px;
  line-height: 1.1;
}

.hero-title-main {
  display: block;
  font-size: clamp(48px, 8vw, 72px);
  font-weight: 800;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}

.hero-title-dynamic {
  display: block;
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 600;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-purple-1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  min-height: 1.2em;
  margin-top: 8px;
}

.cursor {
  display: inline-block;
  animation: blink 1s step-end infinite;
  -webkit-text-fill-color: var(--vp-c-brand-1);
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.hero-description {
  font-size: 20px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0 0 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 56px;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.hero-btn::after {
  display: none !important;
}

.hero-btn svg {
  width: 20px;
  height: 20px;
}

.hero-btn.primary {
  background: linear-gradient(135deg, var(--vp-c-brand-3) 0%, var(--vp-c-brand-1) 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(22, 137, 204, 0.3);
}

.hero-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(22, 137, 204, 0.4);
}

.hero-btn.secondary {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 2px solid var(--vp-c-border);
}

.hero-btn.secondary:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 32px;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
}

.dark .hero-stats {
  background: rgba(0, 0, 0, 0.08);
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.hero-stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.hero-stat-label {
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-weight: 500;
  white-space: nowrap;
}

.hero-stat-divider {
  width: 1px;
  height: 40px;
  background: var(--vp-c-border);
}

@media (max-width: 768px) {
  .hero {
    min-height: auto;
    padding: 60px 16px;
  }

  .hero-description {
    font-size: 17px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .hero-btn {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }

  .hero-stats {
    flex-direction: column;
    gap: 16px;
    padding: 24px 32px;
  }

  .hero-stat-divider {
    width: 60px;
    height: 1px;
  }

  .hero-orb-1 {
    width: 300px;
    height: 300px;
  }

  .hero-orb-2 {
    width: 200px;
    height: 200px;
  }
}
</style>
