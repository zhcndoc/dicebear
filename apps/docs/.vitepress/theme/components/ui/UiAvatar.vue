<script setup lang="ts">
import { createAvatar, StyleOptions } from '@dicebear/core';
import { getAvatarApiUrl, loadAvatarStyle } from '@theme/utils/avatar';
import { computedAsync } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    size?: number;
    styleName: string;
    styleOptions: StyleOptions<any>;
    mode?: 'library' | 'http-api';
    alt?: string;
  }>(),
  {
    mode: 'http-api',
    alt: 'avatar',
  }
);

const svg = computedAsync(() => {
  const styleName = props.styleName;
  const styleOptions = props.styleOptions;

  switch (props.mode) {
    case 'library':
      return loadAvatarStyle(styleName).then((avatarStyle) =>
        createAvatar(avatarStyle, styleOptions).toDataUri()
      );
    case 'http-api':
      return getAvatarApiUrl(styleName, styleOptions);
  }
});
</script>

<template>
  <div class="ui-avatar">
    <img :src="svg" v-if="svg" :alt="alt" loading="lazy" />
  </div>
</template>

<style>
:root {
  --ui-avatar-bg-1: rgba(0, 0, 0, 0.02);
  --ui-avatar-bg-2: rgba(0, 0, 0, 0.07);
}

.dark {
  --ui-avatar-bg-1: rgba(255, 255, 255, 0.02);
  --ui-avatar-bg-2: rgba(255, 255, 255, 0.07);
}
</style>

<style scoped>
.ui-avatar {
  width: calc(v-bind(size) * 1px);
  height: calc(v-bind(size) * 1px);
  border-radius: 3px;
  background: repeating-conic-gradient(
      var(--ui-avatar-bg-1) 0% 25%,
      var(--ui-avatar-bg-2) 0% 50%
    )
    50% / 12px 12px;
  line-height: 0;
  overflow: hidden;
}

.ui-avatar img {
  height: 100%;
  width: 100%;
}
</style>
