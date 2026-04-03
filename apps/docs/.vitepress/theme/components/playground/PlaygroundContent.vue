<script setup lang="ts">
import { ref, computed, provide } from 'vue';
import { capitalCase } from 'change-case';
import { useData } from 'vitepress';
import { storeToRefs } from 'pinia';
import { RotateCcw, Link } from '@lucide/vue';
import PlaygroundOptions from './PlaygroundOptions.vue';
import PlaygroundPreviewPanel from './PlaygroundPreviewPanel.vue';
import useStore from '@theme/stores/playground';
import { ThemeOptions } from '@theme/types';
import { UiAvatar } from '../ui';
import { serializePlaygroundParams } from '@theme/utils/avatar';
import Select from 'primevue/select';
import Button from 'primevue/button';

const store = useStore();
const { avatarStyleName } = storeToRefs(store);
const data = useData<ThemeOptions>();

// Read URL params once on init, then clear them from the address bar
const urlParams = new URL(window.location.href).searchParams;
const seed = ref(urlParams.get('seed') ?? 'Felix');
const initialUrlParams = new URLSearchParams(urlParams);

if (initialUrlParams.toString()) {
  history.replaceState(null, '', window.location.pathname);
}

const styleOptions = computed(() =>
  Object.keys(data.theme.value.avatarStyles)
    .sort()
    .map((key) => ({ value: key, label: capitalCase(key) })),
);

function resetOptions() {
  for (const key of Object.keys(store.avatarStyleOptions)) {
    delete store.avatarStyleOptions[key];
  }
}

// Provide initial URL params to PlaygroundOptions for deferred application
provide('initialUrlParams', initialUrlParams);

const linkCopied = ref(false);

async function copyLink() {
  const params = serializePlaygroundParams(
    avatarStyleName.value,
    seed.value,
    store.avatarStyleOptionsWithoutDefaults,
  );

  const url = `${window.location.origin}${window.location.pathname}?${params}`;

  await navigator.clipboard.writeText(url);

  linkCopied.value = true;
  setTimeout(() => { linkCopied.value = false; }, 2000);
}

</script>

<template>
  <div class="pg">
    <header class="pg-header">
      <Select
        v-model="avatarStyleName"
        :options="styleOptions"
        option-label="label"
        option-value="value"
        class="pg-header-style"
      >
        <template #value="{ value }">
          <div class="pg-header-style-item" v-if="value">
            <UiAvatar :size="20" :style-name="value" :style-options="{ seed: 'JD' }" mode="library" />
            <span>{{ capitalCase(value) }}</span>
          </div>
        </template>
        <template #option="{ option }">
          <div class="pg-header-style-item">
            <UiAvatar :size="20" :style-name="option.value" :style-options="{ seed: 'JD' }" mode="http-api" />
            <span>{{ option.label }}</span>
          </div>
        </template>
      </Select>

      <div class="pg-header-actions">
        <Button
          :label="linkCopied ? 'Copied!' : 'Copy Link'"
          severity="secondary"
          @click="copyLink"
        >
          <template #icon>
            <Link :size="15" />
          </template>
        </Button>
        <Button
          label="Reset"
          severity="secondary"
          @click="resetOptions"
        >
          <template #icon>
            <RotateCcw :size="15" />
          </template>
        </Button>
      </div>
    </header>

    <div class="pg-body">
      <aside class="pg-sidebar">
        <PlaygroundOptions v-model:seed="seed" />
      </aside>
      <main class="pg-main">
        <PlaygroundPreviewPanel :seed="seed" />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px 48px;
}

.pg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--pg-border);

  &-style {
    min-width: 200px;
  }

  &-style-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &-actions {
    display: flex;
    gap: 8px;
  }
}

.pg-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
}

.pg-sidebar {
  min-width: 0;
}

.pg-main {
  @media (min-width: 861px) {
    position: sticky;
    top: 80px;
    align-self: start;
  }

  @media (max-width: 860px) {
    order: -1;
  }
}
</style>
