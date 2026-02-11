<script setup lang="ts">
import { ref, unref, computed } from 'vue';
import { UiAvatar } from '../ui';
import useStore from '@theme/stores/playground';
import PlaygroundButtonDownload from './PlaygroundButtonDownload.vue';
import PlaygroundButtonCopy from './PlaygroundButtonCopy.vue';
import PlaygroundButtonHowToUse from './PlaygroundButtonHowToUse.vue';

const props = defineProps<{
  name: string;
}>();

const store = useStore();
const seed = ref(props.name);

const styleOptions = computed(() => {
  return {
    ...unref(store.avatarStyleOptionsWithoutDefaults),
    seed: seed.value,
  };
});

const onInputFocus = (e: FocusEvent) => {
  const input = e.target as HTMLInputElement;
  requestAnimationFrame(() => {
    input.setSelectionRange(0, input.value.length);
  });
};
</script>

<template>
  <div class="playground-preview">
    <div class="playground-preview-avatar">
      <UiAvatar
        :size="96"
        :radius="10"
        :style-name="store.avatarStyleName"
        :style-options="styleOptions"
        mode="library"
      />
    </div>
    <input
      v-model="seed"
      type="text"
      placeholder="Enter a seed"
      class="playground-preview-input"
      @focus="onInputFocus"
    />
    <div class="playground-preview-actions">
      <div class="playground-preview-action"><PlaygroundButtonDownload :seed="seed" /></div>
      <div class="playground-preview-action"><PlaygroundButtonCopy :seed="seed" /></div>
      <div class="playground-preview-action"><PlaygroundButtonHowToUse :seed="seed" /></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playground-preview {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 20px 16px 16px;

  &-avatar {
    display: flex;
    justify-content: center;
    margin-bottom: 14px;
  }

  &-input {
    width: 100%;
    padding: 8px 12px;
    text-align: center;
    font-size: 14px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 6px;
    color: var(--vp-c-text-1);
    outline: none;
    transition: all 0.2s ease;

    &:hover {
      background: var(--vp-c-bg);
      border-color: var(--vp-c-border);
    }

    &:focus {
      background: var(--vp-c-bg);
      border-color: var(--vp-c-brand-1);
      box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
    }

    &::placeholder {
      color: var(--vp-c-text-3);
    }
  }

  &-actions {
    display: flex;
    gap: 6px;
    margin-top: 12px;
  }

  &-action {
    flex: 1;
    min-width: 0;
  }
}
</style>
