<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Copy, Check } from '@lucide/vue';
import { escapeHtml } from '@theme/utils/escape';

type Hljs = typeof import('highlight.js/lib/core').default;

const props = defineProps<{
  lang?: string;
  code: string;
  scrollToBottom?: boolean;
}>();

const preRef = ref<HTMLPreElement>();
const codeHtml = ref(escapeHtml(props.code));
const copied = ref(false);
let timeout: ReturnType<typeof setTimeout> | null = null;
let hljsPromise: Promise<Hljs> | null = null;

function loadHljs(): Promise<Hljs> {
  return (hljsPromise ??= (async () => {
    const [
      { default: core },
      { default: javascript },
      { default: xml },
      { default: php },
    ] = await Promise.all([
      import('highlight.js/lib/core'),
      import('highlight.js/lib/languages/javascript'),
      import('highlight.js/lib/languages/xml'),
      import('highlight.js/lib/languages/php'),
    ]);

    for (const [name, language] of [
      ['js', javascript],
      ['html', xml],
      ['php', php],
    ] as const) {
      core.registerLanguage(name, language);
    }

    return core;
  })());
}

function scrollPreToBottom() {
  if (props.scrollToBottom && preRef.value) {
    preRef.value.scrollTop = preRef.value.scrollHeight;
  }
}

function updateCodeHtml(instance?: Hljs) {
  if (props.lang && instance?.getLanguage(props.lang)) {
    codeHtml.value = instance.highlight(props.code, { language: props.lang }).value;
  } else {
    codeHtml.value = escapeHtml(props.code);
  }
}

function onCopy() {
  navigator.clipboard.writeText(props.code);

  copied.value = true;

  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(() => {
    copied.value = false;
  }, 3000);
}

onBeforeUnmount(() => {
  if (timeout) {
    clearTimeout(timeout);
  }
});

onMounted(async () => {
  if (props.lang) {
    const instance = await loadHljs();
    updateCodeHtml(instance);
  }

  scrollPreToBottom();
});

watch(() => props.code, async () => {
  const instance = props.lang ? await loadHljs() : undefined;
  updateCodeHtml(instance);
  await nextTick();
  scrollPreToBottom();
});
</script>

<template>
  <div class="ui-code">
    <pre ref="preRef" class="ui-code-text" v-html="codeHtml"></pre>
    <button class="ui-code-copy" @click="onCopy" :title="copied ? 'Copied!' : 'Copy'">
      <Check v-if="copied" :size="14" />
      <Copy v-else :size="14" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.ui-code {
  position: relative;
  background: var(--vp-c-bg-soft);
  border-radius: var(--vp-radius-sm);
  padding: 14px 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;

  &-text {
    font-size: 13px;
    font-family: var(--vp-font-family-mono);
    color: var(--vp-c-text-1);
    line-height: 1.6;
    margin: 0;
    padding-right: 32px;
    white-space: pre;
    overflow: auto;
    flex: 1;
    min-height: 0;
  }

  &-copy {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    border-radius: var(--vp-radius-xs);
    cursor: pointer;
    transition: all var(--duration-fast) ease;
    color: var(--ui-c-text-subtle);

    &:hover {
      background: var(--vp-c-brand-soft);
      color: var(--vp-c-brand-1);
      border-color: transparent;
    }
  }
}
</style>

<style>
.ui-code-text .hljs-keyword { color: var(--vp-c-purple-1); }
.ui-code-text .hljs-string { color: var(--vp-c-green-1); }
.ui-code-text .hljs-title { color: var(--vp-c-yellow-1); }
.ui-code-text .hljs-attr { color: var(--vp-c-indigo-1); }
.ui-code-text .hljs-name { color: var(--vp-c-brand-1); }
.ui-code-text .hljs-tag { color: var(--vp-c-text-2); }
.ui-code-text .hljs-number { color: var(--vp-c-green-1); }
.ui-code-text .hljs-literal { color: var(--vp-c-brand-1); }
.ui-code-text .hljs-built_in { color: var(--vp-c-yellow-1); }
.ui-code-text .hljs-params { color: var(--vp-c-text-1); }
.ui-code-text .hljs-comment { color: var(--vp-c-text-3); }
.ui-code-text .hljs-meta { color: var(--vp-c-text-3); }
</style>
