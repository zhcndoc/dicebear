<script setup lang="ts">
import { useAvatarStyleMeta } from '@theme/composables/avatar';
import { capitalCase, kebabCase } from 'change-case';
import { computed } from 'vue';
import useStore from '@theme/stores/playground';

const store = useStore();

const avatarStyleKey = computed(() => store.avatarStyleName);
const avatarStyleMeta = useAvatarStyleMeta(avatarStyleKey);
const avatarStyleName = computed(() => capitalCase(store.avatarStyleName));
const avatarStyleLink = computed(
  () => `/styles/${kebabCase(store.avatarStyleName)}/`,
);
</script>

<template>
  <p class="playground-license-text">
    <template v-if="avatarStyleMeta?.creator !== 'DiceBear'">
      The avatar style
    </template>
    <a :href="avatarStyleLink">{{ avatarStyleName }}</a>
    <template v-if="avatarStyleMeta?.creator !== 'DiceBear'">
      <template
        v-if="
          avatarStyleMeta?.license?.name !== 'MIT' &&
          avatarStyleMeta?.creator !== 'DiceBear' &&
          avatarStyleMeta?.title
        "
      >
        is a remix of:
      </template>
      <template v-else> is based on: </template>
      <a
        :href="avatarStyleMeta?.source"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ avatarStyleMeta?.title ?? 'Design' }}
      </a>
    </template>
    by
    <a
      :href="avatarStyleMeta?.homepage"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ avatarStyleMeta?.creator }} </a
    >, licensed under
    <a
      :href="avatarStyleMeta?.license?.url"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ avatarStyleMeta?.license?.name.replace(/\.$/, '') }}
    </a>
    .
  </p>
</template>

<style scoped lang="scss">
.playground-license-text {
  a {
    font-weight: 500;
    color: var(--vp-c-brand-1);
    text-decoration-style: dotted;
    transition: color var(--duration-fast);
    cursor: pointer;

    &:hover {
      color: var(--vp-c-brand-2);
    }
  }
}
</style>
