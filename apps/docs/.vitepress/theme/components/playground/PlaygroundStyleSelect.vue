<script setup lang="ts">
import { ref, computed } from 'vue';
import { capitalCase } from 'change-case';
import { useData } from 'vitepress';
import { storeToRefs } from 'pinia';
import { Search, X, Plus, Trash2 } from '@lucide/vue';
import ChevronRightIcon from '@primevue/icons/chevronright';
import { useStyleFiltering } from '@theme/composables/useStyleFiltering';
import useStore from '@theme/stores/playground';
import { ThemeOptions } from '@theme/types';
import { UiAvatar } from '../ui';
import PlaygroundCustomStyleUpload from './PlaygroundCustomStyleUpload.vue';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';

const store = useStore();
const { avatarStyleName, customStyles } = storeToRefs(store);
const { theme } = useData<ThemeOptions>();

const open = ref(false);
const uploadOpen = ref(false);

const {
  searchQuery,
  selectedCategory,
  availableCategories,
  groupedStyles,
  styleList,
  hasActiveFilters,
  clearFilters,
} = useStyleFiltering(theme.value.avatarStyles, customStyles);

function selectStyle(name: string) {
  avatarStyleName.value = name;
  open.value = false;
}

function onCustomStyleAdded(key: string) {
  uploadOpen.value = false;
  selectStyle(key);
}

function deleteCustomStyle(key: string, event: Event) {
  event.stopPropagation();
  store.removeCustomStyle(key);
}

const customStyleList = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();

  return Object.entries(store.customStyles)
    .map(([key, entry]) => ({ key, name: entry.name }))
    .filter((cs) => !query || cs.name.toLowerCase().includes(query));
});

const builtInGroupedStyles = computed(() => {
  const result: Record<string, (typeof groupedStyles.value)[string]> = {};

  for (const [category, styles] of Object.entries(groupedStyles.value)) {
    if (category !== 'Custom') {
      result[category] = styles;
    }
  }

  return result;
});

const currentDisplayName = computed(() => {
  if (store.isCustomStyle) {
    return store.customStyles[avatarStyleName.value]?.name ?? 'Custom Style';
  }

  return capitalCase(avatarStyleName.value);
});
</script>

<template>
  <button
    type="button"
    class="pg-style-select-trigger"
    @click="open = true"
  >
    <span class="pg-style-select-trigger-avatar">
      <UiAvatar
        :size="40"
        :style-name="avatarStyleName"
        :style-options="{ seed: 'JD' }"
        mode="library"
      />
    </span>

    <span class="pg-style-select-trigger-name">{{ currentDisplayName }}</span>

    <ChevronRightIcon class="pg-style-select-trigger-chevron" />
  </button>

  <Dialog
    v-model:visible="open"
    modal
    :closable="true"
    dismissable-mask
    header="Choose Avatar Style"
    :style="{ width: '900px' }"
    :pt="{ content: { class: 'pg-style-select-dialog-content' } }"
  >
    <div class="pg-style-select">
      <div class="pg-style-select-toolbar">
        <div class="pg-style-select-search">
          <Search :size="16" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search styles..."
            class="pg-style-select-search-input"
          />
        </div>

        <div class="pg-style-select-filters">
          <button
            v-for="category in availableCategories"
            :key="category"
            class="pg-style-select-chip"
            :class="{ 'pg-style-select-chip-active': selectedCategory === category }"
            @click="selectedCategory = selectedCategory === category ? null : category"
          >
            {{ category }}
          </button>
          <button
            v-if="hasActiveFilters"
            class="pg-style-select-chip pg-style-select-chip-clear"
            @click="clearFilters"
          >
            <X :size="12" />
            Clear
          </button>
        </div>
      </div>

      <div class="pg-style-select-body">
        <div
          v-if="!selectedCategory || selectedCategory === 'Custom'"
          class="pg-style-select-group"
        >
          <h3 class="pg-style-select-group-title">Custom</h3>
          <div class="pg-style-select-grid">
            <button
              class="pg-style-select-card pg-style-select-card-add"
              @click="uploadOpen = true"
            >
              <div class="pg-style-select-card-add-icon">
                <Plus :size="24" />
              </div>
              <span class="pg-style-select-card-name">Add Custom Style</span>
            </button>

            <div
              v-for="cs in customStyleList"
              :key="cs.key"
              class="pg-style-select-card"
              :class="{ 'pg-style-select-card-selected': cs.key === avatarStyleName }"
              @click="selectStyle(cs.key)"
            >
              <button
                class="pg-style-select-card-delete"
                @click="deleteCustomStyle(cs.key, $event)"
                v-tooltip="'Remove'"
              >
                <Trash2 :size="12" />
              </button>
              <div class="pg-style-select-card-avatars">
                <UiAvatar
                  v-for="seed in ['Felix', 'Aneka', 'Milo', 'Luna']"
                  :key="seed"
                  :size="40"
                  :style-name="cs.key"
                  :style-options="{ seed }"
                  mode="library"
                />
              </div>
              <div class="pg-style-select-card-info">
                <span class="pg-style-select-card-name">{{ cs.name }}</span>
                <Tag value="Custom" severity="warn" class="pg-style-select-card-tag" />
              </div>
            </div>
          </div>
        </div>

        <div
          v-for="(styles, category) in builtInGroupedStyles"
          :key="category"
          class="pg-style-select-group"
        >
          <h3 class="pg-style-select-group-title">{{ category }}</h3>
          <div class="pg-style-select-grid">
            <button
              v-for="style in styles"
              :key="style.name"
              class="pg-style-select-card"
              :class="{ 'pg-style-select-card-selected': style.name === avatarStyleName }"
              @click="selectStyle(style.name)"
            >
              <div class="pg-style-select-card-avatars">
                <UiAvatar
                  v-for="avatar in style.avatars"
                  :key="avatar.seed"
                  :size="40"
                  :style-name="style.name"
                  :style-options="{ seed: avatar.seed }"
                  mode="http-api"
                />
              </div>
              <div class="pg-style-select-card-info">
                <span class="pg-style-select-card-name">{{ style.displayName }}</span>
              </div>
              <span class="pg-style-select-card-creator">{{ style.creator }}</span>
            </button>
          </div>
        </div>

        <div v-if="styleList.length === 0 && searchQuery" class="pg-style-select-empty">
          No styles found matching "{{ searchQuery }}"
        </div>
      </div>
    </div>
  </Dialog>

  <PlaygroundCustomStyleUpload
    v-model:open="uploadOpen"
    @added="onCustomStyleAdded"
  />
</template>

<style scoped lang="scss">
.pg-style-select-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 16px 8px 8px;
  background: var(--p-content-background);
  border: 1px solid var(--pg-border);
  border-radius: var(--vp-radius-xs);
  color: var(--vp-c-text-1);
  cursor: pointer;
  text-align: left;
  transition: background-color var(--duration-fast);

  &:hover {
    background: var(--vp-c-bg-soft);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--p-form-field-focus-border-color);
  }

  &-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    background: var(--vp-c-bg-soft);
    border-radius: var(--vp-radius-xs);
    overflow: hidden;
  }

  &-name {
    flex: 1;
    min-width: 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--vp-c-text-1);
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-chevron {
    flex-shrink: 0;
    margin-left: auto;
    color: var(--p-accordion-header-toggle-icon-color);
  }
}

.pg-style-select {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pg-style-select-toolbar {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pg-style-select-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--vp-radius-xs);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-3);
  transition: border-color var(--duration-fast);

  &:focus-within {
    border-color: var(--vp-c-brand-1);
  }

  &-input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 8px 0;
    font-size: 14px;
    color: var(--vp-c-text-1);
    outline: none;

    &::placeholder {
      color: var(--vp-c-text-3);
    }
  }
}

.pg-style-select-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pg-style-select-chip {
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--vp-radius-md);
  cursor: pointer;
  transition: all var(--duration-fast);

  &:hover {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
  }

  &-active {
    background: var(--vp-c-brand-1);
    border-color: var(--vp-c-brand-1);
    color: white;

    &:hover {
      color: white;
    }
  }

  &-clear {
    display: flex;
    align-items: center;
    gap: 4px;
    border-style: dashed;
    color: var(--vp-c-text-3);

    &:hover {
      border-color: var(--vp-c-danger-1);
      color: var(--vp-c-danger-1);
    }
  }
}

.pg-style-select-body {
  max-height: 60vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pg-style-select-group-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
  margin: 0 0 8px;
}

.pg-style-select-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.pg-style-select-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--vp-c-bg-soft);
  border: 2px solid transparent;
  border-radius: var(--vp-radius-sm);
  cursor: pointer;
  text-align: left;
  transition: all var(--duration-fast);

  &:hover {
    border-color: var(--vp-c-brand-1);
  }

  &-selected {
    border-color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
  }

  &-avatars {
    display: flex;
    gap: 6px;
  }

  &-info {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  &-tag {
    font-size: 10px;
  }

  &-creator {
    font-size: 12px;
    color: var(--vp-c-text-3);
  }

  &-delete {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    border-radius: var(--vp-radius-xs);
    cursor: pointer;
    opacity: 0;
    transition: all var(--duration-fast);
    color: var(--vp-c-text-3);

    &:hover {
      color: var(--vp-c-danger-1);
      border-color: var(--vp-c-danger-1);
    }
  }

  &:hover &-delete {
    opacity: 1;
  }

  &-add {
    border-style: dashed;
    border-color: var(--vp-c-border);
    align-items: center;
    justify-content: center;
    min-height: 120px;

    &:hover {
      border-color: var(--vp-c-brand-1);
    }

    &-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--vp-c-bg);
      color: var(--vp-c-text-3);
      transition: all var(--duration-fast);
    }
  }

  &-add:hover &-add-icon {
    color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
  }
}

.pg-style-select-empty {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-3);
  font-size: 14px;
}

@media (max-width: 640px) {
  .pg-style-select-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}
</style>
