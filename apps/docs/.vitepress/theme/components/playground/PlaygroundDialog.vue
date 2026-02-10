<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { Dialog } from '@ark-ui/vue/dialog';

defineProps<{
  open: boolean;
  maxWidth?: string;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

function onOpenChange(details: { open: boolean }) {
  emit('update:open', details.open);
}
</script>

<template>
  <Dialog.Root :open="open" lazy-mount unmount-on-exit @open-change="onOpenChange">
    <Teleport to="body">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content class="dialog" :style="{ maxWidth: maxWidth || '540px', width: '100%' }">
          <button class="dialog-close-btn" @click="emit('update:open', false)" title="Close">
            <X :size="20" />
          </button>
          <slot />
        </Dialog.Content>
      </Dialog.Positioner>
    </Teleport>
  </Dialog.Root>
</template>
