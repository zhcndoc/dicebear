<script setup lang="ts">
import {
  mdiStar,
  mdiAccountGroup,
  mdiPalette,
  mdiGithub,
  mdiHeart,
} from '@mdi/js';
import UiButton from './UiButton.vue';
import UiHeadline from './UiHeadline.vue';
import UiDescription from './UiDescription.vue';
import UiContainer from './UiContainer.vue';
import UiSection from './UiSection.vue';
import UiIconBox from './UiIconBox.vue';
import { useVisibility } from '../composables/useVisibility';

const isVisible = useVisibility('.opensource');

const stats = [
  { icon: mdiStar, value: '8k+', label: 'GitHub Stars' },
  { icon: mdiAccountGroup, value: '10+', label: 'Contributors' },
  { icon: mdiPalette, value: '30+', label: 'Avatar Styles' },
];
</script>

<template>
  <UiSection class="opensource" :class="{ visible: isVisible }" background="soft" divider>
    <div class="opensource-bg">
      <div class="bg-pattern"></div>
    </div>

    <UiContainer size="narrow" class="opensource-container">
      <UiHeadline>Free and <span class="highlight">Open Source</span>. Forever.</UiHeadline>

      <UiDescription class="opensource-description">
        DiceBear is built in the open. Our core library is MIT licensed, and we believe
        in transparent development. Star us on GitHub, contribute code, or simply use it
        with confidence knowing the source is always available.
      </UiDescription>

      <div class="opensource-stats">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="opensource-stat"
          :style="{ animationDelay: `${index * 0.15}s` }"
        >
          <UiIconBox size="md">
            <svg viewBox="0 0 24 24"><path :d="stat.icon" fill="currentColor" /></svg>
          </UiIconBox>
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>

      <div class="opensource-actions">
        <UiButton
          href="https://github.com/dicebear/dicebear"
          variant="github"
          :external="true"
        >
          <svg viewBox="0 0 24 24"><path :d="mdiGithub" fill="currentColor" /></svg>
          Star on GitHub
        </UiButton>
        <UiButton
          href="/guides/contribute-to-the-library/"
          variant="secondary"
          class="opensource-contribute"
        >
          <svg viewBox="0 0 24 24"><path :d="mdiHeart" fill="currentColor" /></svg>
          Contribute
        </UiButton>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style scoped>
.opensource {
  text-align: center;
}

.opensource-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 1px 1px, var(--vp-c-border) 1px, transparent 0);
  background-size: 40px 40px;
  opacity: 0.5;
  mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);
  -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);
}

.opensource-container {
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.opensource.visible .opensource-container {
  opacity: 1;
  transform: translateY(0);
}

.opensource-description {
  margin-bottom: 64px;
  max-width: 600px;
}

.opensource-stats {
  display: flex;
  justify-content: center;
  gap: 56px;
  margin-bottom: 48px;
}

.opensource-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transform: translateY(20px);
}

.opensource.visible .opensource-stat {
  animation: stat-appear 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes stat-appear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.opensource-stat :deep(.ui-icon-box) {
  margin-bottom: 8px;
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 14px;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.opensource-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.opensource-actions :deep(.ui-button svg) {
  width: 22px;
  height: 22px;
}

.opensource-contribute :deep(svg) {
  color: #ec4899;
}

@media (max-width: 768px) {
  .opensource-stats {
    flex-direction: column;
    gap: 32px;
  }

  .opensource-actions {
    flex-direction: column;
  }
}
</style>
