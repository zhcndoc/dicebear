<script setup lang="ts">
import { computed } from 'vue';
import { getAvatarPropertyPreviewOptions } from '@theme/utils/avatar';
import { UiAvatar } from '../ui';

const props = defineProps<{
  styleName: string;
  name: string;
  value: string | number | boolean;
  schemaProperties?: Record<string, unknown>;
}>();

const options = computed(() =>
    getAvatarPropertyPreviewOptions(props.name, props.value, props.schemaProperties)
);

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
