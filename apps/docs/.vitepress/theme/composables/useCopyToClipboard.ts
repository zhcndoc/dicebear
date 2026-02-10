import { ref } from 'vue';

export function useCopyToClipboard(timeout = 2000) {
  const copiedId = ref<string | null>(null);

  function copy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    copiedId.value = id;
    setTimeout(() => {
      copiedId.value = null;
    }, timeout);
  }

  function isCopied(id: string) {
    return copiedId.value === id;
  }

  return { copiedId, copy, isCopied };
}
