<script setup lang="ts">
import HomeHero from './HomeHero.vue';
import HomeSeedDemo from './HomeSeedDemo.vue';
import HomeStyleShowcase from './HomeStyleShowcase.vue';
import HomeHighlights from './HomeHighlights.vue';
import HomeIntegration from './HomeIntegration.vue';
import HomeOpenSource from './HomeOpenSource.vue';
import HomeCTA from './HomeCTA.vue';
</script>

<template>
  <div class="home-content">
    <HomeHero />
    <HomeSeedDemo />
    <HomeStyleShowcase />
    <HomeHighlights />
    <HomeIntegration />
    <HomeOpenSource />
    <HomeCTA />
  </div>
</template>

<style scoped>
.home-content {
  width: 100%;
}
</style>
