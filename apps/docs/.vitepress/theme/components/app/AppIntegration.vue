<script setup lang="ts">
import { ref } from 'vue';
import { Globe, Code, Terminal, Copy, Check } from 'lucide-vue-next';
import { UiContainer, UiSection, UiSectionHeader, UiCard, UiIconBox } from '../ui';
import { useVisibility } from '../../composables/useVisibility';
import { useCopyToClipboard } from '../../composables/useCopyToClipboard';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });
const { copy: copyCode, isCopied } = useCopyToClipboard();

const plainCode = {
  js: `import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const svg = createAvatar(lorelei, {
  seed: 'Mia',
}).toString();`,
  api: `https://api.dicebear.com/9.x/lorelei/svg?seed=Mia`,
  cli: `npx dicebear lorelei --seed "Mia" --format svg`,
};
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-integration-dots"></div>
      <div class="app-integration-gradient"></div>
    </template>
    <UiContainer>
      <UiSectionHeader
        class="app-integration-header"
        badge="Easy to Use"
        headline="Integrate in <strong>Minutes</strong>"
        description="Choose the integration that works best for your project."
      />

      <!-- JS Library - Featured / Full Width -->
      <div class="app-integration-featured app-integration-item" :style="{ animationDelay: '0s' }">
        <UiCard padding="lg" radius="md" class="app-integration-card app-integration-card-featured">
          <div class="app-integration-featured-layout">
            <div class="app-integration-card-header">
              <UiIconBox size="lg" color="#1689cc">
                <Code />
              </UiIconBox>
              <h3 class="app-integration-title">JS Library</h3>
              <p class="app-integration-description">No data sent externally. Full control over your avatar generator with a simple API.</p>
              <a href="/how-to-use/js-library/" class="app-integration-link">
                Library Documentation &rarr;
              </a>
            </div>

            <div class="app-integration-code-block app-integration-code-block-multi">
              <pre class="app-integration-code-text"><span class="hl-keyword">import</span> { <span class="hl-variable">createAvatar</span> } <span class="hl-keyword">from</span> <span class="hl-string">'@dicebear/core'</span>;
<span class="hl-keyword">import</span> { <span class="hl-variable">lorelei</span> } <span class="hl-keyword">from</span> <span class="hl-string">'@dicebear/collection'</span>;

<span class="hl-keyword">const</span> <span class="hl-variable">svg</span> <span class="hl-operator">=</span> <span class="hl-function">createAvatar</span>(<span class="hl-variable">lorelei</span>, {
  <span class="hl-property">seed</span>: <span class="hl-string">'Mia'</span>,
}).<span class="hl-function">toString</span>();</pre>
              <button class="app-integration-copy-btn" @click="copyCode('js', plainCode.js)" :title="isCopied('js') ? 'Copied!' : 'Copy'">
                <Check v-if="isCopied('js')" />
                <Copy v-else />
              </button>
            </div>
          </div>
        </UiCard>
      </div>

      <!-- HTTP API & CLI - Side by Side -->
      <div class="app-integration-grid">
        <div class="app-integration-item" :style="{ animationDelay: '0.15s' }">
          <UiCard padding="lg" radius="md" class="app-integration-card">
            <div class="app-integration-card-header">
              <UiIconBox size="lg" color="#22c55e">
                <Globe />
              </UiIconBox>
              <h3 class="app-integration-title">Avatar API</h3>
              <p class="app-integration-description">Free avatar API for profile pictures. Handles millions of requests daily via global CDN.</p>
            </div>

            <div class="app-integration-code-block">
              <code class="app-integration-code-text"><span class="hl-url">https://api.dicebear.com/9.x/lorelei/svg</span><span class="hl-operator">?</span><span class="hl-flag">seed</span><span class="hl-operator">=</span><span class="hl-string">Mia</span></code>
              <button class="app-integration-copy-btn" @click="copyCode('api', plainCode.api)" :title="isCopied('api') ? 'Copied!' : 'Copy'">
                <Check v-if="isCopied('api')" />
                <Copy v-else />
              </button>
            </div>

            <a href="/how-to-use/http-api/" class="app-integration-link">
              API Documentation &rarr;
            </a>
          </UiCard>
        </div>

        <div class="app-integration-item" :style="{ animationDelay: '0.3s' }">
          <UiCard padding="lg" radius="md" class="app-integration-card">
            <div class="app-integration-card-header">
              <UiIconBox size="lg" color="#a855f7">
                <Terminal />
              </UiIconBox>
              <h3 class="app-integration-title">CLI</h3>
              <p class="app-integration-description">Generate avatars from the command line. Perfect for scripts and automation.</p>
            </div>

            <div class="app-integration-code-block app-integration-code-block-multi">
              <pre class="app-integration-code-text"><span class="hl-command">npx</span> <span class="hl-variable">dicebear</span> <span class="hl-variable">lorelei</span> <span class="hl-flag">--seed</span> <span class="hl-string">"Mia"</span> <span class="hl-flag">--format</span> <span class="hl-string">svg</span></pre>
              <button class="app-integration-copy-btn" @click="copyCode('cli', plainCode.cli)" :title="isCopied('cli') ? 'Copied!' : 'Copy'">
                <Check v-if="isCopied('cli')" />
                <Copy v-else />
              </button>
            </div>

            <a href="/how-to-use/cli/" class="app-integration-link">
              CLI Documentation &rarr;
            </a>
          </UiCard>
        </div>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-integration {
  &-dots {
    background-image: radial-gradient(circle, var(--vp-c-text-3) 1px, transparent 1px);
    background-size: 32px 32px;
    background-repeat: repeat !important;
    opacity: 0.2;
    mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);
    -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);
  }

  &-gradient {
    background: radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent), transparent);
  }

  &-header {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-item {
    opacity: 0;
    transform: translateY(30px);

    .visible & {
      animation: app-integration-card-reveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
  }

  /* Syntax highlighting */
  &-code-text {
    .hl-keyword { color: var(--vp-c-purple-1); }
    .hl-string { color: var(--vp-c-green-1); }
    .hl-variable { color: var(--vp-c-brand-1); }
    .hl-function { color: var(--vp-c-yellow-1); }
    .hl-property { color: var(--vp-c-indigo-1); }
    .hl-operator { color: var(--vp-c-text-2); }
    .hl-url { color: var(--vp-c-text-1); }
    .hl-param { color: var(--vp-c-text-2); }
    .hl-command { color: var(--vp-c-purple-1); }
    .hl-argument { color: var(--vp-c-brand-1); }
    .hl-flag { color: var(--vp-c-yellow-1); }
  }

  /* Featured JS Library card */
  &-featured {
    margin-bottom: 24px;

    &-layout {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 32px;
      align-items: center;
    }
  }

  &-card-featured {
    .app-integration-card-header {
      margin-bottom: 0;
    }

    .app-integration-code-block {
      margin-bottom: 0;
    }

    .app-integration-link {
      display: inline-block;
      margin-top: 24px;
    }
  }

  /* Grid for HTTP API & CLI */
  &-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  &-card {
    display: flex;
    flex-direction: column;
    height: 100%;

    &-header {
      margin-bottom: 24px;
    }
  }

  &-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--vp-c-text-1);
    margin: 16px 0 8px;
  }

  &-description {
    font-size: 15px;
    color: var(--vp-c-text-2);
    margin: 0;
    line-height: 1.6;
  }

  /* Code blocks */
  &-code-block {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: var(--vp-c-bg-soft);
    border-radius: 12px;
    padding: 14px 16px;
    flex: 1;
    margin-bottom: 20px;
    min-height: 48px;

    &-multi {
      align-items: flex-start;
    }
  }

  &-code-text {
    flex: 1;
    font-size: 13px;
    font-family: var(--vp-font-family-mono);
    color: var(--vp-c-text-1);
    word-break: break-all;
    line-height: 1.6;
    margin: 0;
    white-space: pre-wrap;
  }

  pre#{&}-code-text {
    white-space: pre;
    overflow-x: auto;
  }

  /* Copy button */
  &-copy-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vp-c-bg);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      background: var(--vp-c-brand-soft);

      svg {
        color: var(--vp-c-brand-1);
      }
    }

    svg {
      width: 16px;
      height: 16px;
      color: var(--vp-c-text-2);
    }
  }

  &-link {
    font-size: 14px;
    font-weight: 600;
    color: var(--vp-c-brand-1);
    text-decoration: none;
    transition: color 0.2s ease;

    &::after {
      display: none !important;
    }

    &:hover {
      color: var(--vp-c-brand-2);
    }
  }
}

@keyframes app-integration-card-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1000px) {
  .app-integration {
    &-featured-layout {
      grid-template-columns: 1fr;
    }

    &-grid {
      grid-template-columns: 1fr;
      max-width: 500px;
      margin: 0 auto;
    }

    &-featured {
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 24px;
    }
  }
}
</style>
