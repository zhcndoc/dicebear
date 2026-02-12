<script setup lang="ts">
import PlaygroundSidebarAvatarStyle from './PlaygroundSidebarAvatarStyle.vue';
import useStore from '@theme/stores/playground';
import { computed } from 'vue';
import { JSONSchema7 } from 'json-schema';
import { useAvatarStyleSchema } from '@theme/composables/avatar';
import { storeToRefs } from 'pinia';
import PlaygroundSidebarAvatarOption from './PlaygroundSidebarAvatarOption.vue';
import { kebabCase } from 'change-case';

const store = useStore();
const { avatarStyleName } = storeToRefs(store);

const schema = useAvatarStyleSchema(avatarStyleName);

const properties = computed(() => {
  const result: Record<string, JSONSchema7> = {};

  if (schema.value?.properties) {
    for (const [key, value] of Object.entries(schema.value.properties)) {
      if (['dataUri', 'seed', 'size', 'clip'].includes(key)) {
        continue;
      }

      if (typeof value === 'object') {
        result[key] = value;
      }
    }
  }

  return result;
});
</script>

<template>
  <div class="playground-sidebar">
    <div class="playground-sidebar-grid">
      <div class="playground-sidebar-item">
        <PlaygroundSidebarAvatarStyle />
      </div>
      <div
        class="playground-sidebar-item"
        v-for="(property, field) in properties"
        :key="field"
      >
        <PlaygroundSidebarAvatarOption :field="field" :schema="property" :schema-properties="schema?.properties" />
      </div>
      <div class="playground-sidebar-item">
        <a
          class="playground-sidebar-more-btn"
          :href="`/styles/${kebabCase(store.avatarStyleName)}#options`"
        >
          More options
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playground-sidebar {
  padding: 8px 0 0;

  @media (min-width: 960px) {
    padding-top: 24px;
  }

  &-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &-item:empty {
    display: none;
  }

  &-more-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
    transition: all 0.2s ease;

    &:hover {
      background: var(--vp-c-brand-1);
      color: white;
    }
  }
}
</style>
