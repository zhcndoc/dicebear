<script setup lang="ts">
import useStore from '@theme/stores/playground';
import LicenseText from './LicenseText.vue';
import { capitalCase } from 'change-case';
import { useData } from 'vitepress';
import { ThemeOptions } from '@theme/types';
import { UiAvatar } from '../ui';
import { Select, createListCollection } from '@ark-ui/vue/select';
import { ChevronDown } from 'lucide-vue-next';
import { computed } from 'vue';

const store = useStore();
const data = useData<ThemeOptions>();

const collection = computed(() =>
  createListCollection({
    items: Object.keys(data.theme.value.avatarStyles)
      .sort()
      .map((key) => ({
        value: key,
        label: capitalCase(key),
      })),
  })
);

function onValueChange(value: string[]) {
  if (value.length > 0) {
    store.avatarStyleName = value[0];
  }
}
</script>

<template>
  <div>
    <label class="sidebar-avatar-style-label" for="avatarStyle">
      Avatar Style
      <span class="sidebar-avatar-style-badge">30+</span>
    </label>
    <Select.Root
      :collection="collection"
      :model-value="[store.avatarStyleName]"
      @update:model-value="onValueChange"
      :positioning="{ sameWidth: true, strategy: 'fixed' }"
      lazy-mount
      unmount-on-exit
    >
      <Select.Control>
        <Select.Trigger class="sidebar-avatar-style-trigger">
          <UiAvatar
            :size="32"
            :styleName="store.avatarStyleName"
            :style-options="{ seed: 'JD' }"
            class="sidebar-avatar-style-trigger-avatar"
          />
          <Select.ValueText :placeholder="'Select a style'" />
          <Select.Indicator>
            <ChevronDown />
          </Select.Indicator>
        </Select.Trigger>
      </Select.Control>

      <Teleport to="body">
        <Select.Positioner>
          <Select.Content class="sidebar-avatar-style-content">
            <Select.List>
              <Select.Item
                v-for="item in collection.items"
                :key="item.value"
                :item="item"
                class="sidebar-avatar-style-item"
              >
                <UiAvatar
                  :size="32"
                  :style-name="item.value"
                  :style-options="{ seed: 'JD' }"
                  class="sidebar-avatar-style-item-avatar"
                />
                <Select.ItemText>{{ item.label }}</Select.ItemText>
              </Select.Item>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Teleport>
    </Select.Root>

    <div class="sidebar-avatar-style-license">
      <div class="sidebar-avatar-style-license-text">
        <LicenseText />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar-avatar-style {
  &-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-1);
    margin-bottom: 8px;
  }

  &-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 600;
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
    border-radius: 10px;
  }

  &-trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 12px;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    border-radius: 6px;
    font-size: 14px;
    color: var(--vp-c-text-1);
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
    min-height: 48px;

    &:hover {
      border-color: var(--vp-c-border);
    }

    &[data-state='open'] {
      border-color: var(--vp-c-brand-1);
      box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
    }

    &-avatar {
      flex-shrink: 0;
    }
  }

  &-content {
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    border-radius: 8px;
    box-shadow: var(--vp-shadow-3);
    padding: 4px;
    max-height: 420px;
    overflow-y: auto;
    outline: none;

    &[data-state='closed'] {
      display: none;
    }
  }

  &-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    color: var(--vp-c-text-1);
    cursor: pointer;
    transition: background 0.15s ease;
    outline: none;

    &[data-highlighted] {
      background: var(--vp-c-bg-soft);
    }

    &[data-state='checked'] {
      color: var(--vp-c-brand-1);
      font-weight: 500;
    }

    &-avatar {
      flex-shrink: 0;
    }
  }

  &-license {
    margin-top: 12px;

    &-text {
      font-size: 12px;
      line-height: 1.3;
      color: var(--vp-c-text-2);
      opacity: 0.65;
    }
  }
}
</style>
