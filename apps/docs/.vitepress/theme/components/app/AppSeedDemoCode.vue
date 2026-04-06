<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowRight } from '@lucide/vue';
import { UiButton, UiCode } from '../ui';
import { escapeJsString, escapeShellArg } from '../../utils/escape';

const props = defineProps<{
  seed: string;
  style: string;
  styleCamel: string;
}>();

const activeTab = ref<'api' | 'js' | 'cli'>('api');
const tabs = ['api', 'js', 'cli'] as const;
const activeTabIndex = computed(() => tabs.indexOf(activeTab.value));

const apiExample = computed(() =>
  `https://api.dicebear.com/10.x/${props.style}/svg?seed=${encodeURIComponent(props.seed)}`
);

const jsExample = computed(() =>
  `import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/definitions/${props.style}.json';

const style = new Style(definition);
const avatar = new Avatar(style, {
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
        <UiCode v-if="activeTab === 'api'" :code="apiExample" class="app-seed-demo-code-block" />
        <UiCode v-if="activeTab === 'js'" :code="jsExample" lang="js" class="app-seed-demo-code-block" />
        <UiCode v-if="activeTab === 'cli'" :code="cliExample" class="app-seed-demo-code-block" />
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
  min-width: 0;

  &-wrapper {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
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
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &-block {
    flex: 1;
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
