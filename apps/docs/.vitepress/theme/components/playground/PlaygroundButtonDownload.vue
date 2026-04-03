<script setup lang="ts">
import { ref } from 'vue';
import { Download } from '@lucide/vue';
import { getAvatarApiUrl } from '@theme/utils/avatar';
import { UiAvatar } from '../ui';
import PlaygroundConfetti from './PlaygroundConfetti.vue';
import PlaygroundDialog from './PlaygroundDialog.vue';
import PlaygroundLicenseAlert from './PlaygroundLicenseAlert.vue';
import { usePlaygroundDialog } from '@theme/composables/usePlaygroundDialog';
import Button from 'primevue/button';
import Menu from 'primevue/menu';

const props = defineProps<{
  seed: string;
}>();

const { store, open, confettiKey, options, showDialog } = usePlaygroundDialog(() => props.seed);
const menu = ref();

async function downloadBinary(format: string) {
  showDialog();

  const response = await fetch(
    getAvatarApiUrl(store.avatarStyleName, options.value, format)
  );

  const blob = await response.blob();
  const file = URL.createObjectURL(blob);
  const timestamp = new Date().getTime();

  const link = document.createElement('a');
  link.href = file;
  link.download = `${store.avatarStyleName}-${timestamp}.${format}`;
  link.target = '_blank';
  link.click();
  link.remove();

  URL.revokeObjectURL(file);
}

const menuItems = [
  { label: 'SVG', command: () => downloadBinary('svg') },
  { label: 'PNG', command: () => downloadBinary('png') },
  { label: 'JPEG', command: () => downloadBinary('jpg') },
  { label: 'WebP', command: () => downloadBinary('webp') },
  { label: 'AVIF', command: () => downloadBinary('avif') },
];
</script>

<template>
  <Button label="Download" severity="secondary" @click="(e: Event) => menu.toggle(e)">
    <template #icon>
      <Download :size="15" />
    </template>
  </Button>
  <Menu ref="menu" :model="menuItems" :popup="true" />

  <PlaygroundDialog v-model:open="open">
    <PlaygroundConfetti :key="confettiKey" />
    <div class="dialog-preview">
      <UiAvatar
        :style-name="store.avatarStyleName"
        :style-options="options"
        :size="128"
      />
    </div>
    <div class="dialog-title">
      Your avatar will be downloaded! 🎉
    </div>
    <div class="dialog-subtitle">Please note the license below before using.</div>
    <div class="dialog-text">
      <PlaygroundLicenseAlert :style-name="store.avatarStyleName" />
    </div>
  </PlaygroundDialog>
</template>
