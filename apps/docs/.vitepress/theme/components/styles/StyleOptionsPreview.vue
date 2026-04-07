<script setup lang="ts">
import { computed, inject } from 'vue';
import { getAvatarPropertyPreviewOptions, getComponentVariantPreviewOptions } from '@theme/utils/avatar';
import { UiAvatar } from '../ui';
import { componentNamesKey, componentNamesDefault, componentDepsKey, componentDepsDefault } from './styleOptionsKeys';

const props = defineProps<{
  styleName: string;
  name: string;
  value: string | number | boolean;
}>();

const allComponentNames = inject(componentNamesKey, componentNamesDefault);
const allDependencies = inject(componentDepsKey, componentDepsDefault);

const isVariantPreview = computed(() =>
  props.name.endsWith('Variant') && allComponentNames.value.length > 0,
);

const options = computed(() => {
  if (isVariantPreview.value) {
    const componentName = props.name.replace(/Variant$/, '');
    return getComponentVariantPreviewOptions(
      componentName,
      String(props.value),
      allComponentNames.value,
      allDependencies.value,
    );
  }
  return getAvatarPropertyPreviewOptions(props.name, props.value);
});

const avatarMode = computed(() => isVariantPreview.value ? 'library' : 'http-api');

function selectLabel(event: MouseEvent) {
    const range = document.createRange();
    range.selectNodeContents(event.currentTarget as Node);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
}
</script>

<template>
    <div class="style-options-preview">
        <div class="style-options-preview-avatar-wrapper">
            <UiAvatar
                :size="name === 'size' ? Number(value) : 80"
                :styleName="styleName"
                :styleOptions="options"
                :mode="avatarMode"
                class="style-options-preview-avatar"
            />
        </div>
        <code class="style-options-preview-label" @click="selectLabel">{{ value }}</code>
    </div>
</template>

<style scoped lang="scss">
.style-options-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 128px;
    border-radius: var(--vp-radius-xs);
    background: var(--vp-c-bg-soft);
    overflow: hidden;

    &-avatar-wrapper {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: 16px 12px 12px;
        min-height: 96px;
    }

    &-avatar {
        user-select: none;
    }

    &-label {
        display: block;
        text-align: center;
        padding: 6px 4px 10px;
        font-size: 11px;
        font-weight: 500;
        line-height: 1;
        color: var(--vp-c-text-2);
        cursor: pointer;
        background: none;
    }
}
</style>
