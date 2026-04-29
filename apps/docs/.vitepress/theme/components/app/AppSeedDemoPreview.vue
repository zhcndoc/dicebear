<script setup lang="ts">
import { computed } from 'vue';
import { Dice5, ChevronDown } from '@lucide/vue';
import { UiAvatar } from '../ui';

const props = defineProps<{
  style: string;
}>();

const seed = defineModel<string>({ required: true });

const emit = defineEmits<{
  openStylePicker: [];
  randomizeSeed: [];
}>();

const mainAvatarLink = computed(
  () => `https://api.dicebear.com/10.x/${props.style}/svg?seed=${encodeURIComponent(seed.value)}`,
);

function onSeedInput(event: Event) {
  const input = event.target as HTMLInputElement;
  seed.value = input.value;
}
</script>

<template>
  <div class="app-seed-demo-showcase">
    <div class="app-seed-demo-avatar-stage">
      <div class="app-seed-demo-avatar-glow"></div>
      <a :href="mainAvatarLink" target="_blank" rel="noopener">
        <UiAvatar
          :style-name="style"
          :style-options="{ seed, size: 256 }"
          alt="头像预览"
          class="app-seed-demo-avatar-main"
          mode="library"
        />
      </a>
    </div>

    <button class="app-seed-demo-style-picker-trigger" @click="emit('openStylePicker')">
      <span class="app-seed-demo-style-picker-label">风格</span>
      <span class="app-seed-demo-style-picker-value">{{ style }}</span>
      <ChevronDown :size="14" />
    </button>

    <div class="app-seed-demo-seed-display">
      <span class="app-seed-demo-seed-label">种子</span>
      <input
        class="app-seed-demo-seed-input"
        :value="seed"
        @input="onSeedInput"
        placeholder="输入一个种子…"
        spellcheck="false"
        autocomplete="off"
      />
      <button class="app-seed-demo-dice-btn" @click="emit('randomizeSeed')" title="下一个种子">
        <Dice5 :size="16" />
      </button>
    </div>
  </div>
</template>
