<script setup lang="ts">
import type { JSONSchema7, JSONSchema7Type } from 'json-schema';
import { computed } from 'vue';
import { AvatarStyle } from '@theme/types';
import { UiCode as Code } from '../ui';
import StyleOptionsPreview from './StyleOptionsPreview.vue';
import StyleOptionsTag from './StyleOptionsTag.vue';
import { getAvatarApiUrl } from '@theme/utils/avatar';
import { Tabs } from '@ark-ui/vue/tabs';

const props = defineProps<{
  style: AvatarStyle;
  styleName: string;
  name: string;
  value: JSONSchema7;
}>();

const naturalSort = (a: string | number, b: string | number) => {
  return a.toString().localeCompare(b.toString(), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

const initialValueTab = computed(() => {
  if (examples.value !== undefined) return 'examples';
  if (possibleValues.value.length > 0) return 'values';
  if (defaultValue.value !== undefined) return 'default';
  return undefined;
});

const reduce = (v: JSONSchema7Type) => {
  if (typeof v === 'string' || typeof v === 'number') {
    return v;
  }

  return v ? 'true' : 'false';
};

const defaultValue = computed(() => {
  if (Array.isArray(props.value.default)) {
    return props.value.default.map(reduce).sort(naturalSort);
  }

  return props.value.default;
});

const possibleValues = computed(() => {
  const items = props.value.items;

  if (typeof items === 'object' && 'enum' in items && items.enum) {
    return items.enum
      .filter((v) => {
        return (
          typeof v === 'string' ||
          typeof v === 'number' ||
          typeof v === 'boolean'
        );
      })
      .map(reduce)
      .sort(naturalSort) as (string | number | boolean)[];
  }

  if (props.value.enum) {
    return props.value.enum
      .filter((v) => {
        return (
          typeof v === 'string' ||
          typeof v === 'number' ||
          typeof v === 'boolean'
        );
      })
      .map(reduce)
      .sort(naturalSort) as (string | number | boolean)[];
  }

  return [];
});

const examples = computed(() => {
  if (props.name.match(/Probability$/)) {
    return [0, 100];
  }

  if (props.name === 'backgroundColor') {
    return ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'];
  }

  if (props.name === 'seed') {
    return ['Felix', 'Aneka'];
  }

  if (props.name === 'flip') {
    return [false, true];
  }

  if (props.name === 'rotate') {
    return [0, 90, 180, 270];
  }

  if (props.name === 'scale') {
    return [50, 100, 200];
  }

  if (props.name === 'radius') {
    return [0, 10, 20, 30, 40, 50];
  }

  if (props.name === 'size') {
    return [32, 48, 64, 80, 96];
  }

  if (props.name === 'translateX') {
    return [-50, -25, 0, 25, 50];
  }

  if (props.name === 'translateY') {
    return [-50, -25, 0, 25, 50];
  }
});

const itemPattern = computed(() => {
  const items = props.value.items;

  if (typeof items === 'object' && 'pattern' in items) {
    return items.pattern;
  }
});

const codeExampleValue = computed(() => {
  const isArray = props.value.type === 'array';

  if (examples.value) {
    return isArray ? examples.value.slice(0, 3) : examples.value[0];
  }

  if (possibleValues.value.length > 0) {
    return isArray ? possibleValues.value.slice(0, 3) : possibleValues.value[0];
  }

  if (Array.isArray(defaultValue.value)) {
    return isArray ? defaultValue.value.slice(0, 3) : defaultValue.value[0];
  }

  return defaultValue.value;
});

const exampleHttpApi = computed(() => {
  return getAvatarApiUrl(props.styleName, {
    [props.name]: codeExampleValue.value,
  });
});

const exampleJsLibrary = computed(() => {
  return `createAvatar(${props.styleName}, {
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
</script>

<template>
  <h3 :id="headerId" tabindex="-1" class="style-options-row-title">
    {{ name }}
    <Badge
      type="warning"
      text="deprecated"
      v-if="['fontFamily', 'fontSize', 'chars', 'fontWeight'].includes(name)"
    />
    <a class="header-anchor" :href="`#${headerId}`" aria-hidden="true"></a>
  </h3>

  <StyleOptionsTag name="Type" :value="value.type" />
  <StyleOptionsTag
    name="Minimum"
    :value="value.minimum"
    v-if="value.minimum !== undefined"
  />
  <StyleOptionsTag
    name="Maximum"
    :value="value.maximum"
    v-if="value.maximum !== undefined"
  />
  <StyleOptionsTag
    name="Item Pattern"
    :value="itemPattern"
    v-if="itemPattern !== undefined"
  />
  <StyleOptionsTag
    name="Max Items"
    :value="value.maxItems"
    v-if="value.maxItems !== undefined"
  />

  <p v-if="name === 'seed'">
    The seed determines the initial value for the built-in
    <a
      href="https://en.wikipedia.org/wiki/Pseudorandom_number_generator"
      rel="noopener noreferrer"
      target="_blank"
      >PRNG</a
    >. With the PRNG you can create the same avatar over and over again based.
  </p>

  <div
    class="warning custom-block"
    v-if="['fontWeight', 'fontFamily'].includes(name)"
  >
    <p class="custom-block-title">WARNING</p>
    <p>This option is not supported by the HTTP-API for PNG and JPEG.</p>
  </div>

  <p v-if="name === 'backgroundRotation'">
    Specify an array of two numbers for this option. The PRNG will generate a
    number between the two values, which will be used as the rotation degree.
    The rotation is only visible if <code>backgroundType</code> is set to
    <code>['gradientLinear']</code>.
  </p>

  <p v-if="name !== 'backgroundRotation' && name.endsWith('Rotation')">
    Specify an array of two numbers for this option. The PRNG will generate a
    number between the two values, which will be used as the rotation degree.
  </p>

  <p v-if="name.endsWith('OffsetX') || name.endsWith('OffsetY')">
    Specify an array of two numbers for this option. The PRNG will generate a
    number between the two values, which will be used as offset.
  </p>

  <p v-if="name === 'randomizeIds'">
    This option randomize the IDs in the generated SVG / XML. This can be useful
    for example if the avatars are included directly in the HTML and you want to
    avoid ID collisions.
  </p>

  <div class="style-options-row-card">
    <Tabs.Root :default-value="initialValueTab">
      <Tabs.List>
        <Tabs.Trigger value="examples" v-if="examples !== undefined">Examples</Tabs.Trigger>
        <Tabs.Trigger value="values" v-if="possibleValues.length > 0">Possible Values</Tabs.Trigger>
        <Tabs.Trigger value="default" v-if="defaultValue !== undefined">Default</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="examples" v-if="examples !== undefined">
        <div class="style-options-row-preview">
          <StyleOptionsPreview
            v-for="(val, key) in examples"
            :key="key"
            :style-name="styleName"
            :name="name"
            :value="val"
          />
        </div>
      </Tabs.Content>
      <Tabs.Content value="values" v-if="possibleValues.length > 0">
        <div class="style-options-row-preview">
          <StyleOptionsPreview
            v-for="(val, key) in possibleValues"
            :key="key"
            :style-name="styleName"
            :name="name"
            :value="val"
          />
        </div>
      </Tabs.Content>
      <Tabs.Content value="default" v-if="defaultValue !== undefined">
        <div class="style-options-row-preview">
          <StyleOptionsPreview
            v-if="Array.isArray(defaultValue)"
            v-for="(val, key) in defaultValue"
            :key="key"
            :style-name="styleName"
            :name="name"
            :value="val"
          />
          <StyleOptionsPreview
            v-else
            :style-name="styleName"
            :name="name"
            :value="defaultValue"
          />
        </div>
      </Tabs.Content>
    </Tabs.Root>
  </div>

  <div class="style-options-row-card">
    <Tabs.Root default-value="http-api">
      <Tabs.List>
        <Tabs.Trigger value="http-api">HTTP-API</Tabs.Trigger>
        <Tabs.Trigger value="js-library">JS-Library</Tabs.Trigger>
        <Tabs.Trigger value="cli">CLI</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="http-api">
        <Code class="style-options-row-code" :code="exampleHttpApi" />
      </Tabs.Content>
      <Tabs.Content value="js-library">
        <Code class="style-options-row-code" lang="js" :code="exampleJsLibrary" />
      </Tabs.Content>
      <Tabs.Content value="cli">
        <Code class="style-options-row-code" :code="exampleCli" />
      </Tabs.Content>
    </Tabs.Root>
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
    display: flex;
    flex-wrap: wrap;
    margin: 0 -9px -9px;
    align-items: start;
  }
}
</style>
