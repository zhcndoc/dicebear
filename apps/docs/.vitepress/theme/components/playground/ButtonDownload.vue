<script setup lang="ts">
import { Download } from 'lucide-vue-next';
import { getAvatarApiUrl } from '@theme/utils/avatar';
import { UiAvatar } from '../ui';
import Confetti from './Confetti.vue';
import PlaygroundDialog from './PlaygroundDialog.vue';
import LicenseAlert from './LicenseAlert.vue';
import { usePlaygroundDialog } from '@theme/composables/usePlaygroundDialog';
import { Tooltip } from '@ark-ui/vue/tooltip';
import { Menu } from '@ark-ui/vue/menu';

const props = defineProps<{
  seed: string;
}>();

const { store, open, confettiKey, options, showDialog } = usePlaygroundDialog(() => props.seed);

const menuItems = [
  { label: 'SVG', format: 'svg' },
  { label: 'PNG', format: 'png' },
  { label: 'JPEG', format: 'jpg' },
  { label: 'WebP', format: 'webp' },
  { label: 'AVIF', format: 'avif' },
];

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
</script>

<template>
  <Menu.Root>
    <Tooltip.Root>
      <Tooltip.Trigger as-child>
        <div>
          <Menu.Trigger class="button-download">
            <Download :size="16" />
          </Menu.Trigger>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content>Download</Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>

    <Menu.Positioner>
      <Menu.Content>
        <Menu.Item
          v-for="item in menuItems"
          :key="item.format"
          :value="item.format"
          @click="downloadBinary(item.format)"
        >
          {{ item.label }}
        </Menu.Item>
      </Menu.Content>
    </Menu.Positioner>
  </Menu.Root>

  <PlaygroundDialog v-model:open="open">
    <Confetti :key="confettiKey" />
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
      <LicenseAlert :style-name="store.avatarStyleName" />
    </div>
  </PlaygroundDialog>
</template>

<style scoped lang="scss">
.button-download {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
  }
}
</style>
