<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { kebabCase } from 'change-case';
import { RotateCcw } from '@lucide/vue';
import PlaygroundOptions from './PlaygroundOptions.vue';
import PlaygroundPreviewPanel from './PlaygroundPreviewPanel.vue';
import useStore from '@theme/stores/playground';
import Button from 'primevue/button';

const store = useStore();
const { seed } = storeToRefs(store);

// ?style= query param overrides persisted style (used by "Open in Playground" links)
const styleParam = new URL(window.location.href).searchParams.get('style');

if (styleParam) {
  const styleName = kebabCase(styleParam);

  if (store.availableAvatarStyles.includes(styleName)) {
    store.avatarStyleName = styleName;
    store.resetOptions();
  }

  history.replaceState(null, '', window.location.pathname);
}
</script>

<template>
  <div class="pg">
    <div class="pg-body">
      <aside class="pg-sidebar">
        <PlaygroundOptions v-model:seed="seed" />
      </aside>
      <main class="pg-main">
        <div class="pg-main-actions">
          <Button
            label="Reset"
            severity="secondary"
            variant="link"
            size="small"
            class="pg-field-reset"
            @click="store.resetOptions"
          >
            <template #icon>
              <RotateCcw :size="14" />
            </template>
          </Button>
        </div>

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

  @media (min-width: 861px) {
    padding-top: 10px;
  }
}

.pg-main {
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (min-width: 861px) {
    position: sticky;
    top: 80px;
    align-self: start;
  }

  @media (max-width: 860px) {
    order: -1;
  }

  &-actions {
    display: flex;
    justify-content: flex-end;
    gap: 4px;

    :deep(.p-button-link) {
      color: var(--ui-c-text-muted);
    }

    :deep(.p-button-link:hover .p-button-label) {
      text-decoration: none;
    }
  }
}
</style>
