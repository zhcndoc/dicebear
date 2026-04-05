<script setup lang="ts">
import { UiAvatar } from '../ui';

defineProps<{
  styleName: string;
}>();

const seeds = [
  'Kane',
  'Alejandrin',
  'Derek',
  'Zoie',
  'Amie',
  'Yesenia',
  'Elna',
  'Annabelle',
];
</script>

<template>
  <div class="style-preview">
    <UiAvatar
      v-for="seed in seeds"
      :size="72"
      :style-name="styleName"
      :style-options="{ seed }"
      class="style-preview-img"
    />
  </div>
</template>

<style scoped lang="scss">
.style-preview {
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0 16px;
  gap: 8px;
}
</style>