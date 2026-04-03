<script setup lang="ts">
import { Code as CodeIcon } from '@lucide/vue';
import { computed, ref } from 'vue';
import { UiAvatar, UiCode } from '../ui';
import { getAvatarApiUrl, getAvatarApiCommand } from '@theme/utils/avatar';
import PlaygroundDialog from './PlaygroundDialog.vue';
import Button from 'primevue/button';
import PlaygroundLicenseAlert from './PlaygroundLicenseAlert.vue';
import { usePlaygroundDialog } from '@theme/composables/usePlaygroundDialog';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

const props = defineProps<{
  seed: string;
}>();

const { store, open, options } = usePlaygroundDialog(() => props.seed);

const tab = ref<string>('http-api');

const exampleHttpApi = computed(() =>
  getAvatarApiUrl(store.avatarStyleName, options.value)
);
const exampleHttpApiHtml = computed(
  () => `<img
  src="${getAvatarApiUrl(store.avatarStyleName, options.value)}"
  alt="avatar" />`
);
const exampleJsLibrary = computed(
  () => `import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/definitions/${store.avatarStyleName}.json';

const style = new Style(definition);
const avatar = new Avatar(style, ${JSON.stringify(
    options.value,
    null,
    2
  )});

const svg = avatar.toString();`
);
const exampleCli = computed(() =>
  getAvatarApiCommand(store.avatarStyleName, options.value)
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
            <Tab value="http-api">HTTP-API</Tab>
            <Tab value="js-library">JS-Library</Tab>
            <Tab value="cli">CLI</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="http-api" class="playground-button-how-to-use-tab-content">
              <p>Use this URL to request this avatar style via our HTTP API.</p>
              <UiCode :code="exampleHttpApi" />
              <p>You can use the URL directly as image source.</p>
              <UiCode :code="exampleHttpApiHtml" lang="html" />
              <p>
                See <a href="/how-to-use/http-api">HTTP-API</a> docs for more
                information.
              </p>
            </TabPanel>
            <TabPanel value="js-library" class="playground-button-how-to-use-tab-content">
              <p>First install the required packages via npm:</p>
              <UiCode
                code="npm install @dicebear/core @dicebear/definitions --save"
              />
              <p>Then you can create this avatar as follows:</p>
              <UiCode :code="exampleJsLibrary" lang="js" />
              <p>
                See <a href="/how-to-use/js-library">JS-Library</a> docs for more
                information.
              </p>
            </TabPanel>
            <TabPanel value="cli" class="playground-button-how-to-use-tab-content">
              <p>First install the CLI package via npm:</p>
              <UiCode code="npm install --global dicebear" />
              <p>Then you can create this avatar as follows:</p>
              <UiCode :code="exampleCli" />
              <p>
                See <a href="/how-to-use/cli">CLI</a> docs for more information.
              </p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      <PlaygroundLicenseAlert :style-name="store.avatarStyleName" />
    </div>
  </PlaygroundDialog>
</template>

<style scoped lang="scss">
.playground-button-how-to-use {
  &-text {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;

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
