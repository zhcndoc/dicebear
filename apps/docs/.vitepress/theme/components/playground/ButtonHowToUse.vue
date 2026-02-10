<script setup lang="ts">
import { Code as CodeIcon } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { UiAvatar, UiCode } from '../ui';
import { getAvatarApiUrl, getAvatarApiCommand } from '@theme/utils/avatar';
import PlaygroundDialog from './PlaygroundDialog.vue';
import PlaygroundActionButton from './PlaygroundActionButton.vue';
import LicenseAlert from './LicenseAlert.vue';
import { usePlaygroundDialog } from '@theme/composables/usePlaygroundDialog';
import { Dialog } from '@ark-ui/vue/dialog';
import { Tabs } from '@ark-ui/vue/tabs';

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
  () => `import { createAvatar } from '@dicebear/core';
import { ${store.avatarStyleName} } from '@dicebear/collection';

const avatar = createAvatar(${store.avatarStyleName}, ${JSON.stringify(
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
  <PlaygroundActionButton tooltip="How to use" @click="open = true">
    <CodeIcon :size="16" />
  </PlaygroundActionButton>

  <PlaygroundDialog v-model:open="open" max-width="800px">
    <div class="button-how-to-use-header">
      <UiAvatar
        :style-name="store.avatarStyleName"
        :style-options="options"
        :size="64"
      />
      <div class="button-how-to-use-header-text">
        <Dialog.Title class="button-how-to-use-header-title">How to use</Dialog.Title>
        <p class="button-how-to-use-header-subtitle">Let's see how you can use this avatar in your project.</p>
      </div>
    </div>

    <div class="button-how-to-use-text">
      <div class="button-how-to-use-tabs-card">
        <Tabs.Root v-model="tab">
          <Tabs.List>
            <Tabs.Trigger value="http-api">HTTP-API</Tabs.Trigger>
            <Tabs.Trigger value="js-library">JS-Library</Tabs.Trigger>
            <Tabs.Trigger value="cli">CLI</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="http-api">
            <p>Use this URL to request this avatar style via our HTTP API.</p>
            <UiCode :code="exampleHttpApi" />
            <p>You can use the URL directly as image source.</p>
            <UiCode :code="exampleHttpApiHtml" lang="html" />
            <p>
              See <a href="/how-to-use/http-api">HTTP-API</a> docs for more
              information.
            </p>
          </Tabs.Content>
          <Tabs.Content value="js-library">
            <p>First install the required packages via npm:</p>
            <UiCode
              code="npm install @dicebear/core @dicebear/collection --save"
            />
            <p>Then you can create this avatar as follows:</p>
            <UiCode :code="exampleJsLibrary" lang="js" />
            <p>
              See <a href="/how-to-use/js-library">JS-Library</a> docs for more
              information.
            </p>
          </Tabs.Content>
          <Tabs.Content value="cli">
            <p>First install the CLI package via npm:</p>
            <UiCode code="npm install --global dicebear" />
            <p>Then you can create this avatar as follows:</p>
            <UiCode :code="exampleCli" />
            <p>
              See <a href="/how-to-use/cli">CLI</a> docs for more information.
            </p>
          </Tabs.Content>
        </Tabs.Root>
      </div>

      <LicenseAlert :style-name="store.avatarStyleName" />
    </div>
  </PlaygroundDialog>
</template>

<style scoped lang="scss">
.button-how-to-use {
  &-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 1.5rem;
    background: var(--vp-c-bg-soft);
    border-bottom: 1px solid var(--vp-c-border);

    &-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }

    &-subtitle {
      font-size: 14px;
      color: var(--vp-c-text-2);
      margin: 2px 0 0;
    }
  }

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
    border-radius: 8px;
    overflow: hidden;
  }

  &-cli-warning {
    margin-bottom: 12px;
  }
}
</style>
