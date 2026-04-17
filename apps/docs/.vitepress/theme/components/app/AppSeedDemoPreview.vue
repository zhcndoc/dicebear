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
          alt="Avatar preview"
          class="app-seed-demo-avatar-main"
          mode="library"
        />
      </a>
    </div>

    <button class="app-seed-demo-style-picker-trigger" @click="emit('openStylePicker')">
      <span class="app-seed-demo-style-picker-label">Style</span>
      <span class="app-seed-demo-style-picker-value">{{ style }}</span>
      <ChevronDown :size="14" />
    </button>

    <div class="app-seed-demo-seed-display">
      <span class="app-seed-demo-seed-label">Seed</span>
      <input
        class="app-seed-demo-seed-input"
        :value="seed"
        @input="onSeedInput"
        placeholder="Enter a seed…"
        spellcheck="false"
        autocomplete="off"
      />
      <button class="app-seed-demo-dice-btn" @click="emit('randomizeSeed')" title="Next seed">
        <Dice5 :size="16" />
      </button>
    </div>
  </div>
</template>
