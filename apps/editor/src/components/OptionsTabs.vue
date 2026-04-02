<script setup lang="ts">
import useMainStore from '@/stores/main';
import availableStyles from '@/config/styles';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const store = useMainStore();
const { t } = useI18n();

const tabs = computed(() => {
  const resolvedOptions = store.selectedStylePreview.toJSON().options;
  const configStyleOptions = availableStyles[store.selectedStyleName].options;

  const result: Record<string, boolean> = {
    style: Object.keys(store.availableStyles).length > 1,
  };

  for (const key in configStyleOptions) {
    result[key] = key in resolvedOptions;
  }

  return result;
});
</script>

<template>
  <div class="tabs">
    <Tabs v-model:value="store.selectedTab" scrollable>
      <TabList>
        <Tab
          v-for="(key, i) in Object.keys(tabs)"
          :key="i"
          :value="i.toString()"
          :disabled="!tabs[key]"
        >
          {{ t(key) }}
        </Tab>
      </TabList>
    </Tabs>
  </div>
</template>

<style scoped lang="scss">
.tabs {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  overflow: hidden;
  background-color: #fff;
}
</style>
