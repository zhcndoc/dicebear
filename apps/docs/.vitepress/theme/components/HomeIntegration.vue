<script setup lang="ts">
import { ref } from 'vue';
import { mdiWeb, mdiCodeTags, mdiConsole } from '@mdi/js';

const activeTab = ref<'api' | 'library' | 'cli'>('api');
</script>

<template>
  <section class="integration">
    <div class="integration-container">
      <div class="integration-content">
        <span class="integration-badge">Get Started in Seconds</span>
        <h2 class="integration-title">Simple Integration, <span class="highlight">Powerful</span> Results</h2>
        <p class="integration-description">
          Use our free HTTP API for instant integration, install the JavaScript library
          for full control, or use the CLI for batch generation. Works with React, Vue, Svelte, Angular, and any framework.
        </p>

        <div class="integration-tabs">
          <button
            :class="['integration-tab', { active: activeTab === 'api' }]"
            @click="activeTab = 'api'"
          >
            <svg viewBox="0 0 24 24"><path :d="mdiWeb" fill="currentColor" /></svg>
            HTTP API
          </button>
          <button
            :class="['integration-tab', { active: activeTab === 'library' }]"
            @click="activeTab = 'library'"
          >
            <svg viewBox="0 0 24 24"><path :d="mdiCodeTags" fill="currentColor" /></svg>
            JS Library
          </button>
          <button
            :class="['integration-tab', { active: activeTab === 'cli' }]"
            @click="activeTab = 'cli'"
          >
            <svg viewBox="0 0 24 24"><path :d="mdiConsole" fill="currentColor" /></svg>
            CLI
          </button>
        </div>

        <div class="integration-actions">
          <a
            v-if="activeTab === 'api'"
            href="/how-to-use/http-api/"
            class="integration-button primary"
          >
            API Documentation
          </a>
          <a
            v-else-if="activeTab === 'library'"
            href="/how-to-use/js-library/"
            class="integration-button primary"
          >
            Library Documentation
          </a>
          <a
            v-else
            href="/how-to-use/cli/"
            class="integration-button primary"
          >
            CLI Documentation
          </a>
          <a href="/playground/" class="integration-button secondary">
            Try Playground
          </a>
        </div>
      </div>

      <div class="integration-code">
        <div class="code-window">
          <div class="code-header">
            <div class="code-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span class="code-filename">
              {{ activeTab === 'api' ? 'index.html' : activeTab === 'library' ? 'avatar.js' : 'terminal' }}
            </span>
          </div>

          <!-- HTTP API Example -->
          <pre v-if="activeTab === 'api'" class="code-content"><code><span class="code-comment">&lt;!-- Just use an image tag! --&gt;</span>
<span class="code-tag">&lt;img</span>
  <span class="code-attr">src</span>=<span class="code-string">"https://api.dicebear.com/9.x/lorelei/svg?seed=Felix"</span>
  <span class="code-attr">alt</span>=<span class="code-string">"Avatar"</span>
<span class="code-tag">/&gt;</span>

<span class="code-comment">&lt;!-- PNG with custom size --&gt;</span>
<span class="code-tag">&lt;img</span>
  <span class="code-attr">src</span>=<span class="code-string">"https://api.dicebear.com/9.x/avataaars/png?seed=Emma&amp;size=128"</span>
  <span class="code-attr">alt</span>=<span class="code-string">"Avatar"</span>
<span class="code-tag">/&gt;</span></code></pre>

          <!-- JS Library Example -->
          <pre v-else-if="activeTab === 'library'" class="code-content"><code><span class="code-keyword">import</span> { createAvatar } <span class="code-keyword">from</span> <span class="code-string">'@dicebear/core'</span>;
<span class="code-keyword">import</span> { lorelei } <span class="code-keyword">from</span> <span class="code-string">'@dicebear/collection'</span>;

<span class="code-keyword">const</span> avatar = <span class="code-function">createAvatar</span>(lorelei, {
  <span class="code-attr">seed</span>: <span class="code-string">'Felix'</span>,
  <span class="code-attr">backgroundColor</span>: [<span class="code-string">'b6e3f4'</span>],
  <span class="code-comment">// ... other options</span>
});

<span class="code-comment">// Get SVG string</span>
<span class="code-keyword">const</span> svg = avatar.<span class="code-function">toString</span>();

<span class="code-comment">// Or as data URI for img src</span>
<span class="code-keyword">const</span> dataUri = avatar.<span class="code-function">toDataUri</span>();</code></pre>

          <!-- CLI Example -->
          <pre v-else class="code-content"><code><span class="code-comment"># Install globally</span>
<span class="code-function">npm</span> install -g dicebear

<span class="code-comment"># Generate a single avatar</span>
<span class="code-function">dicebear</span> lorelei --seed Felix --output avatar.svg

<span class="code-comment"># Generate multiple avatars</span>
<span class="code-function">dicebear</span> avataaars --count 10 --output avatars/

<span class="code-comment"># Use different format</span>
<span class="code-function">dicebear</span> bottts --seed Bot1 --format png --size 256</code></pre>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.integration {
  padding: 80px 24px;
  background: linear-gradient(180deg, var(--vp-c-bg) 0%, var(--vp-c-bg-soft) 100%);
}

.integration-container {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.integration-badge {
  display: inline-block;
  padding: 6px 14px;
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green-1);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}

.integration-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 16px;
  line-height: 1.2;
}

.integration-title .highlight {
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-purple-1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.integration-description {
  font-size: 17px;
  color: var(--vp-c-text-2);
  margin: 0 0 32px;
  line-height: 1.7;
}

.integration-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.integration-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-border);
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.integration-tab svg {
  width: 18px;
  height: 18px;
}

.integration-tab:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.integration-tab.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.integration-actions {
  display: flex;
  gap: 12px;
}

.integration-button {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.integration-button::after {
  display: none !important;
}

.integration-button.primary {
  background: var(--vp-c-brand-3);
  color: var(--vp-c-white);
}

.integration-button.primary:hover {
  background: var(--vp-c-brand-2);
}

.integration-button.secondary {
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
}

.integration-button.secondary:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.integration-code {
  min-width: 0;
}

.code-window {
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--vp-shadow-4);
}

.code-content {
  min-height: 280px;
}

.code-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  background: #252525;
  border-bottom: 1px solid #333;
}

.code-dots {
  display: flex;
  gap: 8px;
}

.code-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.code-dots span:nth-child(1) {
  background: #ff5f57;
}

.code-dots span:nth-child(2) {
  background: #febc2e;
}

.code-dots span:nth-child(3) {
  background: #28c840;
}

.code-filename {
  font-size: 13px;
  color: #888;
  font-family: var(--vp-font-family-mono);
}

.code-content {
  margin: 0;
  padding: 24px;
  overflow-x: auto;
  font-size: 14px;
  line-height: 1.7;
}

.code-content code {
  font-family: var(--vp-font-family-mono);
  color: #e0e0e0;
  white-space: pre;
}

/* Syntax highlighting */
.code-keyword {
  color: #c678dd;
}

.code-string {
  color: #98c379;
}

.code-comment {
  color: #5c6370;
  font-style: italic;
}

.code-function {
  color: #61afef;
}

.code-attr {
  color: #e5c07b;
}

.code-tag {
  color: #e06c75;
}

@media (max-width: 900px) {
  .integration-container {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .integration-code {
    order: -1;
  }
}

@media (max-width: 640px) {
  .integration {
    padding: 60px 16px;
  }

  .integration-title {
    font-size: 24px;
  }

  .integration-tabs {
    flex-direction: column;
  }

  .integration-actions {
    flex-direction: column;
  }

  .integration-button {
    justify-content: center;
  }

  .code-content {
    padding: 16px;
    font-size: 12px;
  }
}
</style>
