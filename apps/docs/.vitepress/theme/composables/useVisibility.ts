import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export interface UseVisibilityOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useVisibility(
  selector: string | (() => Element | null),
  options: UseVisibilityOptions = {}
): Ref<boolean> {
  const { threshold = 0.2, rootMargin = '0px', once = true } = options;
  const isVisible = ref(false);
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    const element = typeof selector === 'function'
      ? selector()
      : document.querySelector(selector);

    if (!element) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true;
            if (once && observer) {
              observer.disconnect();
            }
          } else if (!once) {
            isVisible.value = false;
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return isVisible;
}
