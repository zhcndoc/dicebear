<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { getAvatarPropertyPreviewOptions, padColors, resolveColors } from '@theme/utils/avatar';
import { UiAvatar } from '../ui';
import { componentNamesKey, componentNamesDefault, styleColorsKey, styleColorsDefault, componentPreviewKey } from './styleOptionsKeys';

const props = defineProps<{
  styleName: string;
  name: string;
  value: string | number | boolean;
}>();

const allComponentNames = inject(componentNamesKey, componentNamesDefault);
const styleColors = inject(styleColorsKey, styleColorsDefault);
const preview = inject(componentPreviewKey, ref(null));

// Determine what type of preview this is and which component/color it targets
const previewTarget = computed(() => {
  const n = props.name;

  if (n.endsWith('Variant')) {
    return { type: 'variant' as const, component: n.replace(/Variant$/, '') };
  }

  if (n.endsWith('Probability')) {
    return { type: 'probability' as const, component: n.replace(/Probability$/, '') };
  }

  // ColorFillStops must come before ColorFill (longer suffix first)
  if (n.endsWith('ColorFillStops')) {
    return { type: 'colorFillStops' as const, color: n.slice(0, -'ColorFillStops'.length) };
  }

  if (n.endsWith('ColorFill')) {
    return { type: 'colorFill' as const, color: n.slice(0, -'ColorFill'.length) };
  }

  if (n.endsWith('ColorAngle')) {
    return { type: 'colorAngle' as const, color: n.slice(0, -'ColorAngle'.length) };
  }

  if (n.endsWith('Color')) {
    return { type: 'color' as const, color: n.replace(/Color$/, '') };
  }

  return { type: 'general' as const };
});

const isComponentPreview = computed(() => {
  if (!preview.value) return false;

  const t = previewTarget.value;

  if (t.type === 'general') return false;

  // Check the target component/color exists
  if ('component' in t) return allComponentNames.value.includes(t.component);
  if ('color' in t) {
    const usage = preview.value.colorUsage();
    return (usage[t.color]?.length ?? 0) > 0;
  }

  return false;
});

const previewDataUri = computed(() => {
  if (!isComponentPreview.value || !preview.value) return undefined;

  const p = preview.value;
  const t = previewTarget.value;

  switch (t.type) {
    case 'variant':
      return p.toDataUri(t.component, String(props.value));

    case 'probability': {
      const firstVariant = p.firstVariant(t.component);
      if (!firstVariant) return undefined;
      return p.toDataUri(t.component, firstVariant, {
        [props.name]: props.value,
      });
    }

    case 'color':
      return p.toDataUriForColor(t.color, {
        [`${t.color}Color`]: [props.value],
      });

    case 'colorFill':
      return p.toDataUriForColor(t.color, {
        [`${t.color}Color`]: padColors(resolveColors(t.color, styleColors.value), 2),
        [`${t.color}ColorFill`]: [props.value],
      });

    case 'colorFillStops': {
      const stops = Number(props.value) || 2;
      return p.toDataUriForColor(t.color, {
        [`${t.color}Color`]: padColors(resolveColors(t.color, styleColors.value), stops).slice(0, stops),
        [`${t.color}ColorFill`]: ['linear'],
        [`${t.color}ColorFillStops`]: [props.value],
      });
    }

    case 'colorAngle':
      return p.toDataUriForColor(t.color, {
        [`${t.color}Color`]: padColors(resolveColors(t.color, styleColors.value), 2),
        [`${t.color}ColorFill`]: ['linear'],
        [`${t.color}ColorAngle`]: [props.value],
      });
  }

  return undefined;
});

// Fallback: general options still use UiAvatar with getAvatarPropertyPreviewOptions
const generalOptions = computed(() => {
  if (isComponentPreview.value) return undefined;

  return getAvatarPropertyPreviewOptions(props.name, props.value);
});

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
            <div v-if="previewDataUri" class="style-options-preview-img">
                <img :src="previewDataUri" alt="" />
            </div>
            <UiAvatar
                v-else-if="generalOptions"
                :size="name === 'size' ? Number(value) : 80"
                :styleName="styleName"
                :styleOptions="generalOptions"
                mode="http-api"
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
    min-width: 0;
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

    &-img {
        width: 80px;
        height: 80px;
        border-radius: 3px;
        background: repeating-conic-gradient(
            var(--ui-avatar-bg-1, rgba(0, 0, 0, 0.02)) 0% 25%,
            var(--ui-avatar-bg-2, rgba(0, 0, 0, 0.07)) 0% 50%
          )
          50% / 12px 12px;
        overflow: hidden;
        user-select: none;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            margin: 0;
        }
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
