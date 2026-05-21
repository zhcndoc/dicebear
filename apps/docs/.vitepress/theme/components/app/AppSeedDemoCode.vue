<script setup lang="ts">
import { computed, ref } from 'vue';
import { Play } from '@lucide/vue';
import SelectButton from 'primevue/selectbutton';
import { UiButton, UiCode } from '../ui';
import { escapeJsString, escapeShellArg } from '../../utils/escape';

type CodeTab = 'api' | 'js' | 'php' | 'cli';

const props = defineProps<{
  seed: string;
  style: string;
  styleCamel: string;
}>();

const activeTab = ref<CodeTab>('api');
const tabOptions: { label: string; value: CodeTab }[] = [
  { label: 'HTTP API', value: 'api' },
  { label: 'JS Library', value: 'js' },
  { label: 'PHP Library', value: 'php' },
  { label: 'CLI', value: 'cli' },
];

const apiExample = computed(
  () =>
    `https://api.dicebear.com/10.x/${props.style}/svg?seed=${encodeURIComponent(props.seed)}`,
);

const jsExample = computed(
  () =>
    `import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/styles/${props.style}.json';

const style = new Style(definition);
const avatar = new Avatar(style, {
  seed: '${escapeJsString(props.seed)}'
});`,
);

const phpExample = computed(
  () =>
    `<?php

use Composer\\InstalledVersions;
use DiceBear\\Style;
use DiceBear\\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$definition = json_decode(file_get_contents($basePath . '/src/${props.style}.json'), true);

$style = new Style($definition);
$avatar = new Avatar($style, [
  'seed' => '${escapeJsString(props.seed)}'
]);`,
);

const cliExample = computed(
  () => `npx dicebear ${props.style} --seed '${escapeShellArg(props.seed)}'`,
);

const playgroundLink = '/playground/';
</script>

<template>
  <div class="app-seed-demo-code">
    <div class="app-seed-demo-code-wrapper">
      <SelectButton
        v-model="activeTab"
        :options="tabOptions"
        option-label="label"
        option-value="value"
        :allow-empty="false"
        size="small"
        aria-label="Code example"
        class="app-seed-demo-code-tabs"
      />

      <div class="app-seed-demo-code-body">
        <UiCode
          :code="apiExample"
          scroll-to-bottom
          class="app-seed-demo-code-block"
          :class="{ active: activeTab === 'api' }"
        />
        <UiCode
          :code="jsExample"
          lang="js"
          scroll-to-bottom
          class="app-seed-demo-code-block"
          :class="{ active: activeTab === 'js' }"
        />
        <UiCode
          :code="phpExample"
          lang="php"
          scroll-to-bottom
          class="app-seed-demo-code-block"
          :class="{ active: activeTab === 'php' }"
        />
        <UiCode
          :code="cliExample"
          scroll-to-bottom
          class="app-seed-demo-code-block"
          :class="{ active: activeTab === 'cli' }"
        />
      </div>
    </div>

    <div class="app-seed-demo-code-cta">
      <UiButton
        :href="playgroundLink"
        variant="primary"
        class="app-seed-demo-code-cta-btn"
      >
        <Play :size="20" />
        Open Playground
      </UiButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-seed-demo-code {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--ui-window-divider-color);
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
    width: 100%;

    :deep(.p-togglebutton) {
      flex: 1;
    }
  }

  &-body {
    flex: 1;
    display: grid;
    min-width: 0;
  }

  &-block {
    grid-area: 1 / 1;
    visibility: hidden;

    &.active {
      visibility: visible;
    }
  }

  &-cta {
    padding: 0 16px 16px;

    &-btn {
      width: 100%;
      justify-content: center;
      font-size: 13px;
    }
  }
}

@media (max-width: 768px) {
  .app-seed-demo-code {
    border-left: none;
    border-top: 1px solid var(--ui-window-divider-color);
  }
}
</style>
