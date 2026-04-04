<script setup lang="ts">
import Message from 'primevue/message';
import PlaygroundLicenseText from './PlaygroundLicenseText.vue';

defineProps<{
  styleName: string;
}>();
</script>

<template>
  <Message severity="secondary" :closable="false" class="playground-license-alert">
    <strong>
      Please note the following license before using the avatar:
    </strong>
    <PlaygroundLicenseText :style="styleName" />
  </Message>
</template>

<style scoped lang="scss">
.playground-license-alert {
  :deep(strong) {
    display: block;
    margin-bottom: 4px;
    font-weight: 600;
  }
}
</style>
