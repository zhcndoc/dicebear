<script setup lang="ts">
import { kebabCase } from 'change-case';
import { UiCode as Code } from '../ui';
import { computed, ref } from 'vue';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

const props = defineProps<{
  styleName: string;
}>();

const tab = ref('http-api');

const exampleHttpApiUrl = computed(() => {
  return `https://api.dicebear.com/10.x/${kebabCase(props.styleName)}/svg`;
});

const exampleHttpApiImgTag = computed(() => {
  return `<img
  src="https://api.dicebear.com/10.x/${kebabCase(props.styleName)}/svg"
  alt="avatar"
/>`;
});

const exampleJsLibraryInstall = computed(() => {
  return `npm install @dicebear/core @dicebear/definitions --save`;
});

const exampleJsLibraryUsage = computed(() => {
  return `import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/definitions/${kebabCase(props.styleName)}.json';

const style = new Style(definition);
const avatar = new Avatar(style, {
  // ... options
});

const svg = avatar.toString();
`;
});

const exampleCliInstall = computed(() => {
  return `npm install --global dicebear`;
});

const examplePhpInstall = computed(() => {
  return `composer require dicebear/core dicebear/definitions`;
});

const examplePhpUsage = computed(() => {
  return `<?php

use Composer\\InstalledVersions;
use DiceBear\\Style;
use DiceBear\\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/definitions');
$definition = json_decode(file_get_contents($basePath . '/src/${kebabCase(props.styleName)}.json'), true);

$style = new Style($definition);
$avatar = new Avatar($style, [
  // ... options
]);

$svg = (string) $avatar;
`;
});

const exampleCliUsage = computed(() => {
  return `dicebear ${props.styleName}`;
});
</script>

<template>
  <div class="style-usage">
    <Tabs v-model:value="tab">
      <TabList>
        <Tab value="http-api">HTTP-API</Tab>
        <Tab value="js-library">JS</Tab>
        <Tab value="php-library">PHP</Tab>
        <Tab value="cli">CLI</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="http-api" class="style-usage-body">
          <p>Use this URL to request this avatar style via our HTTP API.</p>
          <Code :code="exampleHttpApiUrl" />

          <p>You can use the URL directly as image source.</p>
          <Code lang="html" :code="exampleHttpApiImgTag" />
          <p>
            See <a href="/how-to-use/http-api">HTTP-API</a> docs for more
            information.
          </p>
        </TabPanel>
        <TabPanel value="js-library" class="style-usage-body">
          <p>First install the required packages via npm:</p>
          <Code :code="exampleJsLibraryInstall" />

          <p>Then you can create this avatar as follows:</p>
          <Code lang="js" :code="exampleJsLibraryUsage" />
          <p>
            See <a href="/how-to-use/js-library">JS</a> docs for more
            information.
          </p>
        </TabPanel>
        <TabPanel value="php-library" class="style-usage-body">
          <p>First install the required packages via Composer:</p>
          <Code :code="examplePhpInstall" />

          <p>Then you can create this avatar as follows:</p>
          <Code lang="php" :code="examplePhpUsage" />
          <p>
            See <a href="/how-to-use/php-library">PHP</a> docs for more
            information.
          </p>
        </TabPanel>
        <TabPanel value="cli" class="style-usage-body">
          <p>First install the CLI package via npm:</p>
          <Code :code="exampleCliInstall" />

          <p>Then you can create this avatar as follows:</p>
          <Code :code="exampleCliUsage" />
          <p>
            See <a href="/how-to-use/cli">CLI</a> docs for more information.
          </p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style lang="scss" scoped>
.style-usage {
  border: 1px solid var(--vp-c-border);
  border-radius: var(--vp-radius-xs);
  overflow: hidden;

  &-body {
    > *:first-child {
      margin-top: 0 !important;
    }

    > *:last-child {
      margin-bottom: 0 !important;
    }
  }
}
</style>
