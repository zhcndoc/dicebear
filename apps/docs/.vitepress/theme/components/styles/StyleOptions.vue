<script setup lang="ts">
import { useData } from 'vitepress';
import { computed } from 'vue';
import { ThemeOptions } from '@theme/types';
import { OptionsDescriptor } from '@dicebear/core';
import { loadAvatarStyle } from '@theme/utils/avatar';
import StyleOptionsRow from './StyleOptionsRow.vue';
import { computedAsync } from '@vueuse/core';

const { theme } = useData<ThemeOptions>();

const props = defineProps<{
  styleName: string;
}>();

const style = computed(() => {
  return theme.value.avatarStyles[props.styleName];
});

const descriptor = computedAsync(async () => {
  const avatarStyle = await loadAvatarStyle(props.styleName);

  return new OptionsDescriptor(avatarStyle).toJSON();
}, {});
</script>

<template>
  <StyleOptionsRow
    v-for="(value, name) of descriptor"
    :style-name="styleName"
    :name="name"
    :value="value"
    :key="name"
  />
</template>
