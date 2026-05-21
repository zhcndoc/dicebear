<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useData } from 'vitepress';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import SelectButton from 'primevue/selectbutton';
import Textarea from 'primevue/textarea';
import { Download, Shuffle } from '@lucide/vue';
import JSZip from 'jszip';
import { Avatar } from '@dicebear/core';
import {
  UiAvatar,
  UiContainer,
  UiHeadline,
  UiDescription,
  UiStyleSelect,
} from '@theme/components/ui';
import { loadAvatarStyle } from '@theme/utils/avatar/style';
import { triggerDownload } from '@theme/utils/download';
import type { ThemeOptions } from '@theme/types';

const SEED_CAP = 500;
const PREVIEW_LIMIT = 12;

type Mode = 'paste' | 'random';

const { theme } = useData<ThemeOptions>();

const availableStyles = computed(() =>
  Object.keys(theme.value.avatarStyles).sort(),
);
const selectedStyle = ref<string>(availableStyles.value[0] ?? '');

const mode = ref<Mode>('random');
const modeOptions: { label: string; value: Mode }[] = [
  { label: 'Random', value: 'random' },
  { label: 'Paste', value: 'paste' },
];
const seedsInput = ref('');
const randomCount = ref(12);
const randomSeeds = ref<string[]>([]);

function generateRandomSeeds(n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    out.push(crypto.randomUUID().replaceAll('-', '').slice(0, 10));
  }
  return out;
}

function shuffleRandom() {
  randomSeeds.value = generateRandomSeeds(randomCount.value);
}

shuffleRandom();

watch(mode, (m) => {
  if (m === 'random' && randomSeeds.value.length === 0) {
    shuffleRandom();
  }
});

watch(randomCount, (n) => {
  if (mode.value === 'random' && Number.isFinite(n) && n > 0) {
    randomSeeds.value = generateRandomSeeds(Math.min(n, SEED_CAP));
  }
});

const seeds = computed<string[]>(() => {
  if (mode.value === 'paste') {
    return seedsInput.value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }
  return randomSeeds.value;
});

const seedCount = computed(() => seeds.value.length);
const overCap = computed(() => seedCount.value > SEED_CAP);
const previewSeeds = computed(() => seeds.value.slice(0, PREVIEW_LIMIT));

const isGenerating = ref(false);
const progress = ref({ done: 0, total: 0 });
const errorMessage = ref('');

const canGenerate = computed(
  () =>
    !isGenerating.value &&
    seedCount.value > 0 &&
    !overCap.value &&
    !!selectedStyle.value,
);

const generateLabel = computed(() => {
  if (isGenerating.value) {
    return `Bundling ${progress.value.done} / ${progress.value.total}…`;
  }
  if (seedCount.value === 0) return 'Add seeds to begin';
  return `Download ${seedCount.value} SVG${seedCount.value === 1 ? '' : 's'} as ZIP`;
});

// Some ancestor (likely VitePress local search or a PrimeVue listener) is
// suppressing the default Enter newline in capture phase. Manually insert the
// newline so the textarea behaves normally regardless of who calls
// preventDefault upstream.
async function onTextareaEnter(event: KeyboardEvent) {
  event.preventDefault();
  event.stopPropagation();
  const ta = event.target as HTMLTextAreaElement;
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  seedsInput.value = ta.value.slice(0, start) + '\n' + ta.value.slice(end);
  await nextTick();
  ta.selectionStart = ta.selectionEnd = start + 1;
  ta.scrollTop = ta.scrollHeight;
}

function safeName(seed: string, used: Set<string>): string {
  // eslint-disable-next-line no-control-regex
  const cleaned = seed.replace(/[/\\:*?"<>|\x00-\x1f]/g, '-').slice(0, 200);
  const base = cleaned || 'avatar';
  let name = `${base}.svg`;
  let i = 2;
  while (used.has(name)) name = `${base}-${i++}.svg`;
  used.add(name);
  return name;
}

async function generate() {
  if (!canGenerate.value) return;

  isGenerating.value = true;
  errorMessage.value = '';
  progress.value = { done: 0, total: seedCount.value };

  try {
    const style = await loadAvatarStyle(selectedStyle.value);
    const zip = new JSZip();
    const used = new Set<string>();

    for (const seed of seeds.value) {
      const svg = new Avatar(style, { seed }).toString();
      zip.file(safeName(seed, used), svg);
      progress.value = { done: progress.value.done + 1, total: seedCount.value };
      if (progress.value.done % 25 === 0) {
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(blob, `${selectedStyle.value}-avatars.zip`);
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : String(err);
  } finally {
    isGenerating.value = false;
  }
}
</script>

<template>
  <UiContainer size="sm" class="batch-tool">
    <header class="batch-tool-hero">
      <UiHeadline tag="h1">
        <strong>Batch</strong> Download
      </UiHeadline>
      <UiDescription>
        Pick a style, point it at a list of seeds, get a ZIP of SVGs.
      </UiDescription>
    </header>

    <article class="batch-tool-workspace">
      <header class="batch-tool-top-bar">
        <UiStyleSelect
          v-model="selectedStyle"
          :styles="availableStyles"
          :value-avatar-size="28"
          :option-avatar-size="28"
          aria-label="Avatar style"
          class="batch-tool-style-select"
        />
        <SelectButton
          v-model="mode"
          :options="modeOptions"
          option-label="label"
          option-value="value"
          :allow-empty="false"
          size="small"
          aria-label="Seed source"
        />
      </header>

      <section class="batch-tool-section">

        <div v-if="mode === 'random'" class="batch-tool-random">
          <div class="batch-tool-random-count">
            <InputNumber
              v-model="randomCount"
              :min="1"
              :max="SEED_CAP"
              :step="1"
              :show-buttons="true"
              button-layout="horizontal"
              :input-style="{ width: '5em', textAlign: 'center' }"
              decrement-button-class="batch-tool-step-button"
              increment-button-class="batch-tool-step-button"
              aria-label="Number of random seeds"
            >
              <template #incrementicon>+</template>
              <template #decrementicon>−</template>
            </InputNumber>
            <span class="batch-tool-random-count-suffix">
              random seed{{ randomCount === 1 ? '' : 's' }}
            </span>
            <button
              type="button"
              class="batch-tool-shuffle"
              @click="shuffleRandom"
              aria-label="Regenerate random seeds"
            >
              <Shuffle :size="14" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>

        <div v-else class="batch-tool-paste">
          <Textarea
            id="batch-seeds"
            v-model="seedsInput"
            :rows="8"
            placeholder="One seed per line — a username, email, user ID, anything."
            class="batch-tool-textarea"
            spellcheck="false"
            autocomplete="off"
            fluid
            @keydown.enter="onTextareaEnter"
          />
          <span
            class="batch-tool-counter"
            :class="{ 'is-over': overCap }"
          >
            {{ seedCount }} / {{ SEED_CAP }}
          </span>
        </div>

        <p v-if="overCap" class="batch-tool-hint is-error">
          That's more than the {{ SEED_CAP }}-seed cap. Trim the list and try again.
        </p>
      </section>

      <section v-if="previewSeeds.length > 0" class="batch-tool-section batch-tool-preview-section">
        <header class="batch-tool-section-header">
          <span class="batch-tool-eyebrow">Preview</span>
          <span class="batch-tool-preview-count">
            <span v-if="seedCount > PREVIEW_LIMIT">
              first {{ previewSeeds.length }} of {{ seedCount }}
            </span>
            <span v-else>
              all {{ seedCount }} avatar{{ seedCount === 1 ? '' : 's' }}
            </span>
          </span>
        </header>

        <ul class="batch-tool-preview-grid">
          <li
            v-for="seed in previewSeeds"
            :key="seed"
            class="batch-tool-preview-tile"
          >
            <div class="batch-tool-preview-tile-avatar">
              <UiAvatar
                :size="72"
                :style-name="selectedStyle"
                :style-options="{ seed }"
                mode="library"
              />
            </div>
            <code class="batch-tool-preview-tile-seed">{{ seed }}</code>
          </li>
        </ul>
      </section>

      <footer class="batch-tool-footer">
        <Button
          :label="generateLabel"
          :disabled="!canGenerate"
          :loading="isGenerating"
          size="large"
          @click="generate"
        >
          <template #icon><Download :size="16" /></template>
        </Button>
        <p v-if="errorMessage" class="batch-tool-hint is-error">
          {{ errorMessage }}
        </p>
      </footer>
    </article>
  </UiContainer>
</template>

<style lang="scss">
html.dark {
  .batch-tool-workspace,
  .batch-tool-top-bar,
  .batch-tool-preview-section,
  .batch-tool-footer {
    background: var(--vp-c-bg-soft);
  }

  .batch-tool-step-button {
    background: var(--p-form-field-background);
  }
}
</style>

<style lang="scss" scoped>
.batch-tool {
  padding-top: 80px;
  padding-bottom: 96px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  &-hero {
    text-align: center;
    max-width: 640px;
    margin: 0 auto;
  }

  @media (max-width: 640px) {
    padding-top: 32px;
  }
}

.batch-tool-eyebrow {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--ui-c-text-subtle);
}

.batch-tool-workspace {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--ui-card-border-color, rgba(0, 0, 0, 0.06));
  border-radius: var(--vp-radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.batch-tool-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  background: var(--vp-c-bg-elv);
  border-bottom: 1px solid var(--vp-c-divider);
}

.batch-tool-style-select {
  flex: 1;
  min-width: 0;
  max-width: 320px;
}

.batch-tool-section {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  & + & {
    border-top: 1px solid var(--vp-c-divider);
  }

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
}

.batch-tool-random {
  display: flex;
  align-items: center;
  gap: 16px;

  &-count {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  &-count-suffix {
    font-size: 14px;
    color: var(--ui-c-text-muted);
  }
}

.batch-tool-shuffle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding: 8px 14px;
  background: transparent;
  border: 1px dashed var(--vp-c-border);
  border-radius: var(--vp-radius-xs);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ui-c-text-muted);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);

  &:hover {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
    border-style: solid;
  }

  &:active svg {
    transform: rotate(-20deg);
  }

  svg {
    transition: transform var(--duration-fast) var(--ease-smooth);
  }
}

.batch-tool-paste {
  position: relative;
  display: flex;
  flex-direction: column;
}

.batch-tool-textarea {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.55;
  min-height: 180px;
  resize: vertical;
}

.batch-tool-counter {
  align-self: flex-end;
  margin-top: 8px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-c-text-subtle);

  &.is-over {
    color: var(--vp-c-danger-1, #dc2626);
    font-weight: 600;
  }
}

.batch-tool-hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--ui-c-text-subtle);

  &.is-error {
    color: var(--vp-c-danger-1, #dc2626);
  }
}

.batch-tool-preview-section {
  background: var(--vp-c-bg-elv);
}

.batch-tool-preview-count {
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-c-text-muted);
}

.batch-tool-preview-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.batch-tool-preview-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px 10px;
  margin: 0;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--vp-radius-sm);
  transition: transform var(--duration-fast) var(--ease-smooth);
  animation: batch-tool-tile-in var(--duration-mid, 0.4s) var(--ease-smooth) both;

  &-avatar {
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      linear-gradient(45deg, var(--vp-c-bg-soft) 25%, transparent 25%) 0 0/8px 8px,
      linear-gradient(-45deg, var(--vp-c-bg-soft) 25%, transparent 25%) 0 0/8px 8px,
      var(--vp-c-bg);
    border-radius: var(--vp-radius-xs);
    overflow: hidden;
  }

  &-seed {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: var(--vp-font-family-mono);
    font-size: 11px;
    color: var(--ui-c-text-muted);
    padding: 0;
    background: transparent;
  }
}

@keyframes batch-tool-tile-in {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.batch-tool-footer {
  padding: 24px;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--vp-c-bg-elv);

  :deep(.p-button) {
    width: 100%;
    justify-content: center;
    padding: 14px 20px;
    font-weight: 600;
    letter-spacing: 0.01em;
  }
}

@media (max-width: 640px) {
  .batch-tool-top-bar {
    flex-direction: column;
    align-items: stretch;
    padding: 14px 18px;
  }
  .batch-tool-style-select {
    max-width: none;
  }
  .batch-tool-section,
  .batch-tool-footer {
    padding: 18px;
  }
  .batch-tool-random {
    flex-wrap: wrap;
  }
  .batch-tool-shuffle {
    margin-left: 0;
  }
}
</style>
