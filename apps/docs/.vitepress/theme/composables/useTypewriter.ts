import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export function useTypewriter(
  taglines: string[],
  options: { typeSpeed?: number; deleteSpeed?: number; pauseMs?: number } = {},
): { displayedText: Ref<string> } {
  const { typeSpeed = 100, deleteSpeed = 40, pauseMs = 2500 } = options;

  const displayedText = ref('');
  const currentIndex = ref(0);
  const isDeleting = ref(false);
  let timeout: ReturnType<typeof setTimeout>;

  function tick() {
    const fullText = taglines[currentIndex.value];

    if (!isDeleting.value) {
      displayedText.value = fullText.substring(
        0,
        displayedText.value.length + 1,
      );

      if (displayedText.value === fullText) {
        timeout = setTimeout(() => {
          isDeleting.value = true;
          tick();
        }, pauseMs);

        return;
      }
    } else {
      displayedText.value = fullText.substring(
        0,
        displayedText.value.length - 1,
      );

      if (displayedText.value === '') {
        isDeleting.value = false;
        currentIndex.value = (currentIndex.value + 1) % taglines.length;
      }
    }

    timeout = setTimeout(tick, isDeleting.value ? deleteSpeed : typeSpeed);
  }

  onMounted(() => tick());
  onUnmounted(() => clearTimeout(timeout));

  return { displayedText };
}
