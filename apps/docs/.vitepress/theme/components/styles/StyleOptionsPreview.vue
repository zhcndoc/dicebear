<script setup lang="ts">
import { computed } from 'vue';
import { getAvatarPropertyPreviewOptions } from '@theme/utils/avatar';
import { UiAvatar } from '../ui';

const props = defineProps({
    styleName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    value: {
        required: true,
    },
    schemaProperties: {
        type: Object,
    },
});

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
                :size="name === 'size' ? parseInt(value as any) : 96"
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
    box-shadow: 1px 0 0 var(--vp-c-border),
                0 1px 0 var(--vp-c-border);

    &-avatar-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        min-height: 128px;
    }

    &-avatar {
        user-select: none;
    }

    &-label {
        display: block;
        text-align: center;
        padding: 8px 4px;
        border-top: 1px solid var(--vp-c-border);
        font-size: 12px;
        line-height: 1;
        cursor: pointer;
    }
}
</style>
