<script setup lang="ts">
import { computed, ref } from 'vue';
import { OptionsDescriptor } from '@dicebear/core';
import { loadAvatarStyle } from '@theme/utils/avatar';
import { computedAsync } from '@vueuse/core';
import { capitalCase } from 'change-case';
import { Search } from '@lucide/vue';
import InputText from 'primevue/inputtext';
import StyleOptionsGroup from './StyleOptionsGroup.vue';

interface OptionGroup {
  id: string;
  label: string;
  category: 'general' | 'component' | 'color';
  options: Record<string, any>;
}

const props = defineProps<{
  styleName: string;
}>();

const searchQuery = ref('');

const styleData = computedAsync(async () => {
  const style = await loadAvatarStyle(props.styleName);
  const descriptor = new OptionsDescriptor(style).toJSON();
  const componentNames = Array.from(style.components().keys());
  const colorNames = [...new Set([...Array.from(style.colors().keys()), 'background'])];

  return { descriptor, componentNames, colorNames };
}, null);

function isComponentOption(key: string, names: string[]): boolean {
  return names.some(
    (name) =>
      key === `${name}Variant` ||
      key === `${name}Probability` ||
      key === `${name}Rotate` ||
      key === `${name}TranslateX` ||
      key === `${name}TranslateY`,
  );
}

function isColorOption(key: string, names: string[]): boolean {
  return names.some(
    (name) =>
      key === `${name}Color` ||
      key === `${name}ColorFill` ||
      key === `${name}ColorFillStops` ||
      key === `${name}ColorAngle`,
  );
}

function pick(source: Record<string, any>, keys: string[]): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key of keys) {
    if (key in source) {
      result[key] = source[key];
    }
  }

  return result;
}

const groups = computed<OptionGroup[]>(() => {
  if (!styleData.value) return [];

  const { descriptor, componentNames, colorNames } = styleData.value;
  const result: OptionGroup[] = [];

  const generalKeys = Object.keys(descriptor).filter(
    (key) =>
      !isComponentOption(key, componentNames) &&
      !isColorOption(key, colorNames),
  );

  if (generalKeys.length > 0) {
    result.push({
      id: 'general',
      label: 'General',
      category: 'general',
      options: pick(descriptor, generalKeys),
    });
  }

  for (const name of componentNames) {
    const keys = Object.keys(descriptor).filter((k) =>
      isComponentOption(k, [name]),
    );

    if (keys.length > 0) {
      result.push({
        id: `component-${name}`,
        label: capitalCase(name),
        category: 'component',
        options: pick(descriptor, keys),
      });
    }
  }

  for (const name of colorNames) {
    const keys = Object.keys(descriptor).filter((k) =>
      isColorOption(k, [name]),
    );

    if (keys.length > 0) {
      result.push({
        id: `color-${name}`,
        label: `${capitalCase(name)} Color`,
        category: 'color',
        options: pick(descriptor, keys),
      });
    }
  }

  return result;
});

const totalOptionCount = computed(() => {
  if (!styleData.value) return 0;

  return Object.keys(styleData.value.descriptor).length;
});

const showSearch = computed(() => totalOptionCount.value > 15);

const filteredGroups = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) return groups.value;

  return groups.value
    .map((group) => {
      const filtered = Object.fromEntries(
        Object.entries(group.options).filter(([key]) =>
          key.toLowerCase().includes(query),
        ),
      );

      return { ...group, options: filtered };
    })
    .filter((group) => Object.keys(group.options).length > 0);
});
</script>

<template>
  <div class="style-options" v-if="styleData">
    <div class="style-options-search" v-if="showSearch">
      <div class="style-options-search-wrapper">
        <Search :size="16" class="style-options-search-icon" />
        <InputText
          v-model="searchQuery"
          placeholder="Filter options..."
          class="style-options-search-input"
        />
      </div>
    </div>

    <div class="style-options-groups">
      <StyleOptionsGroup
        v-for="group in filteredGroups"
        :key="group.id"
        :style-name="styleName"
        :label="group.label"
        :category="group.category"
        :options="group.options"
        :default-expanded="group.category === 'general'"
      />
    </div>

    <p class="style-options-empty" v-if="filteredGroups.length === 0 && searchQuery">
      No options match "{{ searchQuery }}".
    </p>
  </div>
</template>

<style scoped lang="scss">
.style-options {
  &-search {
    margin-bottom: 20px;

    &-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    &-icon {
      position: absolute;
      left: 14px;
      color: var(--vp-c-text-3);
      pointer-events: none;
    }

    &-input {
      width: 100%;
      padding-left: 40px !important;
      border-radius: var(--vp-radius-xs) !important;
      font-size: 14px !important;
    }
  }

  &-groups {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &-empty {
    text-align: center;
    color: var(--vp-c-text-3);
    font-size: 14px;
    padding: 32px 0;
  }
}
</style>
