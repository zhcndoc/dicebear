<script setup lang="ts">
import { onMounted, ref } from 'vue';

const canvas = ref<HTMLCanvasElement>();

onMounted(async () => {
  if (!canvas.value) return;

  const { default: confetti } = await import('canvas-confetti');

  const instance = confetti.create(canvas.value, {
    resize: true,
    disableForReducedMotion: true,
  });

  instance({
    particleCount: 35,
    angle: 60,
    spread: 40,
    startVelocity: 35,
    origin: { x: -0.1, y: 0.8 },
  });

  instance({
    particleCount: 35,
    angle: 120,
    spread: 40,
    startVelocity: 35,
    origin: { x: 1.1, y: 0.8 },
  });
});
</script>

<template>
  <canvas ref="canvas" class="confetti"></canvas>
</template>

<style scoped>
.confetti {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
