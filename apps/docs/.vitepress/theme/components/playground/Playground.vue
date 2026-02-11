<script setup lang="ts">
import LayoutClientOnly from '@theme/components/layout/LayoutClientOnly.vue';
import PlaygroundLoader from './PlaygroundLoader.vue';
import PlaygroundPreview from './PlaygroundPreview.vue';
import nameList from '@theme/utils/name-list';

const names = [...nameList].sort(() => 0.5 - Math.random()).slice(0, 20);
</script>

<template>
  <LayoutClientOnly>
    <template #default>
      <form autoComplete="off" @submit.prevent>
        <div class="playground">
          <PlaygroundPreview v-for="name in names" :name="name" />
        </div>
      </form>
    </template>
    <template #fallback>
      <PlaygroundLoader />
    </template>
  </LayoutClientOnly>
</template>

<style scoped lang="scss">
.playground {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 32px 24px;
}
</style>
