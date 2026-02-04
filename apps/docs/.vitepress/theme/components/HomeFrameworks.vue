<script setup lang="ts">
import { siReact, siVuedotjs, siAngular, siSvelte } from 'simple-icons';
import UiHeadline from './UiHeadline.vue';
import UiDescription from './UiDescription.vue';
import UiBadge from './UiBadge.vue';
import UiContainer from './UiContainer.vue';
import UiSection from './UiSection.vue';
import UiIconBox from './UiIconBox.vue';
import { useVisibility } from '../composables/useVisibility';

const isVisible = useVisibility('.home-frameworks', { threshold: 0.15 });

const frameworks = [
  { name: 'React', icon: siReact.path, href: '/guides/use-the-library-with-react/', color: `#${siReact.hex}` },
  { name: 'Vue', icon: siVuedotjs.path, href: '/guides/use-the-library-with-vue/', color: `#${siVuedotjs.hex}` },
  { name: 'Angular', icon: siAngular.path, href: '/guides/use-the-library-with-angular/', color: '#dd0031' },
  { name: 'Svelte', icon: siSvelte.path, href: '/guides/use-the-library-with-svelte/', color: `#${siSvelte.hex}` },
];
</script>

<template>
  <UiSection class="home-frameworks" :class="{ visible: isVisible }" divider>
    <div class="home-frameworks-bg">
      <div class="bg-dots"></div>
      <div class="bg-gradient"></div>
    </div>
    <UiContainer size="narrow" class="home-frameworks-container">
      <div class="home-frameworks-header">
        <UiBadge>Framework Support</UiBadge>
        <UiHeadline>Works with Your <span class="highlight">Favorite</span> Framework</UiHeadline>
        <UiDescription>
          Use DiceBear with React, Vue, Svelte, Angular and more.
          Simply use our HTTP-API as image source or install the JS-library.
        </UiDescription>
      </div>

      <div class="home-frameworks-grid">
        <a
          v-for="(framework, index) in frameworks"
          :key="framework.name"
          :href="framework.href"
          class="framework-item"
          :style="{ '--framework-color': framework.color, animationDelay: `${index * 0.1}s` }"
        >
          <UiIconBox size="lg" :color="framework.color">
            <svg viewBox="0 0 24 24"><path :d="framework.icon" fill="currentColor" /></svg>
          </UiIconBox>
          <span class="framework-name">{{ framework.name }}</span>
        </a>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style scoped>
.home-frameworks-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.home-frameworks-bg .bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--vp-c-text-3) 1px, transparent 1px);
  background-size: 32px 32px;
  background-repeat: repeat !important;
  opacity: 0.2;
  mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);
  -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);
}

.home-frameworks-bg .bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent), transparent);
}

.dark .home-frameworks-bg .bg-gradient {
  background: radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent), transparent);
}

.home-frameworks-container {
  position: relative;
  z-index: 1;
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.home-frameworks.visible .home-frameworks-container {
  opacity: 1;
  transform: translateY(0);
}

.home-frameworks-header {
  margin-bottom: 48px;
}

.home-frameworks-grid {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}

.framework-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  padding: 24px 32px;
  min-width: 140px;
  border-radius: 16px;
  background: var(--vp-c-bg);
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
}

.dark .framework-item {
  border-color: rgba(255, 255, 255, 0.08);
}

.home-frameworks.visible .framework-item {
  animation: framework-reveal 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes framework-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.framework-item::after {
  display: none !important;
}

.framework-item:hover {
  transform: translateY(-8px);
  border-color: var(--framework-color);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
}

.framework-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
</style>
