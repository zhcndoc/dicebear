<script setup lang="ts">
import UiAlert from '@theme/components/ui/UiAlert.vue';
import LicenseText from './LicenseText.vue';

defineProps<{
  styleName: string;
}>();
</script>

<template>
  <UiAlert type="info" class="dialog-license">
    <strong>
      Please note the following license before using the avatar:
    </strong>
    <LicenseText :style="styleName" />
  </UiAlert>
</template>
