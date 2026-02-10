<script setup lang="ts">
import { useRoute } from 'vitepress';
import { computed, ref, watch } from 'vue';
import PlaygroundSidebar from '@playground/Sidebar.vue';
import ClientOnly from './ClientOnly.vue';

const route = useRoute();

const isPlayground = computed(() => route.path.startsWith('/playground'));

const marker = ref<HTMLElement>();

watch(
  () => isPlayground.value,
  (newValue: boolean, oldValue: boolean) => {
    if (newValue !== oldValue) {
      marker.value?.parentElement?.parentElement?.scrollTo(0, 0);
    }
  }
);
</script>

<template>
  <div ref="marker"></div>
  <div v-if="isPlayground" class="sidebar-before">
    <ClientOnly>
      <form autoComplete="off" @submit.prevent>
        <PlaygroundSidebar />
      </form>
    </ClientOnly>
  </div>
</template>

<style>
.sidebar-before + * {
  display: none;
}
</style>
