<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { getAvatarApiUrl } from '@shared/utils/avatar';

const props = defineProps<{
  size: number;
  styleName: string;
  styleOptions: Record<string, unknown>;
}>();

const url = computed(() => getAvatarApiUrl(props.styleName, props.styleOptions));
const container = ref<HTMLElement>();
const isVisible = ref(false);
const isLoaded = ref(false);

// Lazy load: nur src setzen wenn sichtbar
const src = computed(() => (isVisible.value ? url.value : undefined));

// Zeige Spinner nur wenn sichtbar und noch am Laden
const showSpinner = computed(() => isVisible.value && !isLoaded.value);

watch(url, () => {
  isLoaded.value = false;
});

function onLoad() {
  isLoaded.value = true;
}

let observer: IntersectionObserver | undefined;

onMounted(() => {
  if (!container.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        isVisible.value = true;
      }
    },
    { rootMargin: '100px' }
  );

  observer.observe(container.value);
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div ref="container" class="avatar">
    <div v-if="showSpinner" class="avatar-loader">
      <span class="avatar-spinner"></span>
    </div>
    <img
      v-if="src"
      :src="src"
      :class="{ 'avatar-loaded': isLoaded }"
      alt="avatar preview"
      @load="onLoad"
    />
  </div>
</template>

<style>
:root {
  --avatar-background-color-1: rgba(0, 0, 0, 0.02);
  --avatar-background-color-2: rgba(0, 0, 0, 0.07);
}

.dark {
  --avatar-background-color-1: rgba(255, 255, 255, 0.02);
  --avatar-background-color-2: rgba(255, 255, 255, 0.07);
}
</style>

<style scoped>
.avatar {
  position: relative;
  width: calc(v-bind(size) * 1px);
  height: calc(v-bind(size) * 1px);
  border-radius: 3px;
  background: repeating-conic-gradient(
      var(--avatar-background-color-1) 0% 25%,
      var(--avatar-background-color-2) 0% 50%
    )
    50% / 12px 12px;
  line-height: 0;
  overflow: hidden;
}

.avatar img {
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.avatar img.avatar-loaded {
  opacity: 1;
}

.avatar-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-spinner {
  width: 24%;
  height: 24%;
  min-width: 12px;
  min-height: 12px;
  max-width: 24px;
  max-height: 24px;
  border: 2px solid var(--avatar-background-color-2);
  border-top-color: var(--vp-c-brand-1, #646cff);
  border-radius: 50%;
  animation: avatar-spin 0.8s linear infinite;
}

@keyframes avatar-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
