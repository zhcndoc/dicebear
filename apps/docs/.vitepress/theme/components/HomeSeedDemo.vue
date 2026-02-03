<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue';
import { ThemeOptions } from '@shared/types';
import { useData } from 'vitepress';
import { kebabCase, camelCase } from 'change-case';
import { mdiArrowRight, mdiDice5, mdiContentCopy, mdiCheck } from '@mdi/js';
import UiButton from './UiButton.vue';
import UiHeadline from './UiHeadline.vue';
import UiDescription from './UiDescription.vue';
import UiBadge from './UiBadge.vue';
import UiContainer from './UiContainer.vue';
import UiSection from './UiSection.vue';
import UiIconBox from './UiIconBox.vue';
import UiCard from './UiCard.vue';
import { useVisibility } from '../composables/useVisibility';

const { theme } = useData<ThemeOptions>();

const seed = ref('Felix');
const isVisible = useVisibility('.seed-demo');
const copiedTab = ref<string | null>(null);
const activeStyleIndex = ref(0);
const activeTab = ref<'api' | 'js' | 'cli'>('api');
const tabs = ['api', 'js', 'cli'] as const;
const activeTabIndex = computed(() => tabs.indexOf(activeTab.value));
const loadingAvatars = reactive<Record<string, boolean>>({});
const mainAvatarLoading = ref(true);
const isMounted = ref(false);

const avatarStyleList = computed(() => Object.keys(theme.value.avatarStyles));

const currentStyle = computed(() => kebabCase(avatarStyleList.value[activeStyleIndex.value] || 'lorelei'));
const currentStyleCamel = computed(() => camelCase(avatarStyleList.value[activeStyleIndex.value] || 'lorelei'));

const mainAvatar = computed(() => ({
  src: `https://api.dicebear.com/9.x/${currentStyle.value}/svg?seed=${encodeURIComponent(seed.value || 'DiceBear')}&size=256`
}));

const allAvatars = computed(() =>
  avatarStyleList.value.map(style => ({
    style: kebabCase(style),
    src: `https://api.dicebear.com/9.x/${kebabCase(style)}/svg?seed=${encodeURIComponent(seed.value || 'DiceBear')}&size=96`
  }))
);

// Syntax highlighted code examples
const apiExampleHtml = computed(() => {
  const seedVal = seed.value || 'DiceBear';
  return `<span class="hl-url">https://api.dicebear.com/9.x/${currentStyle.value}/svg</span><span class="hl-param">?seed=</span><span class="hl-string">${seedVal}</span>`;
});

const jsExampleHtml = computed(() => {
  const seedVal = seed.value || 'DiceBear';
  return `<span class="hl-keyword">import</span> { <span class="hl-variable">createAvatar</span> } <span class="hl-keyword">from</span> <span class="hl-string">'@dicebear/core'</span>;
<span class="hl-keyword">import</span> <span class="hl-operator">*</span> <span class="hl-keyword">as</span> <span class="hl-variable">${currentStyleCamel.value}</span> <span class="hl-keyword">from</span> <span class="hl-string">'@dicebear/${currentStyle.value}'</span>;

<span class="hl-keyword">const</span> <span class="hl-variable">avatar</span> <span class="hl-operator">=</span> <span class="hl-function">createAvatar</span>(<span class="hl-variable">${currentStyleCamel.value}</span>, {
  <span class="hl-property">seed</span>: <span class="hl-string">'${seedVal}'</span>
});`;
});

const cliExampleHtml = computed(() => {
  const seedVal = seed.value || 'DiceBear';
  return `<span class="hl-command">npx</span> <span class="hl-argument">dicebear</span> <span class="hl-variable">${currentStyle.value}</span> <span class="hl-flag">--seed</span> <span class="hl-string">"${seedVal}"</span>`;
});

// Plain text for copy
const apiExample = computed(() =>
  `https://api.dicebear.com/9.x/${currentStyle.value}/svg?seed=${seed.value || 'DiceBear'}`
);

const jsExample = computed(() =>
  `import { createAvatar } from '@dicebear/core';
import * as ${currentStyleCamel.value} from '@dicebear/${currentStyle.value}';

const avatar = createAvatar(${currentStyleCamel.value}, {
  seed: '${seed.value || 'DiceBear'}'
});`
);

const cliExample = computed(() =>
  `npx dicebear ${currentStyle.value} --seed "${seed.value || 'DiceBear'}"`
);

const docsLink = computed(() => {
  switch (activeTab.value) {
    case 'api':
      return '/how-to-use/http-api/';
    case 'js':
      return '/how-to-use/js-library/';
    case 'cli':
      return '/how-to-use/cli/';
    default:
      return '/introduction/';
  }
});

const docsLinkLabel = computed(() => {
  switch (activeTab.value) {
    case 'api':
      return 'Learn more about the HTTP API';
    case 'js':
      return 'Learn more about the JS Library';
    case 'cli':
      return 'Learn more about the CLI';
    default:
      return 'Get started with DiceBear';
  }
});

function onMainAvatarLoad() {
  mainAvatarLoading.value = false;
}

function onAvatarLoad(style: string) {
  loadingAvatars[style] = false;
}

function getAvatarKey(style: string) {
  return `${style}-${seed.value}`;
}

function randomSeed() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  seed.value = result;
}

function resetLoadingStates() {
  mainAvatarLoading.value = true;
  avatarStyleList.value.forEach(style => {
    loadingAvatars[kebabCase(style)] = true;
  });
}

function selectStyle(index: number) {
  mainAvatarLoading.value = true;
  activeStyleIndex.value = index;
}

// Initialize loading states on mount
onMounted(() => {
  resetLoadingStates();
  isMounted.value = true;
});

// Watch for seed changes from input (debounced effect)
let seedTimeout: ReturnType<typeof setTimeout> | null = null;
watch(seed, () => {
  if (seedTimeout) clearTimeout(seedTimeout);
  seedTimeout = setTimeout(() => {
    resetLoadingStates();
  }, 50);
});

function copyCode(tab: string, code: string) {
  navigator.clipboard.writeText(code);
  copiedTab.value = tab;
  setTimeout(() => {
    copiedTab.value = null;
  }, 2000);
}

</script>

<template>
  <UiSection class="seed-demo" :class="{ visible: isVisible }">
    <div class="seed-demo-bg">
      <div class="seed-demo-grid"></div>
      <div class="seed-demo-glow"></div>
    </div>

    <UiContainer class="seed-demo-container">
      <div class="seed-demo-header">
        <UiBadge variant="green">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" /></svg>
          Deterministic Avatars
        </UiBadge>
        <UiHeadline class="seed-demo-title">
          Same Seed, Same Avatar.
          <span class="highlight">Every Time.</span>
        </UiHeadline>
        <UiDescription class="seed-demo-subtitle">
          Use any string as a seed - usernames, emails, IDs - and DiceBear generates the identical avatar consistently.
        </UiDescription>
      </div>

      <div class="seed-demo-content">
        <div class="seed-demo-preview">
          <UiCard flex class="preview-card">
            <div class="preview-main">
              <div class="preview-avatar-wrapper">
                <div v-if="mainAvatarLoading" class="preview-avatar-skeleton"></div>
                <img
                  v-if="isMounted"
                  :src="mainAvatar.src"
                  alt="Main avatar preview"
                  class="preview-avatar"
                  :class="{ loading: mainAvatarLoading }"
                  @load="onMainAvatarLoad"
                />
              </div>
              <div class="preview-info">
                <div class="preview-seed-label">Current Seed</div>
                <div class="preview-seed-value">"{{ seed || 'DiceBear' }}"</div>
                <div class="preview-style-label">Style: {{ currentStyle }}</div>
              </div>
            </div>

            <div class="preview-styles">
              <button
                v-for="(avatar, index) in allAvatars"
                :key="getAvatarKey(avatar.style)"
                class="preview-style-btn"
                :class="{ active: index === activeStyleIndex }"
                @click="selectStyle(index)"
              >
                <div v-if="loadingAvatars[avatar.style] !== false" class="avatar-skeleton"></div>
                <img
                  v-if="isMounted"
                  :src="avatar.src"
                  :alt="avatar.style"
                  :class="{ loading: loadingAvatars[avatar.style] !== false }"
                  @load="onAvatarLoad(avatar.style)"
                />
              </button>
            </div>
          </UiCard>
        </div>

        <div class="seed-demo-controls">
          <UiCard flex class="control-card">
            <div class="control-section">
              <label class="control-label">Enter your seed</label>
              <div class="seed-input-wrapper">
                <input
                  v-model="seed"
                  type="text"
                  class="seed-input"
                  placeholder="Type anything..."
                  spellcheck="false"
                />
                <button class="seed-random-btn" @click="randomSeed" title="Generate random seed">
                  <svg viewBox="0 0 24 24"><path :d="mdiDice5" fill="currentColor" /></svg>
                </button>
              </div>
            </div>

            <div class="control-section code-examples">
              <div class="code-tabs">
                <div class="code-tabs-indicator" :style="{ transform: `translateX(${activeTabIndex * 100}%)` }"></div>
                <button
                  class="code-tab"
                  :class="{ active: activeTab === 'api' }"
                  @click="activeTab = 'api'"
                >
                  HTTP API
                </button>
                <button
                  class="code-tab"
                  :class="{ active: activeTab === 'js' }"
                  @click="activeTab = 'js'"
                >
                  JS Library
                </button>
                <button
                  class="code-tab"
                  :class="{ active: activeTab === 'cli' }"
                  @click="activeTab = 'cli'"
                >
                  CLI
                </button>
              </div>

              <div class="code-content">
                <!-- API Example -->
                <div v-if="activeTab === 'api'" class="code-block">
                  <code class="code-text" v-html="apiExampleHtml"></code>
                  <button
                    class="copy-btn"
                    @click="copyCode('api', apiExample)"
                    :title="copiedTab === 'api' ? 'Copied!' : 'Copy'"
                  >
                    <svg viewBox="0 0 24 24">
                      <path :d="copiedTab === 'api' ? mdiCheck : mdiContentCopy" fill="currentColor" />
                    </svg>
                  </button>
                </div>

                <!-- JS Example -->
                <div v-if="activeTab === 'js'" class="code-block code-block-multi">
                  <pre class="code-text" v-html="jsExampleHtml"></pre>
                  <button
                    class="copy-btn"
                    @click="copyCode('js', jsExample)"
                    :title="copiedTab === 'js' ? 'Copied!' : 'Copy'"
                  >
                    <svg viewBox="0 0 24 24">
                      <path :d="copiedTab === 'js' ? mdiCheck : mdiContentCopy" fill="currentColor" />
                    </svg>
                  </button>
                </div>

                <!-- CLI Example -->
                <div v-if="activeTab === 'cli'" class="code-block">
                  <code class="code-text" v-html="cliExampleHtml"></code>
                  <button
                    class="copy-btn"
                    @click="copyCode('cli', cliExample)"
                    :title="copiedTab === 'cli' ? 'Copied!' : 'Copy'"
                  >
                    <svg viewBox="0 0 24 24">
                      <path :d="copiedTab === 'cli' ? mdiCheck : mdiContentCopy" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="control-cta-wrapper">
              <UiButton :href="docsLink" variant="primary">
                {{ docsLinkLabel }}
                <svg viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
              </UiButton>
            </div>
          </UiCard>
        </div>
      </div>

      <div class="seed-demo-features">
        <div class="feature-item">
          <UiIconBox size="md">
            <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="currentColor" /></svg>
          </UiIconBox>
          <div class="feature-text">
            <strong>No storage needed</strong>
            <span>Generate on-the-fly</span>
          </div>
        </div>
        <div class="feature-item">
          <UiIconBox size="md">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" /></svg>
          </UiIconBox>
          <div class="feature-text">
            <strong>100% consistent</strong>
            <span>Across all platforms</span>
          </div>
        </div>
        <div class="feature-item">
          <UiIconBox size="md">
            <svg viewBox="0 0 24 24"><path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.92 6-4.72 7.28L13 17v5h5l-1.22-1.22C19.91 19.07 22 15.76 22 12c0-5.18-3.95-9.45-9-9.95zM11 2.05c-5.05.5-9 4.77-9 9.95 0 3.76 2.09 7.07 5.22 8.78L6 22h5v-5l-2.28 2.28C6.92 18 5 15.21 5 12c0-4.08 3.05-7.44 7-7.93V2.05z" fill="currentColor" /></svg>
          </UiIconBox>
          <div class="feature-text">
            <strong>Always reproducible</strong>
            <span>Same input, same output</span>
          </div>
        </div>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style scoped>
.seed-demo-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.seed-demo-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--vp-c-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--vp-c-border) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.3;
  mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);
  -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);
}

.seed-demo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 600px;
  background: radial-gradient(ellipse, rgba(22, 137, 204, 0.08) 0%, transparent 70%);
}

.dark .seed-demo-glow {
  background: radial-gradient(ellipse, rgba(22, 137, 204, 0.12) 0%, transparent 70%);
}

.seed-demo-container {
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.seed-demo.visible .seed-demo-container {
  opacity: 1;
  transform: translateY(0);
}

.seed-demo-header {
  text-align: center;
  margin-bottom: 56px;
}


.seed-demo-title {
  font-size: 44px;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.seed-demo-title :deep(.highlight) {
  display: block;
}

.seed-demo-subtitle {
  max-width: 560px;
}

.seed-demo-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 64px;
  align-items: stretch;
}

.seed-demo-preview,
.seed-demo-controls {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Preview Card */

.preview-main {
  display: flex;
  align-items: center;
  gap: 28px;
}

.preview-avatar-wrapper {
  flex-shrink: 0;
}

.preview-avatar {
  width: 140px;
  height: 140px;
  border-radius: 20px;
  background: var(--vp-c-bg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.preview-info {
  flex: 1;
  min-width: 0;
}

.preview-seed-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.preview-seed-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  margin-bottom: 12px;
  word-break: break-all;
}

.preview-style-label {
  font-size: 14px;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.preview-styles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 8px;
}

.preview-style-btn {
  aspect-ratio: 1;
  width: 100%;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 14px;
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.preview-style-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-style-btn:hover {
  border-color: var(--vp-c-border);
  transform: translateY(-2px);
}

.preview-style-btn.active {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

/* Avatar Loading States */
.preview-avatar-wrapper {
  position: relative;
}

.preview-avatar-skeleton {
  position: absolute;
  inset: 0;
  width: 140px;
  height: 140px;
  border-radius: 20px;
  background: linear-gradient(90deg, var(--vp-c-bg-soft) 25%, var(--vp-c-bg) 50%, var(--vp-c-bg-soft) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.preview-avatar.loading {
  opacity: 0;
}

.preview-style-btn {
  position: relative;
}

.avatar-skeleton {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: linear-gradient(90deg, var(--vp-c-bg-soft) 25%, var(--vp-c-bg) 50%, var(--vp-c-bg-soft) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  z-index: 1;
}

.preview-style-btn img.loading {
  opacity: 0;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Control Card */

.control-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.seed-input-wrapper {
  display: flex;
  gap: 10px;
}

.seed-input {
  flex: 1;
  padding: 14px 18px;
  font-size: 16px;
  font-family: var(--vp-font-family-mono);
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-border);
  border-radius: 12px;
  color: var(--vp-c-text-1);
  outline: none;
  transition: all 0.2s ease;
  min-width: 0;
}

.seed-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

.seed-input::placeholder {
  color: var(--vp-c-text-3);
}

.seed-random-btn {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.seed-random-btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.seed-random-btn:active {
  transform: scale(0.95);
}

.seed-random-btn svg {
  width: 24px;
  height: 24px;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
}

.seed-random-btn:hover svg {
  color: var(--vp-c-brand-1);
}

/* Code Examples */
.code-examples {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.code-tabs {
  display: flex;
  position: relative;
  background: var(--vp-c-bg);
  padding: 4px;
  border-radius: 10px;
  margin-bottom: 12px;
}

.code-tabs-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc((100% - 8px) / 3);
  height: calc(100% - 8px);
  background: var(--vp-c-brand-soft);
  border-radius: 8px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.code-tab {
  flex: 1;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: color 0.2s ease;
  position: relative;
  z-index: 1;
}

.code-tab:hover {
  color: var(--vp-c-text-1);
}

.code-tab.active {
  color: var(--vp-c-brand-1);
}

.code-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.code-block {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 14px 16px;
  min-height: 60px;
}

.code-block-multi {
  align-items: flex-start;
}

.code-block .code-text {
  flex: 1;
  font-size: 13px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
  word-break: break-all;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

.code-block pre.code-text {
  white-space: pre;
  overflow-x: auto;
}

.copy-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.copy-btn:hover {
  background: var(--vp-c-brand-soft);
}

.copy-btn svg {
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-2);
}

.copy-btn:hover svg {
  color: var(--vp-c-brand-1);
}

/* Syntax Highlighting */
.code-text :deep(.hl-keyword) {
  color: var(--vp-c-purple-1);
}

.code-text :deep(.hl-string) {
  color: var(--vp-c-green-1);
}

.code-text :deep(.hl-variable) {
  color: var(--vp-c-brand-1);
}

.code-text :deep(.hl-function) {
  color: var(--vp-c-yellow-1);
}

.code-text :deep(.hl-property) {
  color: var(--vp-c-indigo-1);
}

.code-text :deep(.hl-operator) {
  color: var(--vp-c-text-2);
}

.code-text :deep(.hl-url) {
  color: var(--vp-c-text-1);
}

.code-text :deep(.hl-param) {
  color: var(--vp-c-text-2);
}

.code-text :deep(.hl-command) {
  color: var(--vp-c-purple-1);
}

.code-text :deep(.hl-argument) {
  color: var(--vp-c-brand-1);
}

.code-text :deep(.hl-flag) {
  color: var(--vp-c-yellow-1);
}

.control-cta-wrapper {
  margin-top: auto;
}

.control-cta-wrapper :deep(.ui-button) {
  width: 100%;
  justify-content: center;
}

.control-cta-wrapper :deep(.ui-button:hover svg) {
  transform: translateX(4px);
}

/* Features */
.seed-demo-features {
  display: flex;
  justify-content: center;
  gap: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--vp-c-border);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.feature-text strong {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.feature-text span {
  font-size: 13px;
  color: var(--vp-c-text-3);
}

/* Responsive */
@media (max-width: 900px) {
  .seed-demo-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .seed-demo-features {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  .seed-demo-title {
    font-size: 32px;
  }

  .preview-main {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 640px) {
  .seed-demo-title {
    font-size: 28px;
  }




  .preview-avatar {
    width: 120px;
    height: 120px;
  }

  .preview-avatar-skeleton {
    width: 120px;
    height: 120px;
  }

  .preview-seed-value {
    font-size: 20px;
  }

  .preview-styles {
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
    gap: 6px;
  }

  .preview-style-btn {
    border-radius: 10px;
  }

  .seed-demo-features {
    padding: 24px;
    background: var(--vp-c-bg-soft);
    border-radius: 16px;
    border: 1px solid var(--vp-c-border);
    margin-top: -32px;
  }

  .code-tabs {
    flex-wrap: wrap;
  }

  .code-tabs-indicator {
    display: none;
  }

  .code-tab {
    padding: 8px 12px;
    font-size: 12px;
  }

  .code-tab.active {
    background: var(--vp-c-brand-soft);
  }
}
</style>
