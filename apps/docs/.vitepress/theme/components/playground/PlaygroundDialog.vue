<script setup lang="ts">
import { computed } from 'vue';
import Dialog from 'primevue/dialog';

const props = defineProps<{
  open: boolean;
  maxWidth?: string;
  header?: string;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const visible = computed({
  get: () => props.open,
  set: (val: boolean) => emit('update:open', val),
});
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="true"
    :header="header || ' '"
    :style="{ width: maxWidth || '540px' }"
    :pt="{
      content: { class: 'playground-dialog-content' },
    }"
  >
    <slot />
  </Dialog>
</template>
