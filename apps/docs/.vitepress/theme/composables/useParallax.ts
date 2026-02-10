import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue';

export function useParallax(isVisible: Ref<boolean>) {
  const mouseX = ref(0.5);
  const mouseY = ref(0.5);
  const targetMouseX = ref(0.5);
  const targetMouseY = ref(0.5);
  let animationFrameId: number | null = null;

  function handleMouseMove(e: MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    targetMouseX.value = (e.clientX - rect.left) / rect.width;
    targetMouseY.value = (e.clientY - rect.top) / rect.height;
  }

  function animate() {
    if (!isVisible.value) {
      animationFrameId = null;
      return;
    }
    const lerp = 0.08;
    mouseX.value += (targetMouseX.value - mouseX.value) * lerp;
    mouseY.value += (targetMouseY.value - mouseY.value) * lerp;
    animationFrameId = requestAnimationFrame(animate);
  }

  function start() {
    if (animationFrameId === null) {
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  watch(isVisible, (visible) => {
    if (visible) start();
  });

  onMounted(() => {
    if (isVisible.value) start();
  });

  onUnmounted(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  });

  return { mouseX, mouseY, handleMouseMove };
}
