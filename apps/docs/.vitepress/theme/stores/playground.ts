import { defineStore } from 'pinia';
import { computed, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import type {
  CustomStyleEntry,
  PlaygroundStoreStyle,
  PlaygroundStoreOptions,
} from '@theme/types';
import { useData } from 'vitepress';
import { registerCustomStyle, unregisterCustomStyle } from '@theme/utils/avatar';

export default defineStore('playground', () => {
  const data = useData();

  const availableAvatarStyles = Object.keys(data.theme.value.avatarStyles);

  const avatarStyleName = useLocalStorage<PlaygroundStoreStyle>(
    'dicebear-playground-style',
    availableAvatarStyles[0],
  );
  const avatarStyleOptions = useLocalStorage<PlaygroundStoreOptions>(
    'dicebear-playground-options',
    {},
  );
  const seed = useLocalStorage<string>('dicebear-playground-seed', 'Felix');

  const customStyles = useLocalStorage<Record<string, CustomStyleEntry>>(
    'dicebear-playground-custom-styles',
    {},
  );

  // Register persisted custom styles in the style cache on init.
  // Strip Vue reactive proxies — Style constructor uses structuredClone internally.
  for (const [key, entry] of Object.entries(customStyles.value)) {
    try {
      registerCustomStyle(key, JSON.parse(JSON.stringify(entry.definition)));
    } catch {
      delete customStyles.value[key];
    }
  }

  const isCustomStyle = computed(() =>
    avatarStyleName.value.startsWith('custom:'),
  );

  function addCustomStyle(name: string, definition: object): string {
    let key = `custom:${name}`;
    let counter = 1;

    while (key in customStyles.value) {
      counter++;
      key = `custom:${name} (${counter})`;
    }

    customStyles.value[key] = { name, definition };

    return key;
  }

  function removeCustomStyle(key: string): void {
    delete customStyles.value[key];
    unregisterCustomStyle(key);

    if (avatarStyleName.value === key) {
      avatarStyleName.value = availableAvatarStyles[0];
    }
  }

  const avatarStyleOptionsWithoutDefaults = computed(() => {
    const result: PlaygroundStoreOptions = {};

    for (const [key, value] of Object.entries(avatarStyleOptions.value)) {
      if (value !== undefined) {
        result[key] = value;
      }
    }

    return result;
  });

  function resetOptions() {
    for (const key of Object.keys(avatarStyleOptions.value)) {
      delete avatarStyleOptions.value[key];
    }

    seed.value = 'Felix';
  }

  watch(avatarStyleName, resetOptions);

  return {
    availableAvatarStyles,
    avatarStyleName,
    avatarStyleOptions,
    avatarStyleOptionsWithoutDefaults,
    seed,
    customStyles,
    isCustomStyle,
    addCustomStyle,
    removeCustomStyle,
    resetOptions,
  };
});
