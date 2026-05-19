<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { Search, X } from '@lucide/vue';
import { UiContainer, UiHeadline, UiDescription } from '@theme/components/ui';
import type { ThemeOptions } from '@theme/types';

const { theme } = useData<ThemeOptions>();

const sizes = theme.value.avatarStyleSizes;
const styleNames = Object.keys(theme.value.avatarStyles).sort();

const selected = ref<Set<string>>(new Set());
const filter = ref('');

const visibleStyles = computed(() => {
  const q = filter.value.toLowerCase().trim();
  if (!q) return styleNames;
  return styleNames.filter((name) => {
    const title = theme.value.avatarStyles[name]?.meta?.title?.toLowerCase() ?? '';
    return name.toLowerCase().includes(q) || title.includes(q);
  });
});

const selectedTotal = computed(() => {
  let raw = 0;
  let gzip = 0;
  for (const name of selected.value) {
    const s = sizes.styles[name];
    if (!s) continue;
    raw += s.raw;
    gzip += s.gzip;
  }
  return { raw, gzip };
});

const grandTotal = computed(() => ({
  raw: sizes.core.raw + selectedTotal.value.raw,
  gzip: sizes.core.gzip + selectedTotal.value.gzip,
}));

function toggle(name: string) {
  const next = new Set(selected.value);
  if (next.has(name)) next.delete(name);
  else next.add(name);
  selected.value = next;
}

function selectAll() {
  selected.value = new Set(styleNames);
}

function clear() {
  selected.value = new Set();
}

function formatSize(bytes: number): string {
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)} kB`;
  return `${bytes} B`;
}

function styleTitle(name: string): string {
  return theme.value.avatarStyles[name]?.meta?.title ?? name;
}
</script>

<template>
  <UiContainer size="sm" class="bundle-size-tool">
    <header class="bundle-size-tool-hero">
      <UiHeadline tag="h1">
        <strong>Bundle Size</strong> Estimator
      </UiHeadline>
      <UiDescription>
        See how much each style adds to your bundle. Numbers are taken straight from the installed <code>@dicebear/styles</code> package — what you'd ship to production.
      </UiDescription>
    </header>

    <section class="bundle-size-summary">
      <div class="bundle-size-summary-row">
        <span class="bundle-size-summary-label">@dicebear/core (all-included)</span>
        <span class="bundle-size-summary-values">
          <span class="bundle-size-summary-raw">{{ formatSize(sizes.core.raw) }}</span>
          <span class="bundle-size-summary-gzip">{{ formatSize(sizes.core.gzip) }} gzip</span>
        </span>
      </div>
      <div class="bundle-size-summary-row">
        <span class="bundle-size-summary-label">
          {{ selected.size }} style{{ selected.size === 1 ? '' : 's' }} selected
        </span>
        <span class="bundle-size-summary-values">
          <span class="bundle-size-summary-raw">{{ formatSize(selectedTotal.raw) }}</span>
          <span class="bundle-size-summary-gzip">{{ formatSize(selectedTotal.gzip) }} gzip</span>
        </span>
      </div>
      <div class="bundle-size-summary-row bundle-size-summary-row-total">
        <span class="bundle-size-summary-label">Total</span>
        <span class="bundle-size-summary-values">
          <span class="bundle-size-summary-raw">{{ formatSize(grandTotal.raw) }}</span>
          <span class="bundle-size-summary-gzip">{{ formatSize(grandTotal.gzip) }} gzip</span>
        </span>
      </div>
      <p class="bundle-size-summary-note">
        Core is shown as the full <code>lib/</code> output (no tree-shaking applied). Real-world bundles will be smaller depending on which APIs you actually import.
      </p>
    </section>

    <section class="bundle-size-picker">
      <div class="bundle-size-picker-toolbar">
        <div class="bundle-size-picker-search">
          <Search :size="16" />
          <InputText
            v-model="filter"
            placeholder="Filter styles…"
            class="bundle-size-picker-search-input"
            spellcheck="false"
          />
        </div>
        <div class="bundle-size-picker-actions">
          <Button label="Select all" severity="secondary" size="small" @click="selectAll" />
          <Button label="Clear" severity="secondary" variant="outlined" size="small" @click="clear">
            <template #icon><X :size="14" /></template>
          </Button>
        </div>
      </div>

      <ul class="bundle-size-list">
        <li
          v-for="name in visibleStyles"
          :key="name"
          class="bundle-size-row"
          :class="{ 'bundle-size-row-selected': selected.has(name) }"
        >
          <label class="bundle-size-row-label">
            <Checkbox
              :model-value="selected.has(name)"
              :binary="true"
              @update:model-value="toggle(name)"
            />
            <span class="bundle-size-row-title">{{ styleTitle(name) }}</span>
            <code class="bundle-size-row-slug">{{ name }}</code>
            <span class="bundle-size-row-values">
              <span class="bundle-size-row-raw">{{ formatSize(sizes.styles[name]?.raw ?? 0) }}</span>
              <span class="bundle-size-row-gzip">{{ formatSize(sizes.styles[name]?.gzip ?? 0) }} gzip</span>
            </span>
          </label>
        </li>
        <li v-if="visibleStyles.length === 0" class="bundle-size-empty">
          No styles match "{{ filter }}".
        </li>
      </ul>
    </section>
  </UiContainer>
</template>

<style lang="scss" scoped>
.bundle-size-tool {
  padding-top: 80px;
  padding-bottom: 96px;
  display: flex;
  flex-direction: column;
  gap: 28px;

  &-hero {
    text-align: center;
    max-width: 720px;
    margin: 0 auto 8px;

    code {
      background: var(--vp-c-bg-soft);
      padding: 2px 6px;
      border-radius: var(--vp-radius-xs);
      font-size: 0.9em;
    }
  }

  @media (max-width: 640px) {
    padding-top: 32px;
  }
}

.bundle-size-summary {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--ui-card-border-color, rgba(0, 0, 0, 0.06));
  border-radius: var(--vp-radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  &-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;

    &-total {
      padding-top: 14px;
      border-top: 1px solid var(--vp-c-divider);
    }
  }

  &-label {
    font-size: 13px;
    color: var(--ui-c-text-muted);
  }

  &-row-total &-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  &-values {
    display: flex;
    align-items: baseline;
    gap: 12px;
    font-variant-numeric: tabular-nums;
  }

  &-raw {
    font-size: 18px;
    font-weight: 700;
    color: var(--vp-c-text-1);
  }

  &-row-total &-raw {
    font-size: 22px;
  }

  &-gzip {
    font-size: 12px;
    color: var(--ui-c-text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &-note {
    margin: 0;
    padding-top: 4px;
    font-size: 12px;
    line-height: 1.55;
    color: var(--ui-c-text-subtle);

    code {
      background: var(--vp-c-bg-soft);
      padding: 1px 5px;
      border-radius: var(--vp-radius-xs);
      font-size: 0.95em;
    }
  }
}

.bundle-size-picker {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--ui-card-border-color, rgba(0, 0, 0, 0.06));
  border-radius: var(--vp-radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &-toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  &-search {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 200px;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    border-radius: var(--vp-radius-xs);
    padding: 4px 12px;

    svg {
      color: var(--ui-c-text-subtle);
      flex-shrink: 0;
    }

    &-input {
      flex: 1;
      border: none;
      background: transparent;

      :deep(input) {
        border: none;
        background: transparent;
        padding: 6px 0;
        box-shadow: none;
      }

      :deep(input:focus) {
        box-shadow: none;
      }
    }
  }

  &-actions {
    display: flex;
    gap: 8px;
  }
}

.bundle-size-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bundle-size-row {
  border-radius: var(--vp-radius-xs);
  transition: background-color var(--duration-fast) var(--ease-smooth);

  &:hover {
    background: var(--vp-c-bg-soft);
  }

  &-selected {
    background: var(--vp-c-brand-soft);

    &:hover {
      background: var(--vp-c-brand-soft);
    }
  }

  &-label {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    width: 100%;
    padding: 10px 12px;
    min-width: 0;
  }

  &-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-1);
  }

  &-slug {
    font-family: var(--vp-font-family-mono);
    font-size: 12px;
    color: var(--ui-c-text-subtle);
    background: var(--vp-c-bg-soft);
    padding: 2px 6px;
    border-radius: var(--vp-radius-xs);
  }

  &-values {
    display: flex;
    align-items: baseline;
    gap: 10px;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
    margin-left: auto;
  }

  &-raw {
    font-size: 13px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  &-gzip {
    font-size: 11px;
    color: var(--ui-c-text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    min-width: 70px;
    text-align: right;
  }
}

.bundle-size-empty {
  text-align: center;
  padding: 24px;
  color: var(--ui-c-text-subtle);
  font-size: 13px;
}

@media (max-width: 480px) {
  .bundle-size-row-label {
    flex-wrap: wrap;
    gap: 6px 12px;
  }
  .bundle-size-row-slug {
    display: none;
  }
}
</style>
