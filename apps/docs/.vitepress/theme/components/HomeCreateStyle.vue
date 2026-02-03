<script setup lang="ts">
import { mdiArrowRight } from '@mdi/js';
import UiButton from './UiButton.vue';
import UiHeadline from './UiHeadline.vue';
import UiDescription from './UiDescription.vue';
import UiBadge from './UiBadge.vue';
import UiContainer from './UiContainer.vue';
import UiSection from './UiSection.vue';
import UiCard from './UiCard.vue';
import { useVisibility } from '../composables/useVisibility';

const isVisible = useVisibility('.create-style-section');

const steps = [
  {
    title: 'Design in Figma',
    description: 'Create your avatar components visually. Group colors and parts using our simple naming conventions.',
  },
  {
    title: 'Export with Plugin',
    description: 'Use the DiceBear Figma plugin to configure options and export your style as a ready-to-use package.',
  },
  {
    title: 'Build & Use',
    description: 'Run npm install and npm run build. Your custom style is ready to generate avatars.',
  },
];
</script>

<template>
  <UiSection class="create-style-section" :class="{ visible: isVisible }" divider>
    <div class="create-style-bg">
      <div class="bg-gradient"></div>
    </div>

    <UiContainer class="create-style-container">
      <div class="create-style-header">
        <UiBadge variant="green">For Designers</UiBadge>
        <UiHeadline>Create Your Own Style <span class="highlight">with Figma</span></UiHeadline>
        <UiDescription class="create-style-description">
          Design your avatar style visually in Figma. Our plugin handles the
          technical export – no coding required.
        </UiDescription>
      </div>

      <div class="create-style-grid">
        <div class="create-style-content">
          <div class="create-style-steps">
            <UiCard
              v-for="(step, index) in steps"
              :key="index"
              variant="default"
              padding="sm"
              radius="sm"
              class="step-card"
              :style="{ animationDelay: `${index * 0.15}s` }"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <h3 class="step-title">{{ step.title }}</h3>
                <p class="step-description">{{ step.description }}</p>
              </div>
            </UiCard>
          </div>

          <div class="create-style-actions">
            <UiButton href="/guides/create-an-avatar-style-with-figma/">
              Read the Figma Guide
              <svg viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
            </UiButton>
            <UiButton href="https://www.figma.com/community/plugin/1005765655729342787" variant="secondary" target="_blank">
              Get the Plugin
              <svg viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
            </UiButton>
          </div>
        </div>

        <div class="create-style-visual">
          <div class="figma-mockup">
            <div class="figma-sidebar">
              <div class="figma-layers">
                <div class="layer-group">
                  <span class="layer-icon folder"></span>
                  <span>face</span>
                </div>
                <div class="layer-item">
                  <span class="layer-icon component"></span>
                  <span>face/round</span>
                </div>
                <div class="layer-item">
                  <span class="layer-icon component"></span>
                  <span>face/oval</span>
                </div>
                <div class="layer-group">
                  <span class="layer-icon folder"></span>
                  <span>eyes</span>
                </div>
                <div class="layer-item">
                  <span class="layer-icon component"></span>
                  <span>eyes/happy</span>
                </div>
                <div class="layer-item active">
                  <span class="layer-icon component"></span>
                  <span>eyes/wink</span>
                </div>
                <div class="layer-group">
                  <span class="layer-icon folder"></span>
                  <span>mouth</span>
                </div>
                <div class="layer-item">
                  <span class="layer-icon component"></span>
                  <span>mouth/smile</span>
                </div>
              </div>
            </div>
            <div class="figma-canvas">
              <div class="canvas-avatar">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="28" fill="#FFD93D"/>
                  <circle cx="22" cy="28" r="4" fill="#1a1a2e"/>
                  <path d="M38 26 L42 30 L38 34" stroke="#1a1a2e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20 42 Q32 52 44 42" stroke="#1a1a2e" stroke-width="3" stroke-linecap="round" fill="none"/>
                </svg>
              </div>
              <div class="canvas-guides">
                <div class="guide guide-h"></div>
                <div class="guide guide-v"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style scoped>
.create-style-section {
  overflow: hidden;
}

.create-style-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, var(--vp-c-green-1) 8%, transparent), transparent);
}

.create-style-container {
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.create-style-section.visible .create-style-container {
  opacity: 1;
  transform: translateY(0);
}

.create-style-header {
  text-align: center;
  margin-bottom: 64px;
}

.create-style-description {
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}

.create-style-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}

.create-style-content {
  display: flex;
  flex-direction: column;
}

.create-style-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.step-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  opacity: 0;
  transform: translateX(-20px);
}

.create-style-section.visible .step-card {
  animation: step-reveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes step-reveal {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.step-number {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-green-1);
  color: var(--vp-c-bg);
  font-size: 14px;
  font-weight: 700;
  border-radius: 50%;
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 8px;
}

.step-description {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
}

.create-style-actions {
  display: flex;
  gap: 12px;
}

/* Figma Mockup Visual */
.create-style-visual {
  display: flex;
  justify-content: flex-end;
}

.figma-mockup {
  display: flex;
  width: 100%;
  max-width: 520px;
  height: 420px;
  background: #2c2c2c;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.25);
}

.figma-sidebar {
  width: 180px;
  background: #1e1e1e;
  border-right: 1px solid #3c3c3c;
  padding: 16px 0;
  overflow: hidden;
}

.figma-layers {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  font-family: var(--vp-font-family-mono);
}

.layer-group,
.layer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: #b3b3b3;
  white-space: nowrap;
}

.layer-group {
  color: #e0e0e0;
  font-weight: 500;
}

.layer-item {
  padding-left: 28px;
}

.layer-item.active {
  background: rgba(24, 160, 251, 0.2);
  color: #18a0fb;
}

.layer-icon {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}

.layer-icon.folder {
  background: #f5a623;
}

.layer-icon.component {
  background: #a259ff;
}

.figma-canvas {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background:
    linear-gradient(90deg, #3c3c3c 1px, transparent 1px),
    linear-gradient(#3c3c3c 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: center center;
}

.canvas-avatar {
  width: 160px;
  height: 160px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.canvas-avatar svg {
  width: 100%;
  height: 100%;
}

.canvas-guides {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.guide {
  position: absolute;
  background: rgba(255, 0, 85, 0.5);
}

.guide-h {
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
}

.guide-v {
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
}

@media (max-width: 960px) {
  .create-style-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .create-style-actions {
    justify-content: center;
  }

  .create-style-visual {
    justify-content: center;
  }

  .figma-mockup {
    max-width: 480px;
  }
}

@media (max-width: 640px) {
  .create-style-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .figma-mockup {
    height: 320px;
  }

  .figma-sidebar {
    width: 140px;
  }

  .canvas-avatar {
    width: 120px;
    height: 120px;
  }

  .layer-group,
  .layer-item {
    font-size: 10px;
    padding: 6px 8px;
  }

  .layer-item {
    padding-left: 20px;
  }
}
</style>
