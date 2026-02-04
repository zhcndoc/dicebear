<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const HomeHero = defineAsyncComponent(() => import('./HomeHero.vue'));
const HomeSeedDemo = defineAsyncComponent(() => import('./HomeSeedDemo.vue'));
const HomeStyleShowcase = defineAsyncComponent(() => import('./HomeStyleShowcase.vue'));
const HomeHighlights = defineAsyncComponent(() => import('./HomeHighlights.vue'));
const HomeEditor = defineAsyncComponent(() => import('./HomeEditor.vue'));
const HomeFrameworks = defineAsyncComponent(() => import('./HomeFrameworks.vue'));
const HomeCreateStyle = defineAsyncComponent(() => import('./HomeCreateStyle.vue'));
const HomeOpenSource = defineAsyncComponent(() => import('./HomeOpenSource.vue'));
const HomeUseCases = defineAsyncComponent(() => import('./HomeUseCases.vue'));
const HomeCTA = defineAsyncComponent(() => import('./HomeCTA.vue'));
</script>

<template>
  <div class="home-content">
    <HomeHero />
    <Suspense>
      <HomeSeedDemo />
    </Suspense>
    <Suspense>
      <HomeStyleShowcase />
    </Suspense>
    <Suspense>
      <HomeFrameworks />
    </Suspense>
    <Suspense>
      <HomeHighlights />
    </Suspense>
    <Suspense>
      <HomeUseCases />
    </Suspense>
    <Suspense>
      <HomeEditor />
    </Suspense>
    <Suspense>
      <HomeCreateStyle />
    </Suspense>
    <Suspense>
      <HomeOpenSource />
    </Suspense>
    <Suspense>
      <HomeCTA />
    </Suspense>
  </div>
</template>

<style scoped>
.home-content {
  width: 100%;
}
</style>
