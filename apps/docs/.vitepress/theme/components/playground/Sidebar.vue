<script setup lang="ts">
import SidebarAvatarStyle from './SidebarAvatarStyle.vue';
import useStore from '@theme/stores/playground';
import { computed } from 'vue';
import { JSONSchema7 } from 'json-schema';
import { useAvatarStyleSchema } from '@theme/composables/avatar';
import { storeToRefs } from 'pinia';
import SidebarAvatarOption from './SidebarAvatarOption.vue';
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
  <div class="sidebar">
    <div class="sidebar-grid">
      <div class="sidebar-item">
        <SidebarAvatarStyle />
      </div>
      <div
        class="sidebar-item"
        v-for="(property, field) in properties"
        :key="field"
      >
        <SidebarAvatarOption :field="field" :schema="property" />
      </div>
      <div class="sidebar-item">
        <a
          class="sidebar-more-btn"
          :href="`/styles/${kebabCase(store.avatarStyleName)}#options`"
        >
          More options
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  padding: 8px 0 0;

  @media (min-width: 960px) {
    padding-top: 24px;
  }
}

.sidebar-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-item:empty {
  display: none;
}

.sidebar-more-btn {
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
</style>
