<script setup lang="ts">
import { ref, provide } from 'vue';
import { storeToRefs } from 'pinia';
import { kebabCase } from 'change-case';
import { RotateCcw, Link } from '@lucide/vue';
import PlaygroundOptions from './PlaygroundOptions.vue';
import PlaygroundPreviewPanel from './PlaygroundPreviewPanel.vue';
import useStore from '@theme/stores/playground';
import { compressFragment, decompressFragment } from '@theme/utils/avatar/fragment';
import Button from 'primevue/button';
import { COPY_LINK_RESET_MS, FRAGMENT_PREFIX } from './constants';

type FragmentPayload = {
  style?: string;
  options?: Record<string, unknown>;
};

const store = useStore();
const { avatarStyleName, seed } = storeToRefs(store);

const initialOptions = ref<Record<string, unknown>>({});

// ?style= query param overrides persisted style (used by "Open in Playground" links)
const styleParam = new URL(window.location.href).searchParams.get('style');

if (styleParam) {
  const styleName = kebabCase(styleParam);

  if (store.availableAvatarStyles.includes(styleName)) {
    avatarStyleName.value = styleName;
    store.resetOptions();
  }

  history.replaceState(null, '', window.location.pathname);
}

async function importFragment() {
  const hash = window.location.hash;

  if (!hash.startsWith(FRAGMENT_PREFIX)) {
    return;
  }

  try {
    const payload = (await decompressFragment(hash.slice(FRAGMENT_PREFIX.length))) as FragmentPayload;

    store.resetOptions();

    if (payload.style && store.availableAvatarStyles.includes(payload.style)) {
      avatarStyleName.value = payload.style;
    }

    if (payload.options && typeof payload.options === 'object') {
      initialOptions.value = payload.options;
    }
  } catch {
    // Invalid fragment — ignore, use defaults
  }

  history.replaceState(null, '', window.location.pathname);
}

importFragment();

provide('initialOptions', initialOptions);

const linkCopied = ref(false);

async function copyLink() {
  const payload: Record<string, unknown> = {
    style: avatarStyleName.value,
    options: store.avatarStyleOptionsWithoutDefaults,
  };

  const encoded = await compressFragment(payload);
  const url = `${window.location.origin}${window.location.pathname}${FRAGMENT_PREFIX}${encoded}`;

  await navigator.clipboard.writeText(url);

  linkCopied.value = true;

  setTimeout(() => {
    linkCopied.value = false;
  }, COPY_LINK_RESET_MS);
}
</script>

<template>
  <div class="pg">
    <div class="pg-body">
      <aside class="pg-sidebar">
        <PlaygroundOptions v-model:seed="seed">
          <template #style-actions>
            <Button
              :label="linkCopied ? 'Copied!' : 'Copy Link'"
              severity="secondary"
              variant="link"
              size="small"
              :disabled="store.isCustomStyle"
              v-tooltip="store.isCustomStyle ? 'Custom styles cannot be shared via link' : undefined"
              @click="copyLink"
            >
              <template #icon>
                <Link :size="14" />
              </template>
            </Button>
            <Button
              label="Reset"
              severity="secondary"
              variant="link"
              size="small"
              @click="store.resetOptions"
            >
              <template #icon>
                <RotateCcw :size="14" />
              </template>
            </Button>
          </template>
        </PlaygroundOptions>
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
    padding-top: 12px;
  }

  @media (max-width: 860px) {
    order: -1;
  }
}
</style>
