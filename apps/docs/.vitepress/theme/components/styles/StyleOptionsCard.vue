<script setup lang="ts">
import { computed, type Component } from 'vue';
import {
  Type,
  Hash,
  ToggleLeft,
  List,
  Palette,
  SlidersHorizontal,
  Weight,
} from '@lucide/vue';
import StyleOptionsTypeBadge from './StyleOptionsTypeBadge.vue';
import StyleOptionsPreview from './StyleOptionsPreview.vue';
import StyleOptionsCodePanel from './StyleOptionsCodePanel.vue';

const props = defineProps<{
  styleName: string;
  name: string;
  value: any;
}>();

const naturalSort = (a: string | number, b: string | number) => {
  return a.toString().localeCompare(b.toString(), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

const fieldType = computed(() => props.value.type as string);
const fieldValues = computed(() => (props.value.values as string[]) ?? []);
const fieldMin = computed(() => props.value.min as number | undefined);
const fieldMax = computed(() => props.value.max as number | undefined);
const isList = computed(() => props.value.list === true);
const isWeighted = computed(() => props.value.weighted === true);

interface BadgeConfig {
  label: string;
  color: string;
  icon: Component;
}

const typeStyles: Record<string, { color: string; icon: Component }> = {
  string:  { color: 'var(--vp-c-text-2)',    icon: Type },
  number:  { color: 'var(--vp-c-green-1)',   icon: Hash },
  boolean: { color: 'var(--vp-c-brand-1)',   icon: ToggleLeft },
  enum:    { color: 'var(--vp-c-purple-1)',   icon: List },
  color:   { color: 'var(--vp-c-yellow-1)',   icon: Palette },
  range:   { color: 'var(--vp-c-indigo-1)',   icon: SlidersHorizontal },
};

function style(type: string) {
  return typeStyles[type] ?? { color: 'var(--vp-c-text-2)', icon: Type };
}

const badges = computed<BadgeConfig[]>(() => {
  const type = fieldType.value;
  const s = style(type);

  switch (type) {
    case 'string':
    case 'number':
    case 'color': {
      const result: BadgeConfig[] = [{ label: type, ...s }];
      if (isList.value) result.push({ label: `${type}[]`, ...s });
      return result;
    }

    case 'boolean':
      return [{ label: 'boolean', ...s }];

    case 'enum': {
      const result: BadgeConfig[] = [{ label: 'enum', ...s }];
      if (isList.value) result.push({ label: 'enum[]', ...s });
      if (isWeighted.value) result.push({ label: 'weighted', color: s.color, icon: Weight });
      return result;
    }

    case 'range':
      return [
        { label: 'number', color: s.color, icon: Hash },
        { label: '[min, max]', ...s },
      ];

    default:
      return [{ label: type, ...s }];
  }
});

const skipPreview = computed(() => {
  const n = props.name;

  if (n.match(/ColorFillStops$/) || n.match(/ColorAngle$/)) {
    return true;
  }

  if (fieldType.value === 'boolean' || n === 'fontFamily' || n === 'title') {
    return true;
  }

  return false;
});

const excludeHttpApi = computed(() => {
  return props.name === 'title' || props.name === 'idRandomization';
});

const possibleValues = computed(() => {
  if (skipPreview.value) return [];

  return fieldValues.value.slice().sort(naturalSort);
});

const examples = computed<(string | number | boolean)[] | undefined>(() => {
  if (skipPreview.value) return undefined;

  if (isWeighted.value && fieldValues.value.length > 0) {
    return undefined;
  }

  if (props.name.match(/Probability$/)) return [0, 50, 100];
  if (props.name === 'backgroundColor') return ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'];
  if (props.name.match(/Color$/) && props.name !== 'backgroundColor') return undefined;
  if (props.name === 'seed') return ['Felix', 'Aneka', 'Mia', 'James'];
  if (props.name === 'flip') return ['none', 'horizontal', 'vertical', 'both'];
  if (props.name === 'rotate' || props.name.match(/Rotate$/)) return [0, 90, 180, 270];
  if (props.name === 'scale') return [0.5, 0.75, 1, 1.5];
  if (props.name === 'borderRadius') return [0, 10, 25, 50];
  if (props.name === 'size') return [32, 64, 96, 128];
  if (props.name === 'translateX' || props.name.match(/TranslateX$/)) return [-50, -25, 0, 25, 50];
  if (props.name === 'translateY' || props.name.match(/TranslateY$/)) return [-50, -25, 0, 25, 50];
  if (props.name === 'fontWeight') return [100, 400, 700, 900];

  return undefined;
});

// Prefer curated examples, fall back to possible values
const previewItems = computed(() => {
  if (examples.value) return examples.value;
  if (possibleValues.value.length > 0) return possibleValues.value;

  return [];
});

const codeExampleValue = computed(() => {
  if (examples.value) {
    return isList.value ? examples.value.slice(0, 2) : examples.value[0];
  }

  if (possibleValues.value.length > 0) {
    return isList.value ? possibleValues.value.slice(0, 2) : possibleValues.value[0];
  }

  if (fieldType.value === 'boolean') return true;
  if (fieldType.value === 'color') return ['b6e3f4'];
  if (fieldType.value === 'range' && fieldMin.value !== undefined) return fieldMin.value;
  if (props.name === 'title') return 'Avatar';
  if (props.name === 'fontFamily') return 'Arial';

  return undefined;
});

const headerId = computed(() => {
  return `options-${props.name.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
});

function boundsHint(): string {
  const min = fieldMin.value;
  const max = fieldMax.value;

  if (min !== undefined && max !== undefined) return ` Value between ${min} and ${max}.`;
  if (min !== undefined) return ` Minimum ${min}.`;
  if (max !== undefined) return ` Maximum ${max}.`;

  return '';
}

const description = computed(() => {
  const n = props.name;
  const bounds = boundsHint();

  if (n === 'seed') return 'The seed determines the initial value for the PRNG. With the same seed, the same avatar is generated every time.';
  if (n === 'size') return 'Output size in pixels. If omitted, the avatar scales to 100% of its container.' + bounds;
  if (n === 'idRandomization') return 'Randomizes all SVG element IDs to avoid conflicts when embedding multiple avatars in the same page.';
  if (n === 'title') return 'Accessible title for the SVG element. Useful for screen readers.';
  if (n.match(/Probability$/)) return 'Probability that this component appears in the avatar.' + bounds;
  if (n.match(/Variant$/)) return 'The visual variant for this component. If multiple values are given, the PRNG picks one.';
  if (n.match(/Color$/) && !n.match(/ColorFill/)) return 'Hex color value(s). If multiple values are given, the PRNG picks one.';
  if (n.match(/ColorFill$/)) return 'Fill mode for the color gradient. Only visible when multiple color stops are used.';
  if (n.match(/ColorFillStops$/)) return 'Number of color stops for gradient fills.' + bounds;
  if (n.match(/ColorAngle$/)) return 'Rotation angle for gradient fills in degrees.' + bounds;
  if (n === 'flip') return 'Mirror direction for the avatar.';
  if (n === 'scale') return 'Scale factor. A value of 1 corresponds to the original size. As a range [min, max], the PRNG picks a value in between.' + bounds;
  if (n === 'borderRadius') return 'Corner radius as a percentage. 0 = sharp corners, 50 = full circle.' + bounds;
  if (n === 'rotate' || n.match(/Rotate$/)) return 'Rotation in degrees. As a range [min, max], the PRNG picks a value in between.' + bounds;
  if (n === 'translateX' || n === 'translateY' || n.match(/TranslateX$/) || n.match(/TranslateY$/)) return 'Translation as a percentage of the canvas size. As a range [min, max], the PRNG picks a value in between.' + bounds;
  if (n === 'fontFamily') return 'Font family for text elements within the avatar SVG.';
  if (n === 'fontWeight') return 'Font weight for text elements within the avatar SVG.' + bounds;

  return undefined;
});

const descriptionWithHints = computed(() => {
  let text = description.value;
  if (!text) return undefined;

  if (excludeHttpApi.value) text += ' Not available via HTTP-API.';

  return text;
});

const weightedExampleValue = computed(() => {
  if (!isWeighted.value) return undefined;

  const vals = fieldValues.value;

  if (vals.length >= 2) {
    return { [vals[0]]: 2, [vals[1]]: 1 };
  }

  if (vals.length === 1) {
    return { [vals[0]]: 1 };
  }

  return { variant01: 2, variant02: 1 };
});
</script>

<template>
  <div class="style-options-card">
    <div class="style-options-card-header">
      <h3 :id="headerId" tabindex="-1" class="style-options-card-title">
        {{ name }}
        <a class="header-anchor" :href="`#${headerId}`" aria-hidden="true"></a>
      </h3>
      <div class="style-options-card-badges">
        <StyleOptionsTypeBadge
          v-for="badge in badges"
          :key="badge.label"
          :label="badge.label"
          :color="badge.color"
          :icon="badge.icon"
        />
      </div>
    </div>

    <p class="style-options-card-description" v-if="descriptionWithHints">
      {{ descriptionWithHints }}
    </p>

    <div class="style-options-card-preview" v-if="previewItems.length > 0">
      <div class="style-options-card-preview-grid">
        <StyleOptionsPreview
          v-for="(val, key) in previewItems"
          :key="key"
          :style-name="styleName"
          :name="name"
          :value="val"
        />
      </div>
    </div>

    <div class="style-options-card-code" v-if="codeExampleValue !== undefined && !weightedExampleValue">
      <StyleOptionsCodePanel
        :style-name="styleName"
        :option-name="name"
        :value="codeExampleValue"
        :exclude-http-api="excludeHttpApi"
      />
    </div>

    <div class="style-options-card-code-group" v-if="codeExampleValue !== undefined && weightedExampleValue">
      <div class="style-options-card-code-section">
        <span class="style-options-card-code-label">Usage</span>
        <StyleOptionsCodePanel
          :style-name="styleName"
          :option-name="name"
          :value="codeExampleValue"
          :exclude-http-api="excludeHttpApi"
        />
      </div>
      <div class="style-options-card-code-section">
        <span class="style-options-card-code-label">Weighted</span>
        <StyleOptionsCodePanel
          :style-name="styleName"
          :option-name="name"
          :value="weightedExampleValue"
          :exclude-http-api="excludeHttpApi"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.style-options-card {
  border: 1px solid var(--vp-c-border);
  border-radius: var(--vp-radius-sm);
  padding: 16px 20px;
  min-width: 0;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    flex-shrink: 0;
  }

  &-title {
    margin: 0 !important;
    padding: 0;
    border: none;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.4;
  }

  &-description {
    margin-top: 10px;
    margin-bottom: 0;
    font-size: 14px;
    line-height: 1.6;
    color: var(--vp-c-text-2);
  }

  &-preview {
    margin-top: 16px;

    &-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }

  &-code {
    margin-top: 16px;
  }

  &-code-group {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 16px;
  }

  &-code-label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--vp-c-text-3);
    margin-bottom: 8px;
  }
}
</style>
