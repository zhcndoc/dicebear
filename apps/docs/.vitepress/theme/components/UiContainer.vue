<script setup lang="ts">
defineProps<{
  size?: 'default' | 'narrow' | 'wide';
}>();
</script>

<template>
  <div class="ui-container" :class="size">
    <slot />
  </div>
</template>

<style scoped>
.ui-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.ui-container.narrow {
  max-width: 800px;
}

.ui-container.wide {
  max-width: 1400px;
}
</style>
