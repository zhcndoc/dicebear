<script setup lang="ts">
import ClientOnly from '@theme/components/layout/ClientOnly.vue';
import Loader from './Loader.vue';
import Preview from './Preview.vue';
import nameList from '@theme/utils/name-list';

const names = [...nameList].sort(() => 0.5 - Math.random()).slice(0, 20);
</script>

<template>
  <ClientOnly>
    <template #default>
      <form autoComplete="off" @submit.prevent>
        <div class="playground">
          <Preview v-for="name in names" :name="name" />
        </div>
      </form>
    </template>
    <template #fallback>
      <Loader />
    </template>
  </ClientOnly>
</template>

<style scoped lang="scss">
.playground {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 32px 24px;
}
</style>
