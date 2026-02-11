<script setup lang="ts">
import { Copy } from 'lucide-vue-next';
import { ref } from 'vue';
import copy from 'copy-to-clipboard';
import { createAvatar } from '@dicebear/core';
import { loadAvatarStyle } from '@theme/utils/avatar';
import { UiAvatar } from '../ui';
import PlaygroundConfetti from './PlaygroundConfetti.vue';
import PlaygroundDialog from './PlaygroundDialog.vue';
import PlaygroundActionButton from './PlaygroundActionButton.vue';
import PlaygroundLicenseAlert from './PlaygroundLicenseAlert.vue';
import { usePlaygroundDialog } from '@theme/composables/usePlaygroundDialog';
import { Dialog } from '@ark-ui/vue/dialog';

const props = defineProps<{
  seed: string;
}>();

const { store, open, confettiKey, options, showDialog } = usePlaygroundDialog(() => props.seed);

const text = ref('');

async function onClick() {
  const avatarStyle = await loadAvatarStyle(store.avatarStyleName);
  const avatar = createAvatar(avatarStyle, {
    ...options.value,
    size: 512,
  });

  const successful = copy(avatar.toString());

  text.value = successful
    ? 'Your avatar was successfully copied! 🎉'
    : 'Your avatar could not be copied. 😞';

  showDialog();
}
</script>

<template>
  <PlaygroundActionButton tooltip="Copy" @click="onClick">
    <Copy :size="16" />
  </PlaygroundActionButton>

  <PlaygroundDialog v-model:open="open">
    <PlaygroundConfetti :key="confettiKey" />
    <div class="dialog-preview">
      <UiAvatar
        :style-name="store.avatarStyleName"
        :style-options="options"
        :size="128"
      />
    </div>
    <Dialog.Title class="dialog-title">{{ text }}</Dialog.Title>
    <div class="dialog-subtitle">Please note the license below before using.</div>
    <div class="dialog-text">
      <PlaygroundLicenseAlert :style-name="store.avatarStyleName" />
    </div>
  </PlaygroundDialog>
</template>
