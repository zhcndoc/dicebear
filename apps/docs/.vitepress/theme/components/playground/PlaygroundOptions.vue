<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { OptionsDescriptor } from '@dicebear/core';
import { loadAvatarStyle, stripHash, styleUsesVariable, webSafeFonts } from '@theme/utils/avatar';
import { useDependencyMap, type ComponentDependency } from '@theme/composables/useDependencyMap';
import { computedAsync } from '@vueuse/core';
import { capitalCase } from 'change-case';
import useStore from '@theme/stores/playground';
import { storeToRefs } from 'pinia';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { Shuffle } from '@lucide/vue';
import PlaygroundComponentSection from './PlaygroundComponentSection.vue';
import PlaygroundColorSection from './PlaygroundColorSection.vue';
import PlaygroundTransformSection from './PlaygroundTransformSection.vue';
import PlaygroundFontSection from './PlaygroundFontSection.vue';

const seed = defineModel<string>('seed', { required: true });

const store = useStore();
const { avatarStyleName } = storeToRefs(store);

const loadedStyle = computedAsync(async () => {
  return await loadAvatarStyle(avatarStyleName.value);
}, null);

const descriptor = computed(() => {
  if (!loadedStyle.value) return {};

  return new OptionsDescriptor(loadedStyle.value).toJSON();
});

// Apply initial options (from fragment import) once after descriptor first loads
const initialOptions = inject<import('vue').Ref<Record<string, unknown>>>('initialOptions', ref({}));
const initialOptionsApplied = ref(false);

watch(descriptor, (desc) => {
  if (initialOptionsApplied.value || Object.keys(desc).length === 0) return;

  initialOptionsApplied.value = true;

  const opts = initialOptions.value;

  if (Object.keys(opts).length > 0) {
    if ('fontFamily' in opts) {
      const allowed: readonly string[] = webSafeFonts;

      if (typeof opts.fontFamily === 'string' && !allowed.includes(opts.fontFamily)) {
        delete opts.fontFamily;
      } else if (Array.isArray(opts.fontFamily)) {
        opts.fontFamily = opts.fontFamily.filter((f: unknown) => typeof f === 'string' && allowed.includes(f));
        if ((opts.fontFamily as string[]).length === 0) delete opts.fontFamily;
      }
    }

    Object.assign(store.avatarStyleOptions, opts);
  }
}, { immediate: true });

const defaultColors = computed<Record<string, string[]>>(() => {
  if (!loadedStyle.value) return {};

  const result: Record<string, string[]> = {};

  for (const [name, color] of loadedStyle.value.colors()) {
    result[name] = color.values().map(stripHash);
  }

  return result;
});

const hasFontFamily = computed(() =>
  loadedStyle.value ? styleUsesVariable(avatarStyleName.value, 'fontFamily') : false,
);

const hasFontWeight = computed(() =>
  loadedStyle.value ? styleUsesVariable(avatarStyleName.value, 'fontWeight') : false,
);

const { componentDeps } = useDependencyMap(loadedStyle);

type ComponentInfo = {
  name: string;
  variants: string[];
  hasProbability: boolean;
  hasRotate: boolean;
  hasTranslateX: boolean;
  hasTranslateY: boolean;
  defaultProbability: number;
  defaultRotate: readonly number[];
  defaultTranslateX: readonly number[];
  defaultTranslateY: readonly number[];
  hasNonDefaultWeights: boolean;
  defaultWeights: Record<string, number>;
  dependency?: ComponentDependency;
};

type ColorInfo = {
  name: string;
  key: string;
  defaultValues: string[];
  hasFill: boolean;
  hasAngle: boolean;
  hasFillStops: boolean;
};

const components = computed(() => {
  const result: ComponentInfo[] = [];

  for (const [key, field] of Object.entries(descriptor.value)) {
    if (!key.endsWith('Variant') || field.type !== 'enum' || !field.weighted) {
      continue;
    }

    const name = key.replace(/Variant$/, '');
    const comp = loadedStyle.value?.components().get(name);

    result.push({
      name,
      variants: (field.values as string[]) ?? [],
      hasProbability: `${name}Probability` in descriptor.value,
      hasRotate: `${name}Rotate` in descriptor.value,
      hasTranslateX: `${name}TranslateX` in descriptor.value,
      hasTranslateY: `${name}TranslateY` in descriptor.value,
      defaultProbability: comp?.probability() ?? 100,
      defaultRotate: comp?.rotate() ?? [],
      defaultTranslateX: comp?.translate().x() ?? [],
      defaultTranslateY: comp?.translate().y() ?? [],
      hasNonDefaultWeights: comp ? [...comp.variants().values()].some((v) => v.weight() !== 1) : false,
      defaultWeights: comp
        ? Object.fromEntries([...comp.variants()].map(([name, v]) => [name, v.weight()]))
        : {},
      dependency: componentDeps.value[name],
    });
  }

  return result;
});

const allColors = computed(() => {
  const result: ColorInfo[] = [];

  for (const [key, field] of Object.entries(descriptor.value)) {
    if (field.type !== 'color' || !key.endsWith('Color')) continue;
    if (key.endsWith('ColorFill') || key.endsWith('ColorAngle') || key.endsWith('ColorFillStops')) continue;

    const name = key.replace(/Color$/, '');

    result.push({
      name,
      key,
      defaultValues: defaultColors.value[name] ?? [],
      hasFill: `${key}Fill` in descriptor.value,
      hasAngle: `${key}Angle` in descriptor.value,
      hasFillStops: `${key}FillStops` in descriptor.value,
    });
  }

  return result;
});

const sortedColors = computed(() => {
  const bg = allColors.value.filter((c) => c.name === 'background');
  const rest = allColors.value.filter((c) => c.name !== 'background');

  return [...bg, ...rest];
});

const componentNames = computed(() => components.value.map((c) => c.name));

function activeCount(comp: ComponentInfo): number {
  const val = store.avatarStyleOptions[`${comp.name}Variant`];

  if (val === undefined) return comp.variants.length;
  if (Array.isArray(val)) return val.length;
  if (typeof val === 'object') return Object.values(val as Record<string, number>).filter((w) => w > 0).length;
  if (typeof val === 'string') return 1;

  return comp.variants.length;
}

function colorCount(color: ColorInfo): number {
  const val = store.avatarStyleOptions[color.key];

  if (Array.isArray(val)) return val.length;

  return color.defaultValues.length;
}

function randomizeSeed() {
  seed.value = Math.random().toString(36).substring(2, 10);
}

const onSeedFocus = (e: FocusEvent) => {
  const input = e.target as HTMLInputElement;

  requestAnimationFrame(() => {
    input.setSelectionRange(0, input.value.length);
  });
};
</script>

<template>
  <div class="pg-options">
    <Accordion :multiple="true" :value="['__seed']" class="pg-options-accordion">
      <AccordionPanel value="__seed">
        <AccordionHeader>
          <span class="pg-options-label">Seed</span>
        </AccordionHeader>
        <AccordionContent>
          <div class="pg-options-seed-row">
            <InputText
              v-model="seed"
              placeholder="Enter a seed"
              class="pg-options-seed"
              @focus="onSeedFocus"
            />
            <Button
              severity="secondary"
              v-tooltip="'Random seed'"
              @click="randomizeSeed"
            >
              <Shuffle :size="16" />
            </Button>
          </div>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel v-if="hasFontFamily || hasFontWeight" value="__font">
        <AccordionHeader>
          <span class="pg-options-label">Font</span>
        </AccordionHeader>
        <AccordionContent>
          <PlaygroundFontSection :key="avatarStyleName" :has-font-family="hasFontFamily" :has-font-weight="hasFontWeight" />
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="__transform">
        <AccordionHeader>
          <span class="pg-options-label">Transform</span>
        </AccordionHeader>
        <AccordionContent>
          <PlaygroundTransformSection :key="avatarStyleName" />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

    <div class="pg-options-group" v-if="components.length > 0">
      <h3 class="pg-options-group-title">Components</h3>
      <Accordion :multiple="true" class="pg-options-accordion">
        <AccordionPanel v-for="comp in components" :key="`${avatarStyleName}-${comp.name}`" :value="comp.name">
          <AccordionHeader>
            <span class="pg-options-label">{{ capitalCase(comp.name) }}</span>
            <Tag :value="`${activeCount(comp)}/${comp.variants.length}`" severity="secondary" class="pg-options-tag" />
          </AccordionHeader>
          <AccordionContent>
            <PlaygroundComponentSection
              :key="`${avatarStyleName}-${comp.name}`"
              :component-name="comp.name"
              :all-component-names="componentNames"
              :variants="comp.variants"
              :has-probability="comp.hasProbability"
              :has-rotate="comp.hasRotate"
              :has-translate-x="comp.hasTranslateX"
              :has-translate-y="comp.hasTranslateY"
              :default-probability="comp.defaultProbability"
              :default-rotate="comp.defaultRotate"
              :default-translate-x="comp.defaultTranslateX"
              :default-translate-y="comp.defaultTranslateY"
              :has-non-default-weights="comp.hasNonDefaultWeights"
              :default-weights="comp.defaultWeights"
              :dependency="comp.dependency"
              :all-dependencies="componentDeps"
            />
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>

    <div class="pg-options-group" v-if="allColors.length > 0">
      <h3 class="pg-options-group-title">Colors</h3>
      <Accordion :multiple="true" class="pg-options-accordion">
        <AccordionPanel v-for="color in sortedColors" :key="`${avatarStyleName}-${color.key}`" :value="color.key">
          <AccordionHeader>
            <span class="pg-options-label">{{ capitalCase(color.name) }}</span>
            <Tag :value="String(colorCount(color))" severity="secondary" class="pg-options-tag" />
          </AccordionHeader>
          <AccordionContent>
            <PlaygroundColorSection
              :key="`${avatarStyleName}-${color.key}`"
              :color-name="color.name"
              :default-values="color.defaultValues"
              :has-fill="color.hasFill"
              :has-angle="color.hasAngle"
              :has-fill-stops="color.hasFillStops"
            />
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-options {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pg-options-group {
  &-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--vp-c-text-3);
    margin: 0 0 8px 2px;
  }
}

.pg-options-accordion {
  border: 1px solid var(--pg-border);
  border-radius: var(--vp-radius-sm);
  overflow: hidden;

  :deep(.p-accordionpanel:last-child) {
    border-width: 0;
  }
}

.pg-options-label {
  font-weight: 600;
  flex: 1;
  font-size: 14px;
}

.pg-options-tag {
  margin-right: 8px;
}

.pg-options-seed-row {
  display: flex;
  gap: 8px;
}

.pg-options-seed {
  flex: 1;
  min-width: 0;
}
</style>
