<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useThrottleFn } from '@vueuse/core';
import { kebabCase } from 'change-case';
import Prando from 'prando';
import { UiAvatar } from '../ui';
import { useAvatarStyleList } from '../../composables/avatar';

type ScreenSize = 'mobile' | 'tablet' | 'desktop';

const GRID_CONFIG: Record<ScreenSize, { cols: number; rows: number }> = {
  mobile: { cols: 5, rows: 5 },
  tablet: { cols: 6, rows: 5 },
  desktop: { cols: 7, rows: 6 },
};

const BACKGROUND_SEEDS = [
  'Luna', 'Max', 'Sophie', 'Felix', 'Emma', 'Leo', 'Mia', 'Noah',
  'Aria', 'Liam', 'Zoe', 'Oscar', 'Ivy', 'Jack', 'Ruby', 'Finn',
];

const avatarStyleList = useAvatarStyleList();
const screenSize = ref<ScreenSize>('desktop');

function updateScreenSize() {
  const width = window.innerWidth;

  if (width < 768) {
    screenSize.value = 'mobile';
  } else if (width < 1024) {
    screenSize.value = 'tablet';
  } else {
    screenSize.value = 'desktop';
  }
}

const floatingAvatars = computed(() => {
  const prng = new Prando(777);
  const styles = avatarStyleList.value;
  const { cols, rows } = GRID_CONFIG[screenSize.value];
  const avatars = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = row * cols + col;
      const style = kebabCase(styles[i % styles.length]);
      const seed = BACKGROUND_SEEDS[i % BACKGROUND_SEEDS.length];
      const baseX = (col / cols) * 100 + (prng.next() * 10 - 5);
      const baseY = (row / rows) * 100 + (prng.next() * 10 - 5);

      avatars.push({
        style,
        seed,
        x: baseX,
        y: baseY,
        size: 48 + prng.next() * 32,
        delay: prng.next() * 3,
        duration: 8 + prng.next() * 8,
        parallaxFactor: 0.5 + prng.next() * 1.5,
      });
    }
  }

  return avatars;
});

const throttledUpdateScreenSize = useThrottleFn(updateScreenSize, 200);

onMounted(() => {
  updateScreenSize();
  window.addEventListener('resize', throttledUpdateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', throttledUpdateScreenSize);
});
</script>

<template>
  <div class="app-hero-bg">
    <div
      v-for="(avatar, index) in floatingAvatars"
      :key="index"
      class="app-hero-floating-avatar"
      :style="{
        left: `${avatar.x}%`,
        top: `${avatar.y}%`,
        width: `${avatar.size}px`,
        height: `${avatar.size}px`,
        animationDelay: `${avatar.delay}s`,
        animationDuration: `${avatar.duration}s`,
        '--parallax-factor': avatar.parallaxFactor,
      }"
    >
      <UiAvatar :style-name="avatar.style" :style-options="{ seed: avatar.seed, size: 80 }" :alt="avatar.style" />
    </div>
  </div>
</template>
