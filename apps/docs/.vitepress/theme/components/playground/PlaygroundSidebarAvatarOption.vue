<script setup lang="ts">
import useStore from '@theme/stores/playground';
import { JSONSchema7 } from 'json-schema';
import { computed } from 'vue';
import { UiAvatar } from '../ui';
import { getAvatarPropertyPreviewOptions } from '@theme/utils/avatar';
import { useSchemaOptions } from '@theme/composables/useSchemaOptions';
import { Select } from '@ark-ui/vue/select';
import { ChevronDown, Check, X } from 'lucide-vue-next';

const props = defineProps<{
  field: string | number;
  schema: JSONSchema7;
  schemaProperties?: Record<string, unknown>;
}>();

const store = useStore();

const {
  label,
  hint,
  options,
  multiple,
  isLimited,
  selectItems,
  collection,
} = useSchemaOptions(
  () => props.field,
  () => props.schema
);

const currentValue = computed(() => {
  const val = store.avatarStyleOptions[props.field];
  if (Array.isArray(val)) {
    return val.map(String);
  }
  if (val !== undefined && val !== null) {
    return [String(val)];
  }
  return [];
});

function onValueChange(value: string[]) {
  const rawValues = value.map((v) => {
    const found = selectItems.value.find((item) => item.value === v);
    return found ? found.rawValue : v;
  });

  if (multiple.value) {
    store.avatarStyleOptions[props.field] = rawValues;
  } else {
    store.avatarStyleOptions[props.field] = rawValues[0];
  }
}

const displayValue = computed(() => {
  const val = currentValue.value;
  if (val.length === 0) return '';
  const firstItem = selectItems.value.find((item) => item.value === val[0]);
  const firstLabel = firstItem ? firstItem.label : val[0];
  if (val.length === 1) return firstLabel;
  return `${firstLabel} +${val.length - 1}`;
});
</script>

<template>
  <template v-if="options.length > 1 && !isLimited">
    <label class="playground-sidebar-avatar-option-label">{{ label }}</label>
    <Select.Root
      :collection="collection"
      :multiple="multiple"
      :model-value="currentValue"
      @update:model-value="onValueChange"
      :positioning="{ sameWidth: true, strategy: 'fixed' }"
      lazy-mount
      unmount-on-exit
    >
      <Select.Control>
        <Select.Trigger class="playground-sidebar-avatar-option-trigger">
          <span class="playground-sidebar-avatar-option-trigger-text">{{ displayValue || 'Select...' }}</span>
          <button
            v-if="multiple && currentValue.length > 0"
            class="playground-sidebar-avatar-option-clear"
            @click.stop.prevent="onValueChange([])"
            type="button"
          >
            <X :size="14" />
          </button>
          <Select.Indicator>
            <ChevronDown />
          </Select.Indicator>
        </Select.Trigger>
      </Select.Control>

      <Teleport to="body">
        <Select.Positioner>
          <Select.Content class="playground-sidebar-avatar-option-content">
            <Select.List>
              <Select.Item
                v-for="item in collection.items"
                :key="item.value"
                :item="item"
                class="playground-sidebar-avatar-option-item"
              >
                <Select.ItemIndicator v-if="multiple" class="playground-sidebar-avatar-option-check">
                  <Check :size="14" />
                </Select.ItemIndicator>
                <span v-if="multiple" class="playground-sidebar-avatar-option-check-placeholder"></span>
                <Select.ItemText>{{ item.label }}</Select.ItemText>
                <UiAvatar
                  v-if="!field.toString().match(/Probability$/)"
                  :size="32"
                  :style-name="store.avatarStyleName"
                  :style-options="
                    getAvatarPropertyPreviewOptions(
                      field.toString(),
                      item.rawValue,
                      props.schemaProperties
                    )
                  "
                  class="playground-sidebar-avatar-option-avatar"
                  mode="library"
                />
              </Select.Item>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Teleport>
    </Select.Root>
    <p v-if="hint" class="playground-sidebar-avatar-option-hint">{{ hint }}</p>
  </template>
</template>

<style scoped lang="scss">
.playground-sidebar-avatar-option {
  &-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-1);
    margin-bottom: 6px;
  }

  &-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
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
    min-height: 40px;

    &:hover {
      border-color: var(--vp-c-border);
    }

    &[data-state='open'] {
      border-color: var(--vp-c-brand-1);
      box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
    }

    &-text {
      flex: 1;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &-content {
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    border-radius: 8px;
    box-shadow: var(--vp-shadow-3);
    padding: 4px;
    max-height: 325px;
    overflow-y: auto;
    outline: none;

    &[data-state='closed'] {
      display: none;
    }
  }

  &-item {
    display: flex;
    align-items: center;
    gap: 8px;
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
    }

    &[data-state='checked'] .playground-sidebar-avatar-option-check-placeholder {
      display: none;
    }

    &:not([data-state='checked']) .playground-sidebar-avatar-option-check {
      display: none;
    }
  }

  &-check {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    color: var(--vp-c-brand-1);
    flex-shrink: 0;

    &-placeholder {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
  }

  &-avatar {
    margin-left: auto;
    flex-shrink: 0;
  }

  &-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    border: none;
    background: none;
    color: var(--vp-c-text-3);
    cursor: pointer;
    border-radius: 4px;
    flex-shrink: 0;

    &:hover {
      color: var(--vp-c-text-1);
      background: var(--vp-c-bg);
    }
  }

  &-hint {
    font-size: 12px;
    color: var(--vp-c-text-3);
    margin-top: 4px;
  }
}
</style>
