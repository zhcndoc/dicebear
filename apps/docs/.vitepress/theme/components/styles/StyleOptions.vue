<script setup lang="ts">
import type { JSONSchema7 } from 'json-schema';
import { useData } from 'vitepress';
import { computed } from 'vue';
import { ThemeOptions } from '@theme/types';
import { schema as coreSchema } from '@dicebear/core';
import StyleOptionsRow from './StyleOptionsRow.vue';

const { theme } = useData<ThemeOptions>();

const props = defineProps<{
  styleName: string;
}>();

const style = computed(() => {
  return theme.value.avatarStyles[props.styleName];
});

const properties = computed(() => {
  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      ...coreSchema.properties,
      ...style.value.schema.properties,
    },
  };

  if (undefined === schema.properties) {
    return {};
  }

  let result: Record<string, JSONSchema7> = {};

  for (const key in schema.properties) {
    if (false === schema.properties.hasOwnProperty(key)) {
      continue;
    }

    const val = schema.properties[key];

    if (typeof val !== 'object') {
      continue;
    }

    result[key] = val;
  }

  return result;
});
</script>

<template>
  <StyleOptionsRow
    v-for="(value, name) of properties"
    :style="style"
    :style-name="styleName"
    :name="name"
    :value="value"
    :key="name"
  />
</template>
