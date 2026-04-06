<script setup lang="ts">
import { Code as CodeIcon } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import { UiCode } from '../ui';
import { getAvatarApiUrl, getAvatarApiCommand, unsupportedHttpApiOptions } from '@theme/utils/avatar';
import { formatPhpValue } from '@theme/utils/code-examples';
import PlaygroundDialog from './PlaygroundDialog.vue';
import Button from 'primevue/button';
import PlaygroundLicenseAlert from './PlaygroundLicenseAlert.vue';
import { usePlaygroundDialog } from '@theme/composables/usePlaygroundDialog';
import Message from 'primevue/message';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

const props = defineProps<{
  seed: string;
}>();

const { store, open, options } = usePlaygroundDialog(() => props.seed);

const tab = ref<string>(store.isCustomStyle ? 'js-library' : 'http-api');

watch(() => store.isCustomStyle, (isCustom) => {
  if (isCustom && tab.value === 'http-api') {
    tab.value = 'js-library';
  }
});

const exampleHttpApi = computed(() =>
  getAvatarApiUrl(store.avatarStyleName, options.value)
);
const hasExcludedOptions = computed(() => {
  const opts = options.value as Record<string, unknown>;
  return Object.keys(opts).some(
    (k) => unsupportedHttpApiOptions.has(k) && opts[k] !== undefined,
  );
});
const exampleHttpApiHtml = computed(
  () => `<img
  src="${getAvatarApiUrl(store.avatarStyleName, options.value)}"
  alt="avatar" />`
);
const exampleJsLibrary = computed(() => {
  if (store.isCustomStyle) {
    return `import { Style, Avatar } from '@dicebear/core';

// Your custom style definition
const definition = { /* ... */ };

const style = new Style(definition);
const avatar = new Avatar(style, ${JSON.stringify(
      options.value,
      null,
      2
    )});

const svg = avatar.toString();`;
  }

  return `import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/definitions/${store.avatarStyleName}.json';

const style = new Style(definition);
const avatar = new Avatar(style, ${JSON.stringify(
    options.value,
    null,
    2
  )});

const svg = avatar.toString();`;
});
const examplePhp = computed(() => {
  const phpOptions = formatPhpValue(options.value, 1);

  if (store.isCustomStyle) {
    return `<?php

use DiceBear\\Style;
use DiceBear\\Avatar;

// Your custom style definition
$definition = json_decode(file_get_contents('./my-style.json'), true);

$style = new Style($definition);
$avatar = new Avatar($style, ${phpOptions});

$svg = (string) $avatar;`;
  }

  return `<?php

use Composer\\InstalledVersions;
use DiceBear\\Style;
use DiceBear\\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/definitions');
$definition = json_decode(file_get_contents($basePath . '/src/${store.avatarStyleName}.json'), true);

$style = new Style($definition);
$avatar = new Avatar($style, ${phpOptions});

$svg = (string) $avatar;`;
});

const exampleCli = computed(() =>
  getAvatarApiCommand(
    store.isCustomStyle ? './my-style.json' : store.avatarStyleName,
    options.value,
  )
);
</script>

<template>
  <Button label="How to use" severity="secondary" @click="open = true">
    <template #icon>
      <CodeIcon :size="15" />
    </template>
  </Button>

  <PlaygroundDialog v-model:open="open" max-width="800px" header="How to use">

    <div class="playground-button-how-to-use-text">
      <div class="playground-button-how-to-use-tabs-card">
        <Tabs v-model:value="tab">
          <TabList>
            <Tab v-if="!store.isCustomStyle" value="http-api">HTTP-API</Tab>
            <Tab value="js-library">JS</Tab>
            <Tab value="php-library">PHP</Tab>
            <Tab value="cli">CLI</Tab>
          </TabList>
          <TabPanels>
            <TabPanel v-if="!store.isCustomStyle" value="http-api">
              <div class="playground-button-how-to-use-tab-content">
                <p>Use this URL to request this avatar style via our HTTP API.</p>
                <UiCode :code="exampleHttpApi" />
                <p>You can use the URL directly as image source.</p>
                <UiCode :code="exampleHttpApiHtml" lang="html" />
                <Message v-if="hasExcludedOptions" severity="warn" :closable="false" :style="{ '--p-message-text-font-size': '13px' }">
                  Some options you selected are not supported by our public
                  HTTP-API and have been omitted from the URL. You can enable
                  them by <a href="/guides/host-the-http-api-yourself/">hosting your own instance</a>.
                </Message>
                <p>
                  See <a href="/how-to-use/http-api">HTTP-API</a> docs for more
                  information.
                </p>
              </div>
            </TabPanel>
            <TabPanel value="js-library">
              <div class="playground-button-how-to-use-tab-content">
                <p>First install the required packages via npm:</p>
                <UiCode
                  :code="store.isCustomStyle
                    ? 'npm install @dicebear/core --save'
                    : 'npm install @dicebear/core @dicebear/definitions --save'"
                />
                <p>Then you can create this avatar as follows:</p>
                <UiCode :code="exampleJsLibrary" lang="js" />
                <p>
                  See <a href="/how-to-use/js-library">JS</a> docs for more
                  information.
                </p>
              </div>
            </TabPanel>
            <TabPanel value="php-library">
              <div class="playground-button-how-to-use-tab-content">
                <p>First install the required packages via Composer:</p>
                <UiCode
                  :code="store.isCustomStyle
                    ? 'composer require dicebear/core'
                    : 'composer require dicebear/core dicebear/definitions'"
                />
                <p>Then you can create this avatar as follows:</p>
                <UiCode :code="examplePhp" lang="php" />
                <p v-if="store.isCustomStyle">
                  Replace <code>./my-style.json</code> with the path to your style definition.
                </p>
              </div>
            </TabPanel>
            <TabPanel value="cli">
              <div class="playground-button-how-to-use-tab-content">
                <p>First install the CLI package via npm:</p>
                <UiCode code="npm install --global dicebear" />
                <p>Then you can create this avatar as follows:</p>
                <UiCode :code="exampleCli" />
                <p v-if="store.isCustomStyle">
                  Replace <code>./my-style.json</code> with the path to your style definition.
                </p>
                <p>
                  See <a href="/how-to-use/cli">CLI</a> docs for more information.
                </p>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      <PlaygroundLicenseAlert />
    </div>
  </PlaygroundDialog>
</template>

<style scoped lang="scss">
.playground-button-how-to-use {
  &-text {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    a {
      color: var(--vp-c-brand-1);

      &:hover {
        color: var(--vp-c-brand-2);
      }
    }
  }

  &-tabs-card {
    border: 1px solid var(--vp-c-border);
    border-radius: var(--vp-radius-xs);
    overflow: hidden;
  }

  &-tab-content {
    display: flex;
    flex-direction: column;
    gap: 12px;

    p {
      margin: 0;
    }
  }

}
</style>
