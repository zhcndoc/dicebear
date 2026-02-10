<script setup lang="ts">
import { kebabCase } from 'change-case';
import { UiCode as Code } from '../ui';
import { computed, ref } from 'vue';
import { Tabs } from '@ark-ui/vue/tabs';

const props = defineProps<{
  styleName: string;
}>();

const tab = ref('http-api');

const exampleHttpApiUrl = computed(() => {
  return `https://api.dicebear.com/9.x/${kebabCase(props.styleName)}/svg`;
});

const exampleHttpApiImgTag = computed(() => {
  return `<img
  src="https://api.dicebear.com/9.x/${kebabCase(props.styleName)}/svg"
  alt="avatar"
/>`;
});

const exampleJsLibraryInstall = computed(() => {
  return `npm install @dicebear/core @dicebear/collection --save`;
});

const exampleJsLibraryUsage = computed(() => {
  return `import { createAvatar } from '@dicebear/core';
import { ${props.styleName} } from '@dicebear/collection';

const avatar = createAvatar(${props.styleName}, {
  // ... options
});

const svg = avatar.toString();
`;
});

const exampleCliInstall = computed(() => {
  return `npm install --global dicebear`;
});

const exampleCliUsage = computed(() => {
  return `dicebear ${props.styleName}`;
});
</script>

<template>
  <div class="style-usage">
    <Tabs.Root v-model="tab">
      <Tabs.List>
        <Tabs.Trigger value="http-api">HTTP-API</Tabs.Trigger>
        <Tabs.Trigger value="js-library">JS-Library</Tabs.Trigger>
        <Tabs.Trigger value="cli">CLI</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="http-api" class="style-usage-body">
        <p>Use this URL to request this avatar style via our HTTP API.</p>
        <Code :code="exampleHttpApiUrl" />

        <p>You can use the URL directly as image source.</p>
        <Code lang="html" :code="exampleHttpApiImgTag" />
        <p>
          See <a href="/how-to-use/http-api">HTTP-API</a> docs for more
          information.
        </p>
      </Tabs.Content>
      <Tabs.Content value="js-library" class="style-usage-body">
        <p>First install the required packages via npm:</p>
        <Code :code="exampleJsLibraryInstall" />

        <p>Then you can create this avatar as follows:</p>
        <Code lang="js" :code="exampleJsLibraryUsage" />
        <p>
          See <a href="/how-to-use/js-library">JS-Library</a> docs for more
          information.
        </p>
      </Tabs.Content>
      <Tabs.Content value="cli" class="style-usage-body">
        <p>First install the CLI package via npm:</p>
        <Code :code="exampleCliInstall" />

        <p>Then you can create this avatar as follows:</p>
        <Code :code="exampleCliUsage" />
        <p>
          See <a href="/how-to-use/cli">CLI</a> docs for more information.
        </p>
      </Tabs.Content>
    </Tabs.Root>
  </div>
</template>

<style lang="scss" scoped>
.style-usage {
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
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
