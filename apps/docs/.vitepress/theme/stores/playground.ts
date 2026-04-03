import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import type {
  PlaygroundStoreStyle,
  PlaygroundStoreOptions,
} from '@theme/types';
import { useData } from 'vitepress';
import { camelCase } from 'change-case';

export default defineStore('playground', () => {
  const data = useData();

  const availableAvatarStyles = Object.keys(data.theme.value.avatarStyles);

  let defaultAvatarStyleName = camelCase(
    new URL(window.location.href).searchParams.get('style') ??
      availableAvatarStyles[0],
  );

  if (false === availableAvatarStyles.includes(defaultAvatarStyleName)) {
    defaultAvatarStyleName = availableAvatarStyles[0];
  }

  const avatarStyleName = ref<PlaygroundStoreStyle>(defaultAvatarStyleName);
  const avatarStyleOptions = ref<PlaygroundStoreOptions>({});

  const avatarStyleOptionsWithoutDefaults = computed(() => {
    const result: PlaygroundStoreOptions = {};

    for (const [key, value] of Object.entries(avatarStyleOptions.value)) {
      if (value !== undefined) {
        result[key] = value;
      }
    }

    return result;
  });

  watch(avatarStyleName, () => {
    for (const key of Object.keys(avatarStyleOptions.value)) {
      delete avatarStyleOptions.value[key];
    }
  });

  return {
    avatarStyleName,
    avatarStyleOptions,
    avatarStyleOptionsWithoutDefaults,
  };
});
