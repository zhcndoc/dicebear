<script setup lang="ts">
defineProps<{
  size?: 'default' | 'narrow' | 'wide';
}>();
</script>

<template>
  <div class="ui-container" :class="size && `ui-container-${size}`">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.ui-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  &-narrow {
    max-width: 800px;
  }

  &-wide {
    max-width: 1400px;
  }
}
</style>
