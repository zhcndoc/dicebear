<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { ThemeOptions } from '@shared/types';
import { useData } from 'vitepress';
import { kebabCase } from 'change-case';
import Prando from 'prando';
import { mdiPlay, mdiArrowRight, mdiChevronDown } from '@mdi/js';
import UiButton from './UiButton.vue';
import { useVisibility } from '../composables/useVisibility';

const { theme } = useData<ThemeOptions>();

const isVisible = useVisibility('.hero', { once: false, threshold: 0.1 });

const prng = new Prando(777);
const avatarStyleList = computed(() => Object.keys(theme.value.avatarStyles));

// Mouse position for parallax effect (using lerping for smooth movement)
const mouseX = ref(0.5);
const mouseY = ref(0.5);
const targetMouseX = ref(0.5);
const targetMouseY = ref(0.5);
let animationFrameId: number | null = null;

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
        src: `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&size=80`,
        style,
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

// Typewriter effect for tagline
const taglines = [
  'user profiles',
  'chat applications',
  'gaming platforms',
  'social networks',
  'team tools',
  'any project',
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
      }, 2500);
      return;
    }
  } else {
    displayedText.value = fullText.substring(0, displayedText.value.length - 1);

    if (displayedText.value === '') {
      isDeleting.value = false;
      currentTagline.value = (currentTagline.value + 1) % taglines.length;
    }
  }

  typewriterTimeout = setTimeout(typeWriter, isDeleting.value ? 40 : 100);
}

function handleMouseMove(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  targetMouseX.value = (e.clientX - rect.left) / rect.width;
  targetMouseY.value = (e.clientY - rect.top) / rect.height;
}

function animateParallax() {
  if (!isVisible.value) {
    animationFrameId = null;
    return;
  }
  const lerp = 0.08;
  mouseX.value += (targetMouseX.value - mouseX.value) * lerp;
  mouseY.value += (targetMouseY.value - mouseY.value) * lerp;
  animationFrameId = requestAnimationFrame(animateParallax);
}

function startParallax() {
  if (animationFrameId === null) {
    animationFrameId = requestAnimationFrame(animateParallax);
  }
}

function scrollToContent() {
  const section = document.querySelector('.seed-demo');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

watch(isVisible, (visible) => {
  if (visible) {
    startParallax();
  }
});

onMounted(() => {
  updateScreenSize();
  window.addEventListener('resize', updateScreenSize);
  typeWriter();
  if (isVisible.value) {
    startParallax();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize);
  clearTimeout(typewriterTimeout);
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<template>
  <section class="hero" @mousemove="handleMouseMove">
    <!-- Animated gradient background -->
    <div class="hero-gradient"></div>

    <!-- Floating avatars background with parallax -->
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
          transform: `translate(${(mouseX - 0.5) * 30 * avatar.parallaxFactor}px, ${(mouseY - 0.5) * 30 * avatar.parallaxFactor}px)`,
        }"
      >
        <img :src="avatar.src" :alt="avatar.style" loading="lazy" />
      </div>
    </div>

    <div class="hero-content">
      <h1 class="hero-title">
        <span class="hero-title-line">Unique Avatars for</span>
        <span class="hero-title-dynamic">
          <span class="hero-title-text">{{ displayedText }}</span>
          <span class="cursor"></span>
        </span>
      </h1>

      <p class="hero-description">
        Generate beautiful, unique avatars from any string.
        <span class="hero-highlight" style="white-space: nowrap">30+ styles</span>&nbsp;crafted by talented designers.
        Free&nbsp;API, JavaScript&nbsp;library &amp; CLI.
      </p>

      <div class="hero-actions">
        <UiButton href="/playground/" class="hero-btn-primary">
          <svg viewBox="0 0 24 24"><path :d="mdiPlay" fill="currentColor" /></svg>
          Try Playground
          <span class="btn-shine"></span>
        </UiButton>
        <UiButton href="/introduction/" variant="secondary">
          Get Started
          <svg viewBox="0 0 24 24" class="arrow-icon"><path :d="mdiArrowRight" fill="currentColor" /></svg>
        </UiButton>
      </div>

      <div class="hero-stats">
        <div class="hero-stat">
          <span class="hero-stat-value">
            <span class="counter" data-target="30">30</span>+
          </span>
          <span class="hero-stat-label">Avatar Styles</span>
        </div>
        <div class="hero-stat-divider"></div>
        <div class="hero-stat">
          <span class="hero-stat-value">
            <span class="counter" data-target="8">8</span>k+
          </span>
          <span class="hero-stat-label">GitHub Stars</span>
        </div>
        <div class="hero-stat-divider"></div>
        <div class="hero-stat">
          <span class="hero-stat-value">
            <span class="counter" data-target="1.25">1.25</span>B+
          </span>
          <span class="hero-stat-label">Monthly API Requests</span>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <button class="hero-scroll" @click="scrollToContent" aria-label="Scroll to content">
      <svg viewBox="0 0 24 24"><path :d="mdiChevronDown" fill="currentColor" /></svg>
    </button>

    <!-- Decorative elements -->
    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
    <div class="hero-orb hero-orb-3"></div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: calc(100vh - var(--vp-nav-height, 64px));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  overflow: hidden;
}

/* Animated gradient background */
.hero-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(22, 137, 204, 0.15), transparent),
    radial-gradient(ellipse 60% 40% at 80% 50%, rgba(111, 66, 193, 0.1), transparent),
    radial-gradient(ellipse 60% 40% at 20% 80%, rgba(22, 137, 204, 0.08), transparent);
  animation: gradient-shift 15s ease-in-out infinite;
}

.dark .hero-gradient {
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(22, 137, 204, 0.2), transparent),
    radial-gradient(ellipse 60% 40% at 80% 50%, rgba(111, 66, 193, 0.15), transparent),
    radial-gradient(ellipse 60% 40% at 20% 80%, rgba(22, 137, 204, 0.1), transparent);
}

@keyframes gradient-shift {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.1) rotate(3deg);
  }
}

/* Floating avatars background */
.hero-bg {
  position: absolute;
  inset: -10%;
  overflow: hidden;
  opacity: 0.15;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.hero:hover .hero-bg {
  opacity: 0.2;
}

.floating-avatar {
  position: absolute;
  border-radius: 16px;
  overflow: hidden;
  will-change: transform;
  transform: translateZ(0);
  contain: layout style paint;
}

.floating-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


/* Gradient orbs */
.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  animation: orb-float 20s ease-in-out infinite;
}

.hero-orb-1 {
  width: 600px;
  height: 600px;
  background: rgba(22, 137, 204, 0.25);
  top: -200px;
  right: -100px;
  animation-delay: 0s;
}

.hero-orb-2 {
  width: 400px;
  height: 400px;
  background: rgba(111, 66, 193, 0.2);
  bottom: -100px;
  left: -100px;
  animation-delay: -7s;
}

.hero-orb-3 {
  width: 300px;
  height: 300px;
  background: rgba(52, 211, 153, 0.15);
  top: 40%;
  left: 60%;
  animation-delay: -14s;
}

@keyframes orb-float {
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

.dark .hero-orb-1 {
  background: rgba(22, 137, 204, 0.18);
}

.dark .hero-orb-2 {
  background: rgba(111, 66, 193, 0.15);
}

.dark .hero-orb-3 {
  background: rgba(52, 211, 153, 0.1);
}

/* Content */
.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 900px;
  animation: fade-up 1s ease-out;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  margin: 0 0 28px;
  line-height: 1.1;
}

.hero-title-line {
  display: block;
  font-size: clamp(40px, 7vw, 64px);
  font-weight: 800;
  color: var(--vp-c-text-1);
  letter-spacing: -0.03em;
  margin-bottom: 8px;
}

.hero-title-dynamic {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(40px, 7vw, 64px);
  font-weight: 800;
  min-height: 1.2em;
}

.hero-title-text {
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-purple-1) 50%, var(--vp-c-brand-1) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-text 4s linear infinite;
  white-space: nowrap;
}

@keyframes gradient-text {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}

.cursor {
  display: inline-block;
  width: 4px;
  height: 0.9em;
  background: var(--vp-c-brand-1);
  margin-left: 4px;
  border-radius: 2px;
  animation: cursor-blink 1s step-end infinite;
}

@keyframes cursor-blink {
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

.hero-highlight {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 56px;
}

.hero-btn-primary {
  padding: 18px 36px;
  font-size: 17px;
}

.hero-btn-primary:hover {
  box-shadow:
    0 8px 30px rgba(22, 137, 204, 0.5),
    0 0 0 4px rgba(22, 137, 204, 0.1);
}

.btn-shine {
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
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0%, 100% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
}

.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 40px;
  padding: 24px 48px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.dark .hero-stats {
  background: rgba(30, 30, 30, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.hero-stat-value {
  font-size: 32px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}

.hero-stat-label {
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-weight: 500;
  white-space: nowrap;
}

.hero-stat-divider {
  width: 1px;
  height: 48px;
  background: linear-gradient(180deg, transparent, var(--vp-c-border), transparent);
}

/* Scroll indicator */
.hero-scroll {
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
  animation: bounce 2s ease-in-out infinite;
  z-index: 10;
}

.hero-scroll:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.hero-scroll svg {
  width: 24px;
  height: 24px;
  color: var(--vp-c-text-2);
}

.hero-scroll:hover svg {
  color: var(--vp-c-brand-1);
}

@keyframes bounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(8px);
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: auto;
    padding: 100px 16px 80px;
  }

  .hero-description {
    font-size: 17px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .hero-actions :deep(.ui-button) {
    width: 100%;
    max-width: 280px;
  }

  .hero-btn-primary {
    padding: 16px 28px;
  }

  .hero-stats {
    flex-direction: column;
    gap: 20px;
    padding: 28px 36px;
  }

  .hero-stat-divider {
    width: 80px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--vp-c-border), transparent);
  }

  .hero-orb-1 {
    width: 300px;
    height: 300px;
  }

  .hero-orb-2 {
    width: 200px;
    height: 200px;
  }

  .hero-orb-3 {
    width: 150px;
    height: 150px;
  }

  .hero-scroll {
    display: none;
  }
}
</style>
