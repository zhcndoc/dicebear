<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowRight, Copy, Check } from 'lucide-vue-next';
import { UiButton } from '../ui';
import { useCopyToClipboard } from '../../composables/useCopyToClipboard';
import { escapeHtml, escapeJsString, escapeShellArg } from '../../utils/escape';

const props = defineProps<{
  seed: string;
  style: string;
  styleCamel: string;
}>();

const { copy: copyCode, isCopied } = useCopyToClipboard();

const activeTab = ref<'api' | 'js' | 'cli'>('api');
const tabs = ['api', 'js', 'cli'] as const;
const activeTabIndex = computed(() => tabs.indexOf(activeTab.value));

// HTML-rendered code (with syntax highlighting spans)
const apiExampleHtml = computed(() => {
  const seedVal = escapeHtml(encodeURIComponent(props.seed));
  return `<span class="hl-url">https://api.dicebear.com/9.x/${props.style}/svg</span><span class="hl-param">?seed=</span><span class="hl-string">${seedVal}</span>`;
});

const jsExampleHtml = computed(() => {
  const seedVal = escapeHtml(escapeJsString(props.seed));
  return `<span class="hl-keyword">import</span> { <span class="hl-variable">createAvatar</span> } <span class="hl-keyword">from</span> <span class="hl-string">'@dicebear/core'</span>;
<span class="hl-keyword">import</span> <span class="hl-operator">*</span> <span class="hl-keyword">as</span> <span class="hl-variable">${props.styleCamel}</span> <span class="hl-keyword">from</span> <span class="hl-string">'@dicebear/${props.style}'</span>;

<span class="hl-keyword">const</span> <span class="hl-variable">avatar</span> <span class="hl-operator">=</span> <span class="hl-function">createAvatar</span>(<span class="hl-variable">${props.styleCamel}</span>, {
  <span class="hl-property">seed</span>: <span class="hl-string">'${seedVal}'</span>
});`;
});

const cliExampleHtml = computed(() => {
  const seedVal = escapeHtml(escapeShellArg(props.seed));
  return `<span class="hl-command">npx</span> <span class="hl-argument">dicebear</span> <span class="hl-variable">${props.style}</span> <span class="hl-flag">--seed</span> <span class="hl-string">'${seedVal}'</span>`;
});

// Plain text code (for clipboard)
const apiExample = computed(() =>
  `https://api.dicebear.com/9.x/${props.style}/svg?seed=${encodeURIComponent(props.seed)}`
);

const jsExample = computed(() =>
  `import { createAvatar } from '@dicebear/core';
import * as ${props.styleCamel} from '@dicebear/${props.style}';

const avatar = createAvatar(${props.styleCamel}, {
  seed: '${escapeJsString(props.seed)}'
});`
);

const cliExample = computed(() =>
  `npx dicebear ${props.style} --seed '${escapeShellArg(props.seed)}'`
);

const docsLink = computed(() => {
  switch (activeTab.value) {
    case 'api': return '/how-to-use/http-api/';
    case 'js': return '/how-to-use/js-library/';
    case 'cli': return '/how-to-use/cli/';
    default: return '/introduction/';
  }
});

const docsLinkLabel = computed(() => {
  switch (activeTab.value) {
    case 'api': return 'Learn more about the HTTP API';
    case 'js': return 'Learn more about the JS Library';
    case 'cli': return 'Learn more about the CLI';
    default: return 'Get started with DiceBear';
  }
});

function getPlainCode() {
  switch (activeTab.value) {
    case 'api': return apiExample.value;
    case 'js': return jsExample.value;
    case 'cli': return cliExample.value;
  }
}
</script>

<template>
  <div class="app-seed-demo-code">
    <div class="app-seed-demo-code-wrapper">
      <div class="app-seed-demo-code-tabs">
        <div class="app-seed-demo-code-tabs-indicator" :style="{ transform: `translateX(${activeTabIndex * 100}%)` }"></div>
        <button
          v-for="tab in tabs"
          :key="tab"
          class="app-seed-demo-code-tab"
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
        >
          {{ tab === 'api' ? 'HTTP API' : tab === 'js' ? 'JS Library' : 'CLI' }}
        </button>
      </div>

      <div class="app-seed-demo-code-body">
        <div v-if="activeTab === 'api'" class="app-seed-demo-code-block">
          <code class="app-seed-demo-code-text" v-html="apiExampleHtml"></code>
        </div>
        <div v-if="activeTab === 'js'" class="app-seed-demo-code-block app-seed-demo-code-block-multi">
          <pre class="app-seed-demo-code-text" v-html="jsExampleHtml"></pre>
        </div>
        <div v-if="activeTab === 'cli'" class="app-seed-demo-code-block">
          <code class="app-seed-demo-code-text" v-html="cliExampleHtml"></code>
        </div>
        <button
          class="app-seed-demo-code-copy-btn"
          @click="copyCode(activeTab, getPlainCode())"
          :title="isCopied(activeTab) ? 'Copied!' : 'Copy'"
        >
          <Check v-if="isCopied(activeTab)" :size="14" />
          <Copy v-else :size="14" />
        </button>
      </div>
    </div>

    <div class="app-seed-demo-code-cta">
      <UiButton :href="docsLink" variant="primary" class="app-seed-demo-code-cta-btn">
        {{ docsLinkLabel }}
        <ArrowRight :size="20" />
      </UiButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-seed-demo-code {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--vp-c-border);

  &-wrapper {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &-tabs {
    display: flex;
    position: relative;
    background: var(--vp-c-bg-soft);
    padding: 4px;
    border-radius: 10px;

    &-indicator {
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
  }

  &-tab {
    flex: 1;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 600;
    background: transparent;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    color: var(--vp-c-text-2);
    transition: color 0.2s ease;
    position: relative;
    z-index: 1;
    white-space: nowrap;

    &:hover {
      color: var(--vp-c-text-1);
    }

    &.active {
      color: var(--vp-c-brand-1);
    }
  }

  &-body {
    flex: 1;
    position: relative;
    padding: 14px 16px;
    overflow: auto;
    background: var(--vp-c-bg-soft);
    border-radius: 10px;
  }

  &-block {
    padding-right: 32px;

    &-multi {
      /* multi-line variant */
    }

    .app-seed-demo-code-text {
      font-size: 12.5px;
      font-family: var(--vp-font-family-mono);
      color: var(--vp-c-text-1);
      word-break: break-all;
      line-height: 1.7;
      margin: 0;
      white-space: pre-wrap;
    }

    pre.app-seed-demo-code-text {
      white-space: pre;
      overflow-x: auto;
    }
  }

  &-copy-btn {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--vp-c-text-3);

    &:hover {
      background: var(--vp-c-brand-soft);
      color: var(--vp-c-brand-1);
      border-color: transparent;
    }
  }

  &-cta {
    padding: 0 16px 16px;

    &-btn {
      width: 100%;
      justify-content: center;
      font-size: 13px;

      &:hover svg {
        transform: translateX(4px);
      }
    }
  }
}

@media (max-width: 768px) {
  .app-seed-demo-code {
    border-left: none;
    border-top: 1px solid var(--vp-c-border);
  }
}

@media (max-width: 480px) {
  .app-seed-demo-code {
    &-tabs-indicator {
      display: none;
    }

    &-tab.active {
      background: var(--vp-c-brand-soft);
    }
  }
}
</style>

<style>
.app-seed-demo-code-text .hl-keyword { color: var(--vp-c-purple-1); }
.app-seed-demo-code-text .hl-string { color: var(--vp-c-green-1); }
.app-seed-demo-code-text .hl-variable { color: var(--vp-c-brand-1); }
.app-seed-demo-code-text .hl-function { color: var(--vp-c-yellow-1); }
.app-seed-demo-code-text .hl-property { color: var(--vp-c-indigo-1); }
.app-seed-demo-code-text .hl-operator { color: var(--vp-c-text-2); }
.app-seed-demo-code-text .hl-url { color: var(--vp-c-text-1); }
.app-seed-demo-code-text .hl-param { color: var(--vp-c-text-2); }
.app-seed-demo-code-text .hl-command { color: var(--vp-c-purple-1); }
.app-seed-demo-code-text .hl-argument { color: var(--vp-c-brand-1); }
.app-seed-demo-code-text .hl-flag { color: var(--vp-c-yellow-1); }
</style>
