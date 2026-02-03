<script setup lang="ts">
import {
  mdiGestureTap,
  mdiPalette,
  mdiDownload,
  mdiArrowRight,
} from '@mdi/js';
import UiButton from './UiButton.vue';
import UiHeadline from './UiHeadline.vue';
import UiDescription from './UiDescription.vue';
import UiBadge from './UiBadge.vue';
import UiContainer from './UiContainer.vue';
import UiSection from './UiSection.vue';
import UiWindow from './UiWindow.vue';
import UiIconBox from './UiIconBox.vue';
import { useVisibility } from '../composables/useVisibility';

const isVisible = useVisibility('.editor-section');

// Background colors matching the editor screenshot
const bgColors = [
  '#ffd5dc', '#f8bbd9', '#e1bee7', '#d1c4e9',
  '#c5cae9', '#bbdefb', '#b2ebf2', '#b2dfdb',
  '#c8e6c9', '#dcedc8', '#f0f4c3', '#fff9c4',
];

// Generate showcase avatars with different background colors
const showcaseAvatars = bgColors.slice(0, 10).map((bg, i) => ({
  src: `https://api.dicebear.com/9.x/lorelei/svg?seed=editorUser&backgroundColor=${bg.replace('#', '')}`,
  bg,
}));

const features = [
  {
    icon: mdiGestureTap,
    title: 'No Coding Required',
    description: 'Click to customize hair, eyes, accessories, and more.',
  },
  {
    icon: mdiPalette,
    title: 'Endless Combinations',
    description: 'Mix and match colors and styles to create your unique look.',
  },
  {
    icon: mdiDownload,
    title: 'Download as PNG',
    description: 'Save your avatar and use it anywhere you like.',
  },
];

const tabs = ['Style', 'Background', 'Hair', 'Eyes', 'Nose', 'Mouth'];
</script>

<template>
  <UiSection class="editor-section" :class="{ visible: isVisible }" background="soft" divider>
    <UiContainer class="editor-container">
      <div class="editor-preview">
        <UiWindow variant="light" title="DiceBear Editor">
          <!-- Main avatar preview -->
          <div class="editor-canvas">
            <div class="avatar-preview">
              <img
                src="https://api.dicebear.com/9.x/lorelei/svg?seed=editorUser&backgroundColor=ffd5dc"
                alt="Avatar Preview"
                loading="lazy"
              />
            </div>
          </div>

          <!-- Bottom panel with tabs and options -->
          <div class="editor-panel">
            <div class="panel-tabs">
              <span
                v-for="(tab, index) in tabs"
                :key="tab"
                :class="['panel-tab', { active: index === 1 }]"
              >
                {{ tab }}
              </span>
            </div>
            <div class="panel-grid">
              <div
                v-for="(avatar, index) in showcaseAvatars"
                :key="index"
                :class="['panel-avatar', { selected: index === 0 }]"
                :style="{ animationDelay: `${index * 0.05}s` }"
              >
                <img :src="avatar.src" :alt="`Variant ${index + 1}`" loading="lazy" />
              </div>
            </div>
          </div>
        </UiWindow>
      </div>

      <div class="editor-content">
        <UiBadge variant="brand">Avatar Editor</UiBadge>
        <UiHeadline class="editor-title-text">Create Your <span class="highlight">Perfect</span> Avatar</UiHeadline>
        <UiDescription class="editor-description">
          Design your unique avatar with our easy-to-use visual editor.
          No technical skills needed - just pick and click to customize every detail.
        </UiDescription>

        <div class="editor-features">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="editor-feature"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <UiIconBox size="md">
              <svg viewBox="0 0 24 24"><path :d="feature.icon" fill="currentColor" /></svg>
            </UiIconBox>
            <div class="feature-text">
              <h4 class="feature-title">{{ feature.title }}</h4>
              <p class="feature-description">{{ feature.description }}</p>
            </div>
          </div>
        </div>

        <div class="editor-actions">
          <UiButton href="https://editor.dicebear.com" :external="true">
            Open Editor
            <svg viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
          </UiButton>
        </div>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style scoped>
.editor-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 80px;
  align-items: center;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.editor-section.visible .editor-container {
  opacity: 1;
  transform: translateY(0);
}

.editor-preview {
  min-width: 0;
}

/* Canvas */
.editor-canvas {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  min-height: 200px;
  background: #f0b6f3;
}

.avatar-preview {
  width: 140px;
  height: 140px;
  background: #ffd5dc;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Bottom panel */
.editor-panel {
  background: var(--vp-c-bg);
  border-top: 1px solid var(--vp-c-border);
  padding: 16px;
}

.panel-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.panel-tab {
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.panel-tab.active {
  color: var(--vp-c-green-1);
  background: var(--vp-c-green-soft);
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.panel-avatar {
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  opacity: 0;
  transform: scale(0.9);
}

.panel-avatar.selected {
  box-shadow: 0 0 0 3px var(--vp-c-brand-1);
}

.editor-section.visible .panel-avatar {
  animation: avatar-pop 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes avatar-pop {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.panel-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Content */
.editor-content {
  min-width: 0;
}

.editor-title-text {
  margin-bottom: 24px;
}

.editor-description {
  margin: 0 0 36px 0;
  max-width: none;
}

.editor-features {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 36px;
}

.editor-feature {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  opacity: 0;
  transform: translateX(20px);
}

.editor-section.visible .editor-feature {
  animation: feature-slide 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes feature-slide {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.feature-text {
  min-width: 0;
}

.feature-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 4px;
}

.feature-description {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
}

.editor-actions {
  display: flex;
  gap: 16px;
}

@media (max-width: 1000px) {
  .editor-container {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .editor-preview {
    order: 2;
  }

  .editor-content {
    order: 1;
  }
}

@media (max-width: 640px) {
  .panel-grid {
    grid-template-columns: repeat(5, 1fr);
  }

  .panel-tabs {
    gap: 4px;
  }

  .panel-tab {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>
