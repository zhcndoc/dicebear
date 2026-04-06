import { watch, onMounted, onUnmounted, type Ref } from 'vue';

export function useParallax(isVisible: Ref<boolean>) {
  let containerEl: HTMLElement | null = null;
  let targetMouseX = 0.5;
  let targetMouseY = 0.5;
  let currentX = 0.5;
  let currentY = 0.5;
  let animationFrameId: number | null = null;

  function setContainer(el: HTMLElement) {
    containerEl = el;
  }

  function handleMouseMove(e: MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    targetMouseX = (e.clientX - rect.left) / rect.width;
    targetMouseY = (e.clientY - rect.top) / rect.height;
  }

  function animate() {
    if (!isVisible.value) {
      animationFrameId = null;

      return;
    }

    const lerp = 0.08;
    currentX += (targetMouseX - currentX) * lerp;
    currentY += (targetMouseY - currentY) * lerp;

    if (containerEl) {
      containerEl.style.setProperty('--parallax-x', String(currentX));
      containerEl.style.setProperty('--parallax-y', String(currentY));
    }

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

  return { setContainer, handleMouseMove };
}
