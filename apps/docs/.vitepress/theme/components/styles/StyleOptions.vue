<script setup lang="ts">
import { computed, nextTick, provide, ref, shallowRef } from 'vue';
import { OptionsDescriptor, type Style } from '@dicebear/core';
import { getScrollOffset, inBrowser } from 'vitepress';
import { loadAvatarStyle, styleUsesVariable } from '@theme/utils/avatar/style';
import { getStyleColorsMap } from '@theme/utils/avatar/colors';
import { computedAsync, watchOnce } from '@vueuse/core';
import { capitalCase } from 'change-case';
import { Search } from '@lucide/vue';
import InputText from 'primevue/inputtext';
import StyleOptionsGroup from './StyleOptionsGroup.vue';
import { ComponentPreview } from '@theme/utils/componentPreview';
import { componentNamesKey, styleColorsKey, componentPreviewKey, styleDefaultsKey } from './styleOptionsKeys';

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

const loadedStyle = shallowRef<Style | null>(null);

const styleData = computedAsync(async () => {
  const style = await loadAvatarStyle(props.styleName);
  loadedStyle.value = style;
  const descriptor = new OptionsDescriptor(style).toJSON();
  const componentNames = Array.from(style.components().keys()).sort((a, b) => a.localeCompare(b));
  const colorNames = [
    'background',
    ...Array.from(style.colors().keys()).filter((n) => n !== 'background').sort((a, b) => a.localeCompare(b)),
  ];

  return { descriptor, componentNames, colorNames };
}, null);

const allComponentNames = computed(() => styleData.value?.componentNames ?? []);
provide(componentNamesKey, allComponentNames);

const preview = computed(() => loadedStyle.value ? new ComponentPreview(loadedStyle.value) : null);
provide(componentPreviewKey, preview);

const styleColors = computed<Record<string, string[]>>(() =>
  loadedStyle.value ? getStyleColorsMap(loadedStyle.value) : {},
);
provide(styleColorsKey, styleColors);

const styleDefaults = computed<Record<string, unknown>>(() => {
  if (!loadedStyle.value) return {};

  const result: Record<string, unknown> = {};

  // General option defaults (from Options.ts)
  result.flip = 'none';
  result.fontFamily = 'system-ui';
  result.fontWeight = 400;
  result.scale = 1;
  result.borderRadius = 0;
  result.rotate = 0;
  result.translateX = 0;
  result.translateY = 0;
  result.idRandomization = false;

  for (const [name, component] of loadedStyle.value.components()) {
    const variantDefaults: Record<string, number> = {};
    for (const [v, variant] of component.variants()) {
      variantDefaults[v] = variant.weight();
    }
    result[`${name}Variant`] = variantDefaults;

    result[`${name}Probability`] = component.probability();

    const rotate = component.rotate();
    result[`${name}Rotate`] = rotate.length === 2 ? rotate : rotate[0] ?? 0;

    const tx = component.translate().x();
    result[`${name}TranslateX`] = tx.length === 2 ? tx : tx[0] ?? 0;

    const ty = component.translate().y();
    result[`${name}TranslateY`] = ty.length === 2 ? ty : ty[0] ?? 0;
  }

  for (const [name, values] of Object.entries(styleColors.value)) {
    result[`${name}Color`] = values;
    result[`${name}ColorFill`] = 'solid';
    result[`${name}ColorFillStops`] = 2;
    result[`${name}ColorAngle`] = 0;
  }

  return result;
});
provide(styleDefaultsKey, styleDefaults);

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

  const hiddenKeys = new Set<string>();

  if (!styleUsesVariable(props.styleName, 'fontFamily')) hiddenKeys.add('fontFamily');
  if (!styleUsesVariable(props.styleName, 'fontWeight')) hiddenKeys.add('fontWeight');

  const generalKeys = Object.keys(descriptor).filter(
    (key) =>
      !hiddenKeys.has(key) &&
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

// Option cards render asynchronously, so the browser's initial hash-scroll
// runs before the target anchors exist. Re-do the scroll once they're in.
watchOnce(styleData, async (data) => {
  if (!inBrowser || !data) return;

  const hash = window.location.hash;
  if (!hash.startsWith('#options-')) return;

  await nextTick();

  let id: string;
  try {
    id = decodeURIComponent(hash).slice(1);
  } catch {
    return;
  }

  const target = document.getElementById(id);
  if (!target) return;

  const top =
    window.scrollY +
    target.getBoundingClientRect().top -
    getScrollOffset();

  window.scrollTo({ left: 0, top, behavior: 'instant' });
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
