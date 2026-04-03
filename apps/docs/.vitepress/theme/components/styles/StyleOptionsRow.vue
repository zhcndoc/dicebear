<script setup lang="ts">
import { computed } from 'vue';
import { UiCode as Code } from '../ui';
import StyleOptionsPreview from './StyleOptionsPreview.vue';
import StyleOptionsTag from './StyleOptionsTag.vue';
import { getAvatarApiUrl } from '@theme/utils/avatar';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

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

// Options that don't benefit from visual examples
const skipExamples = computed(() => {
  const n = props.name;

  // ColorFill/ColorFillStops/ColorAngle only make sense in context with
  // multiple colors and gradient fill - standalone previews are misleading.
  if (n.match(/ColorFill$/) || n.match(/ColorFillStops$/) || n.match(/ColorAngle$/)) {
    return true;
  }

  // Boolean and pure string options don't preview well
  if (fieldType.value === 'boolean' || n === 'fontFamily') {
    return true;
  }

  return false;
});

const possibleValues = computed(() => {
  if (skipExamples.value) return [];

  return fieldValues.value.slice().sort(naturalSort);
});

const examples = computed<(string | number | boolean)[] | undefined>(() => {
  if (skipExamples.value) return undefined;

  // Variant options: use the possible values directly
  if (isWeighted.value && fieldValues.value.length > 0) {
    return undefined;
  }

  if (props.name.match(/Probability$/)) {
    return [0, 50, 100];
  }

  if (props.name === 'backgroundColor') {
    return ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'];
  }

  if (props.name.match(/Color$/) && props.name !== 'backgroundColor') {
    return undefined;
  }

  if (props.name === 'seed') {
    return ['Felix', 'Aneka', 'Mia', 'James'];
  }

  if (props.name === 'flip') {
    return ['none', 'horizontal', 'vertical', 'both'];
  }

  if (props.name === 'rotate' || props.name.match(/Rotate$/)) {
    return [0, 90, 180, 270];
  }

  if (props.name === 'scale') {
    return [0.5, 0.75, 1, 1.5];
  }

  if (props.name === 'borderRadius') {
    return [0, 10, 25, 50];
  }

  if (props.name === 'size') {
    return [32, 64, 96, 128];
  }

  if (props.name === 'translateX' || props.name.match(/TranslateX$/)) {
    return [-50, -25, 0, 25, 50];
  }

  if (props.name === 'translateY' || props.name.match(/TranslateY$/)) {
    return [-50, -25, 0, 25, 50];
  }

  if (props.name === 'fontWeight') {
    return [100, 400, 700, 900];
  }
});

const hasExamples = computed(() => examples.value !== undefined || possibleValues.value.length > 0);

const initialValueTab = computed(() => {
  if (examples.value !== undefined) return 'examples';
  if (possibleValues.value.length > 0) return 'values';
  return undefined;
});

const codeExampleValue = computed(() => {
  if (examples.value) {
    return isList.value ? examples.value.slice(0, 3) : examples.value[0];
  }

  if (possibleValues.value.length > 0) {
    return isList.value ? possibleValues.value.slice(0, 3) : possibleValues.value[0];
  }

  if (fieldType.value === 'boolean') return true;
  if (fieldType.value === 'color') return ['b6e3f4'];
  if (fieldType.value === 'range' && fieldMin.value !== undefined) return fieldMin.value;

  return undefined;
});

const exampleHttpApi = computed(() => {
  if (codeExampleValue.value === undefined) return '';

  return getAvatarApiUrl(props.styleName, {
    [props.name]: codeExampleValue.value,
  });
});

const exampleJsLibrary = computed(() => {
  return `new Avatar(style, {
  ${props.name}: ${JSON.stringify(codeExampleValue.value)}
});`;
});

const exampleCli = computed(() => {
  const value = Array.isArray(codeExampleValue.value)
    ? codeExampleValue.value.map((v) => JSON.stringify(v)).join(' ')
    : JSON.stringify(codeExampleValue.value);

  return `dicebear ${props.styleName} --${props.name} ${value}`;
});

const headerId = computed(() => {
  return `options-${props.name.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
});

const description = computed(() => {
  const n = props.name;

  if (n === 'seed') {
    return 'The seed determines the initial value for the PRNG. With the same seed, the same avatar is generated every time.';
  }

  if (n === 'size') {
    return 'Output size in pixels. If omitted, the avatar scales to 100% of its container.';
  }

  if (n === 'idRandomization') {
    return 'Randomizes all SVG element IDs to avoid conflicts when embedding multiple avatars in the same page.';
  }

  if (n.match(/Probability$/)) {
    return 'Probability (0–100) that this component appears in the avatar.';
  }

  if (n.match(/Variant$/)) {
    return 'The visual variant for this component. If multiple values are given, the PRNG picks one.';
  }

  if (n.match(/Color$/) && !n.match(/ColorFill/)) {
    return 'Hex color value(s). If multiple values are given, the PRNG picks one.';
  }

  if (n.match(/ColorFill$/)) {
    return 'Fill mode for the color gradient. Only visible when multiple color stops are used.';
  }

  if (n.match(/ColorFillStops$/)) {
    return 'Number of color stops for gradient fills.';
  }

  if (n.match(/ColorAngle$/)) {
    return 'Rotation angle for gradient fills.';
  }

  if (n === 'flip') {
    return 'Mirror direction for the avatar.';
  }

  if (n === 'scale') {
    return 'Scale factor. A value of 1 corresponds to the original size. As a range [min, max], the PRNG picks a value in between.';
  }

  if (n === 'borderRadius') {
    return 'Corner radius. 0 = sharp corners, 50 = full circle. As a range [min, max], the PRNG picks a value in between.';
  }

  if (n === 'rotate' || n.match(/Rotate$/)) {
    return 'Rotation in degrees. As a range [min, max], the PRNG picks a value in between.';
  }

  if (n.match(/TranslateX$/) || n.match(/TranslateY$/)) {
    return 'Translation as a percentage of the canvas size. As a range [min, max], the PRNG picks a value in between.';
  }

  return undefined;
});
</script>

<template>
  <h3 :id="headerId" tabindex="-1" class="style-options-row-title">
    {{ name }}
    <a class="header-anchor" :href="`#${headerId}`" aria-hidden="true"></a>
  </h3>

  <StyleOptionsTag name="Type" :value="fieldType" />
  <StyleOptionsTag name="List" value="true" v-if="isList" />
  <StyleOptionsTag name="Weighted" value="true" v-if="isWeighted" />
  <StyleOptionsTag
    name="Minimum"
    :value="fieldMin"
    v-if="fieldMin !== undefined"
  />
  <StyleOptionsTag
    name="Maximum"
    :value="fieldMax"
    v-if="fieldMax !== undefined"
  />

  <p v-if="description">{{ description }}</p>

  <div class="style-options-row-card" v-if="hasExamples">
    <Tabs :value="initialValueTab">
      <TabList>
        <Tab value="examples" v-if="examples !== undefined">Examples</Tab>
        <Tab value="values" v-if="possibleValues.length > 0">Possible Values</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="examples" v-if="examples !== undefined" class="style-options-row-preview-tab-content">
          <div class="style-options-row-preview">
            <StyleOptionsPreview
              v-for="(val, key) in examples"
              :key="key"
              :style-name="styleName"
              :name="name"
              :value="val"
            />
          </div>
        </TabPanel>
        <TabPanel value="values" v-if="possibleValues.length > 0" class="style-options-row-preview-tab-content">
          <div class="style-options-row-preview">
            <StyleOptionsPreview
              v-for="(val, key) in possibleValues"
              :key="key"
              :style-name="styleName"
              :name="name"
              :value="val"
            />
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>

  <div class="style-options-row-card" v-if="codeExampleValue !== undefined">
    <Tabs value="http-api">
      <TabList>
        <Tab value="http-api">HTTP-API</Tab>
        <Tab value="js-library">JS-Library</Tab>
        <Tab value="cli">CLI</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="http-api">
          <Code class="style-options-row-code" :code="exampleHttpApi" />
        </TabPanel>
        <TabPanel value="js-library">
          <Code class="style-options-row-code" lang="js" :code="exampleJsLibrary" />
        </TabPanel>
        <TabPanel value="cli">
          <Code class="style-options-row-code" :code="exampleCli" />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped lang="scss">
.style-options-row {
  &-title {
    margin-bottom: 16px;
  }

  &-card {
    margin-top: 16px;
    border: 1px solid var(--vp-c-border);
    border-radius: 6px;
    overflow: hidden;
  }

  &-preview {
    display: grid;
    grid-template-columns: repeat(4, 1fr);

    &-tab-content {
      padding: 0;
    }

    @media (max-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
