<script setup lang="ts">
import { ref, computed } from 'vue';
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
import UiCard from './UiCard.vue';
import { useVisibility } from '../composables/useVisibility';

const { theme } = useData<ThemeOptions>();

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJsString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

function escapeShellArg(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\$/g, '\\$')
    .replace(/`/g, '\\`');
}

const seed = ref('Felix');
const isVisible = useVisibility('.seed-demo');
const copiedTab = ref<string | null>(null);
const activeStyleIndex = ref(0);
const activeTab = ref<'api' | 'js' | 'cli'>('api');
const tabs = ['api', 'js', 'cli'] as const;
const activeTabIndex = computed(() => tabs.indexOf(activeTab.value));

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
  const seedVal = escapeHtml(encodeURIComponent(seed.value || 'DiceBear'));
  return `<span class="hl-url">https://api.dicebear.com/9.x/${currentStyle.value}/svg</span><span class="hl-param">?seed=</span><span class="hl-string">${seedVal}</span>`;
});

const jsExampleHtml = computed(() => {
  const seedVal = escapeHtml(escapeJsString(seed.value || 'DiceBear'));
  return `<span class="hl-keyword">import</span> { <span class="hl-variable">createAvatar</span> } <span class="hl-keyword">from</span> <span class="hl-string">'@dicebear/core'</span>;
<span class="hl-keyword">import</span> <span class="hl-operator">*</span> <span class="hl-keyword">as</span> <span class="hl-variable">${currentStyleCamel.value}</span> <span class="hl-keyword">from</span> <span class="hl-string">'@dicebear/${currentStyle.value}'</span>;

<span class="hl-keyword">const</span> <span class="hl-variable">avatar</span> <span class="hl-operator">=</span> <span class="hl-function">createAvatar</span>(<span class="hl-variable">${currentStyleCamel.value}</span>, {
  <span class="hl-property">seed</span>: <span class="hl-string">'${seedVal}'</span>
});`;
});

const cliExampleHtml = computed(() => {
  const seedVal = escapeHtml(escapeShellArg(seed.value || 'DiceBear'));
  return `<span class="hl-command">npx</span> <span class="hl-argument">dicebear</span> <span class="hl-variable">${currentStyle.value}</span> <span class="hl-flag">--seed</span> <span class="hl-string">"${seedVal}"</span>`;
});

// Plain text for copy
const apiExample = computed(() =>
  `https://api.dicebear.com/9.x/${currentStyle.value}/svg?seed=${encodeURIComponent(seed.value || 'DiceBear')}`
);

const jsExample = computed(() =>
  `import { createAvatar } from '@dicebear/core';
import * as ${currentStyleCamel.value} from '@dicebear/${currentStyle.value}';

const avatar = createAvatar(${currentStyleCamel.value}, {
  seed: '${escapeJsString(seed.value || 'DiceBear')}'
});`
);

const cliExample = computed(() =>
  `npx dicebear ${currentStyle.value} --seed "${escapeShellArg(seed.value || 'DiceBear')}"`
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

function selectStyle(index: number) {
  activeStyleIndex.value = index;
}

function copyCode(tab: string, code: string) {
  navigator.clipboard.writeText(code);
  copiedTab.value = tab;
  setTimeout(() => {
    copiedTab.value = null;
  }, 2000);
}

</script>

<template>
  <UiSection class="seed-demo" :class="{ visible: isVisible }" divider>
    <div class="seed-demo-bg">
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
                <img
                  :src="mainAvatar.src"
                  alt="Main avatar preview"
                  class="preview-avatar"
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
                <img :src="avatar.src" :alt="avatar.style" />
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

    </UiContainer>
  </UiSection>
</template>

<style scoped>
.seed-demo-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.seed-demo-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 20% 30%, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent), transparent),
    radial-gradient(ellipse 80% 50% at 80% 70%, color-mix(in srgb, var(--vp-c-green-1) 6%, transparent), transparent);
}

.dark .seed-demo-glow {
  background:
    radial-gradient(ellipse 80% 50% at 20% 30%, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent), transparent),
    radial-gradient(ellipse 80% 50% at 80% 70%, color-mix(in srgb, var(--vp-c-green-1) 6%, transparent), transparent);
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
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.dark .preview-style-btn {
  border-color: rgba(255, 255, 255, 0.06);
}

.preview-style-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-style-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 0, 0, 0.12);
}

.dark .preview-style-btn:hover {
  border-color: var(--vp-c-border);
}

.preview-style-btn.active {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
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
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  color: var(--vp-c-text-1);
  outline: none;
  transition: all 0.2s ease;
  min-width: 0;
}

.dark .seed-input {
  border-color: rgba(255, 255, 255, 0.1);
}

.seed-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
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
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.dark .seed-random-btn {
  border-color: rgba(255, 255, 255, 0.1);
}

.seed-random-btn:hover {
  background: var(--vp-c-brand-soft);
  border-color: transparent;
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


/* Responsive */
@media (max-width: 900px) {
  .seed-demo-content {
    grid-template-columns: 1fr;
    gap: 24px;
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
