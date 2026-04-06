<script setup lang="ts">
import PlaygroundDialog from '../playground/PlaygroundDialog.vue';
import { UiAvatar } from '../ui';

defineProps<{
  open: boolean;
  avatars: Array<{ index: number; style: string; seed: string }>;
  activeStyleIndex: number;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  selectStyle: [index: number];
}>();

function onSelect(index: number) {
  emit('selectStyle', index);
  emit('update:open', false);
}
</script>

<template>
  <PlaygroundDialog :open="open" @update:open="$emit('update:open', $event)" max-width="640px">
    <div class="app-seed-demo-style-picker">
      <h3 class="app-seed-demo-style-picker-title">Choose Avatar Style</h3>
      <p class="app-seed-demo-style-picker-subtitle">Select a style to preview with your current seed</p>
      <div class="app-seed-demo-style-picker-grid">
        <button
          v-for="avatar in avatars"
          :key="avatar.style"
          class="app-seed-demo-style-picker-item"
          :class="{ active: avatar.index === activeStyleIndex }"
          @click="onSelect(avatar.index)"
        >
          <UiAvatar :style-name="avatar.style" :style-options="{ seed: avatar.seed, size: 96 }" :alt="avatar.style" />
          <span class="app-seed-demo-style-picker-label">{{ avatar.style }}</span>
        </button>
      </div>
    </div>
  </PlaygroundDialog>
</template>

<style lang="scss" scoped>
.app-seed-demo-style-picker {
  padding: 28px;

  &-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--vp-c-text-1);
    margin: 0 0 4px;
  }

  &-subtitle {
    font-size: 14px;
    color: var(--vp-c-text-2);
    margin: 0 0 24px;
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
    gap: 12px;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 4px;
  }

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 8px;
    border: 2px solid transparent;
    border-radius: var(--vp-radius-sm);
    background: var(--vp-c-bg-soft);
    cursor: pointer;
    transition: all var(--duration-fast) ease;

    &:hover {
      border-color: var(--vp-c-border);
      transform: translateY(-2px);
    }

    &.active {
      border-color: var(--vp-c-brand-1);
      background: var(--vp-c-brand-soft);

      .app-seed-demo-style-picker-label {
        color: var(--vp-c-brand-1);
        font-weight: 600;
      }
    }

    img {
      width: 56px;
      height: 56px;
      border-radius: var(--vp-radius-xs);
      object-fit: cover;
    }
  }

  &-label {
    font-size: 11px;
    color: var(--vp-c-text-2);
    font-weight: 500;
    max-width: 80px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 480px) {
  .app-seed-demo-style-picker {
    padding: 20px;

    &-grid {
      grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
      gap: 8px;
    }

    &-item img {
      width: 48px;
      height: 48px;
    }
  }
}
</style>
