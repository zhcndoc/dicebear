<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, computed } from 'vue';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import { Copy, Check } from 'lucide-vue-next';

const props = defineProps<{
  lang?: string;
  code: string;
}>();

const codeHtml = ref(props.code);
const copied = ref(false);
let timeout: any = null;

const isMultiline = computed(() => props.code.includes('\n'));

function updateCodeHtml() {
  if (props.lang && hljs.getLanguage(props.lang)) {
    codeHtml.value =
      hljs.highlight(props.code, {
        language: props.lang,
      }).value ?? '';
  } else {
    codeHtml.value = props.code;
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

onMounted(() => {
  hljs.getLanguage('js') || hljs.registerLanguage('js', javascript);
  hljs.getLanguage('html') || hljs.registerLanguage('html', xml);

  updateCodeHtml();
});

watch(() => props.code, updateCodeHtml);
</script>

<template>
  <div class="ui-code">
    <pre v-if="isMultiline" class="ui-code-text" v-html="codeHtml"></pre>
    <pre v-else class="ui-code-text" v-html="codeHtml"></pre>
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
  border-radius: 12px;
  padding: 14px 16px;

  &-text {
    font-size: 13px;
    font-family: var(--vp-font-family-mono);
    color: var(--vp-c-text-1);
    line-height: 1.6;
    margin: 0;
    padding-right: 32px;
    white-space: pre;
    overflow-x: auto;
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
