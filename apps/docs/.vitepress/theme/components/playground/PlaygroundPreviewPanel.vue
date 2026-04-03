<script setup lang="ts">
import { computed } from 'vue';
import { UiAvatar } from '../ui';
import useStore from '@theme/stores/playground';
import PlaygroundLicenseText from './PlaygroundLicenseText.vue';
import PlaygroundButtonDownload from './PlaygroundButtonDownload.vue';
import PlaygroundButtonCopy from './PlaygroundButtonCopy.vue';
import PlaygroundButtonHowToUse from './PlaygroundButtonHowToUse.vue';

const props = defineProps<{
  seed: string;
}>();

const store = useStore();

const styleOptions = computed(() => ({
  ...store.avatarStyleOptionsWithoutDefaults,
  seed: props.seed,
}));
</script>

<template>
  <div class="pg-preview">
    <div class="pg-preview-canvas">
      <UiAvatar
        :size="320"
        :style-name="store.avatarStyleName"
        :style-options="styleOptions"
        mode="library"
        class="pg-preview-avatar"
      />
    </div>

    <div class="pg-preview-actions">
      <PlaygroundButtonDownload :seed="seed" />
      <PlaygroundButtonCopy :seed="seed" />
      <PlaygroundButtonHowToUse :seed="seed" />
    </div>

    <div class="pg-preview-license">
      <PlaygroundLicenseText />
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.pg-preview-canvas {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 40px 24px;
  border-radius: var(--vp-radius-sm);
  border: 1px solid var(--pg-border);
  background:
    repeating-conic-gradient(
      var(--vp-c-bg-soft) 0% 25%,
      var(--vp-c-bg) 0% 50%
    ) 50% / 20px 20px;
}

.pg-preview-avatar {
  --ui-avatar-bg-1: transparent;
  --ui-avatar-bg-2: transparent;
}

.pg-preview-actions {
  display: flex;
  gap: 8px;
  width: 100%;

  :deep(> *) {
    flex: 1;
  }

  :deep(button) {
    width: 100%;
    justify-content: center;
  }
}

.pg-preview-license {
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-3);
  text-align: center;
}
</style>
