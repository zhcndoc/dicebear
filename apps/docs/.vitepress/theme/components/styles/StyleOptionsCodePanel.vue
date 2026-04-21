<script setup lang="ts">
import { computed } from 'vue';
import { UiCode as Code } from '../ui';
import { generateCodeExamples } from '@theme/utils/code-examples';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

const props = defineProps<{
  styleName: string;
  optionName: string;
  value: unknown;
  excludeHttpApi?: boolean;
}>();

const defaultTab = computed(() => props.excludeHttpApi ? 'js' : 'http-api');

const examples = computed(() =>
  generateCodeExamples(props.styleName, props.optionName, props.value),
);
</script>

<template>
  <div class="style-options-code-panel">
    <Tabs :value="defaultTab">
      <TabList>
        <Tab v-if="!excludeHttpApi" value="http-api">HTTP-API</Tab>
        <Tab value="js">JS</Tab>
        <Tab value="php">PHP</Tab>
        <Tab value="cli">CLI</Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-if="!excludeHttpApi" value="http-api">
          <Code :code="examples.httpApi" />
        </TabPanel>
        <TabPanel value="js">
          <Code lang="js" :code="examples.js" />
        </TabPanel>
        <TabPanel value="php">
          <Code lang="php" :code="examples.php" />
        </TabPanel>
        <TabPanel value="cli">
          <Code :code="examples.cli" />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped lang="scss">
.style-options-code-panel {
  border: 1px solid var(--pg-border);
  border-radius: var(--vp-radius-xs);
  background: var(--p-content-background);
  overflow: hidden;
}
</style>
