<script setup lang="ts">
import { UiAvatar } from '../ui';

type SeedCard = { name: string; emoji: string };

defineProps<{
  style: string;
  seedCards: readonly SeedCard[];
  activeSeedIndex: number | null;
}>();

const emit = defineEmits<{
  selectSeed: [index: number];
}>();
</script>

<template>
  <div class="app-seed-demo-seeds">
    <button
      v-for="(card, index) in seedCards"
      :key="card.name"
      class="app-seed-demo-seed-card"
      :class="{ active: index === activeSeedIndex }"
      @click="emit('selectSeed', index)"
    >
      <UiAvatar
        :style-name="style"
        :style-options="{ seed: card.name, size: 96 }"
        :alt="card.name"
        class="app-seed-demo-seed-card-avatar"
      />
      <span class="app-seed-demo-seed-card-name">{{ card.name }}</span>
    </button>
  </div>
</template>
