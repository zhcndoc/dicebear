<script setup lang="ts">
import AppSmallHero from '../app/AppSmallHero.vue';
import AppHighlights from '../app/AppHighlights.vue';
import AppIntegration from '../app/AppIntegration.vue';
import AppCDN from '../app/AppCDN.vue';
import AppComparison from '../app/AppComparison.vue';
import AppOpenSourceCards from '../app/AppOpenSourceCards.vue';
import AppFrameworks from '../app/AppFrameworks.vue';
import AppCTA from '../app/AppCTA.vue';
</script>

<template>
  <AppSmallHero />
  <AppHighlights badge="Features" headline="Everything You <strong>Need</strong>" />
  <AppIntegration />
  <AppCDN />
  <AppFrameworks />
  <AppComparison />
  <AppOpenSourceCards />
  <AppCTA />
</template>
