<script setup lang="ts">
import { ref } from 'vue';
import { Download } from '@lucide/vue';
import { Avatar } from '@dicebear/core';
import { getAvatarApiUrl } from '@theme/utils/avatar/api';
import { loadAvatarStyle, clonePlain } from '@theme/utils/avatar/style';
import { UiAvatar } from '../ui';
import PlaygroundConfetti from './PlaygroundConfetti.vue';
import PlaygroundDialog from './PlaygroundDialog.vue';
import PlaygroundLicenseAlert from './PlaygroundLicenseAlert.vue';
import { usePlaygroundDialog } from '@theme/composables/usePlaygroundDialog';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { DIALOG_PREVIEW_AVATAR_SIZE, DOWNLOAD_AVATAR_SIZE } from './constants';

const props = defineProps<{
  seed: string;
}>();

const { store, open, confettiKey, options, showDialog } = usePlaygroundDialog(() => props.seed);
const menu = ref();

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function downloadSvg() {
  showDialog();

  const avatarStyle = await loadAvatarStyle(store.avatarStyleName);
  const avatar = new Avatar(avatarStyle, clonePlain({
    ...options.value,
    size: DOWNLOAD_AVATAR_SIZE,
  }));

  const blob = new Blob([avatar.toString()], { type: 'image/svg+xml' });
  triggerDownload(blob, `${store.avatarStyleName}-${Date.now()}.svg`);
}

async function downloadBinary(format: string) {
  showDialog();

  const response = await fetch(
    getAvatarApiUrl(store.avatarStyleName, options.value, format)
  );

  const blob = await response.blob();
  triggerDownload(blob, `${store.avatarStyleName}-${Date.now()}.${format}`);
}

const menuItems = [
  { label: 'SVG', command: () => downloadSvg() },
  { label: 'PNG', command: () => downloadBinary('png') },
  { label: 'JPEG', command: () => downloadBinary('jpg') },
  { label: 'WebP', command: () => downloadBinary('webp') },
  { label: 'AVIF', command: () => downloadBinary('avif') },
];

function onDownloadClick(e: Event) {
  if (store.isCustomStyle) {
    downloadSvg();
  } else {
    menu.value.toggle(e);
  }
}
</script>

<template>
  <Button :label="store.isCustomStyle ? 'Download SVG' : 'Download'" severity="secondary" variant="outlined" @click="onDownloadClick">
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
        :size="DIALOG_PREVIEW_AVATAR_SIZE"
        mode="library"
      />
    </div>
    <div class="dialog-title">
      Your avatar will be downloaded! 🎉
    </div>
    <div class="dialog-subtitle">Please note the license below before using.</div>
    <div class="dialog-text">
      <PlaygroundLicenseAlert />
    </div>
  </PlaygroundDialog>
</template>
