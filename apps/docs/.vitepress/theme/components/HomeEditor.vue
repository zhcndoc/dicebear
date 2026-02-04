<script setup lang="ts">
import { ref, computed } from 'vue';
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

// Tab configuration
const tabs = ['Background', 'Hair', 'Eyes', 'Nose', 'Mouth'];
const activeTab = ref(0);

// Current avatar options
const currentOptions = ref({
  backgroundColor: 'ffd5dc',
  hair: '',
  eyes: '',
  nose: '',
  mouth: '',
});

// Background colors
const bgColors = [
  'ffd5dc', 'f8bbd9', 'e1bee7', 'd1c4e9',
  'c5cae9', 'bbdefb', 'b2ebf2', 'b2dfdb',
  'c8e6c9', 'dcedc8',
];

// Variants for each category
const variants = {
  hair: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10'],
  eyes: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10'],
  nose: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06'],
  mouth: ['happy01', 'happy02', 'happy03', 'happy04', 'happy05', 'happy06', 'happy07', 'happy08', 'happy09', 'happy10'],
};

// Darken a hex color by a percentage
function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex, 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - percent)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00ff) * (1 - percent)));
  const b = Math.max(0, Math.floor((num & 0x0000ff) * (1 - percent)));
  return ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

// Canvas background (slightly darker than avatar background)
const canvasBackground = computed(() => `#${darkenColor(currentOptions.value.backgroundColor, 0.15)}`);

// Build avatar URL from options
function buildAvatarUrl(options: typeof currentOptions.value) {
  const params = new URLSearchParams();
  params.set('seed', 'editorUser');
  if (options.backgroundColor) params.set('backgroundColor', options.backgroundColor);
  if (options.hair) params.set('hair', options.hair);
  if (options.eyes) params.set('eyes', options.eyes);
  if (options.nose) params.set('nose', options.nose);
  if (options.mouth) params.set('mouth', options.mouth);
  return `https://api.dicebear.com/9.x/lorelei/svg?${params.toString()}`;
}

// Main avatar URL
const mainAvatarUrl = computed(() => buildAvatarUrl(currentOptions.value));

// Panel items based on active tab
const panelItems = computed(() => {
  const tab = tabs[activeTab.value].toLowerCase();

  if (tab === 'background') {
    return bgColors.map(color => ({
      id: color,
      src: buildAvatarUrl({ ...currentOptions.value, backgroundColor: color }),
      selected: currentOptions.value.backgroundColor === color,
    }));
  }

  const key = tab as keyof typeof variants;
  const variantList = variants[key] || [];

  return variantList.map(variant => ({
    id: variant,
    src: buildAvatarUrl({ ...currentOptions.value, [key]: variant }),
    selected: currentOptions.value[key] === variant,
  }));
});

// Handle item selection
function selectItem(id: string) {
  const tab = tabs[activeTab.value].toLowerCase();

  if (tab === 'background') {
    currentOptions.value.backgroundColor = id;
  } else {
    const key = tab as keyof typeof currentOptions.value;
    currentOptions.value[key] = currentOptions.value[key] === id ? '' : id;
  }
}

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
</script>

<template>
  <UiSection class="editor-section" :class="{ visible: isVisible }" background="soft" divider>
    <div class="editor-bg">
      <div class="bg-gradient"></div>
      <div class="bg-dots"></div>
    </div>
    <UiContainer class="editor-container">
      <div class="editor-preview">
        <UiWindow variant="light" title="DiceBear Editor">
          <!-- Main avatar preview -->
          <div class="editor-canvas" :style="{ backgroundColor: canvasBackground }">
            <div class="avatar-preview" :style="{ backgroundColor: `#${currentOptions.backgroundColor}` }">
              <img
                :src="mainAvatarUrl"
                alt="Avatar Preview"
              />
            </div>
          </div>

          <!-- Bottom panel with tabs and options -->
          <div class="editor-panel">
            <div class="panel-tabs">
              <button
                v-for="(tab, index) in tabs"
                :key="tab"
                :class="['panel-tab', { active: index === activeTab }]"
                @click="activeTab = index"
              >
                {{ tab }}
              </button>
            </div>
            <div class="panel-grid">
              <button
                v-for="(item, index) in panelItems"
                :key="`${activeTab}-${item.id}`"
                :class="['panel-avatar', { selected: item.selected }]"
                :style="{ animationDelay: `${index * 0.05}s` }"
                @click="selectItem(item.id)"
              >
                <img :src="item.src" :alt="`Variant ${index + 1}`" />
              </button>
            </div>
          </div>
        </UiWindow>
      </div>

      <div class="editor-content">
        <UiBadge variant="brand">Visual Editor</UiBadge>
        <UiHeadline class="editor-title-text">Design Avatars <span class="highlight">Without Code</span></UiHeadline>
        <UiDescription class="editor-description">
          No developer? No problem! Our visual editor lets anyone create custom avatars
          without writing a single line of code. Just pick, click, and download.
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
.editor-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.editor-bg .bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 60% at 100% 50%, color-mix(in srgb, var(--vp-c-green-1) 6%, transparent), transparent);
}

.dark .editor-bg .bg-gradient {
  background: radial-gradient(ellipse 60% 60% at 100% 50%, color-mix(in srgb, var(--vp-c-green-1) 6%, transparent), transparent);
}

.editor-bg .bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--vp-c-text-3) 1px, transparent 1px);
  background-size: 24px 24px;
  background-repeat: repeat !important;
  opacity: 0.12;
  mask-image: radial-gradient(ellipse 50% 50% at 0% 50%, black, transparent);
  -webkit-mask-image: radial-gradient(ellipse 50% 50% at 0% 50%, black, transparent);
}

.editor-container {
  position: relative;
  z-index: 1;
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
  transition: background-color 0.3s ease;
}

.avatar-preview {
  width: 140px;
  height: 140px;
  background: #ffd5dc;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
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
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.panel-tab:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
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
  border: none;
  padding: 0;
  cursor: pointer;
  background: transparent;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.panel-avatar:hover {
  transform: scale(1.05);
}

.panel-avatar.selected {
  box-shadow: 0 0 0 3px var(--vp-c-brand-1);
}

.panel-avatar.selected:hover {
  transform: scale(1);
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
