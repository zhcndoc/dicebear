<script setup lang="ts">
import { useData } from 'vitepress';
import { ThemeOptions } from '@theme/types';
import { useStyleFiltering } from '@theme/composables/useStyleFiltering';
import { Search, CircleUser, Scale, ArrowRight, Filter, X } from '@lucide/vue';
import { UiAvatar } from '../ui';

const { theme } = useData<ThemeOptions>();

const {
  searchQuery,
  selectedLicense,
  selectedCategory,
  availableLicenses,
  availableCategories,
  styleList,
  groupedStyles,
  totalStyles,
  hasActiveFilters,
  clearFilters,
} = useStyleFiltering(theme.value.avatarStyles);
</script>

<template>
  <div class="style-list">
    <div class="style-list-filters">
      <div class="style-list-filter-row">
        <div class="style-list-filter-group style-list-filter-group-search">
          <span class="style-list-filter-label">
            <Search />
            Search
          </span>
          <div class="style-list-search">
            <input
              v-model="searchQuery"
              type="text"
              class="style-list-search-input"
              :placeholder="`Search ${totalStyles} styles...`"
            />
          </div>
        </div>

        <div class="style-list-filter-group">
          <span class="style-list-filter-label">
            <Filter />
            Category
          </span>
          <div class="style-list-filter-chips">
            <button
              v-for="category in availableCategories"
              :key="category"
              class="style-list-filter-chip"
              :class="{ 'style-list-filter-chip-active': selectedCategory === category }"
              @click="selectedCategory = selectedCategory === category ? null : category"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <div class="style-list-filter-group">
          <span class="style-list-filter-label">
            <Scale />
            License
          </span>
          <div class="style-list-filter-chips">
            <button
              v-for="license in availableLicenses"
              :key="license"
              class="style-list-filter-chip"
              :class="{ 'style-list-filter-chip-active': selectedLicense === license }"
              @click="selectedLicense = selectedLicense === license ? null : license"
            >
              {{ license }}
            </button>
          </div>
        </div>
      </div>

      <div class="style-list-filter-footer">
        <button v-if="hasActiveFilters" class="style-list-clear-filters" @click="clearFilters">
          <X />
          Clear filters
        </button>
      </div>
    </div>

    <div v-for="(styles, category) in groupedStyles" :key="category" class="style-list-category">
      <h2 class="style-list-category-title">{{ category }}</h2>
      <div class="style-list-grid">
        <a
          v-for="style in styles"
          :key="style.name"
          :href="`/styles/${style.slug}/`"
          class="style-list-card"
        >
          <div class="style-list-card-avatars">
            <div
              v-for="avatar in style.avatars"
              :key="avatar.seed"
              class="style-list-card-avatar"
            >
              <UiAvatar :style-name="style.slug" :style-options="{ seed: avatar.seed, size: 80 }" :alt="`${style.displayName} - ${avatar.seed}`" />
            </div>
          </div>

          <div class="style-list-card-content">
            <h3 class="style-list-card-name">{{ style.displayName }}</h3>

            <div class="style-list-card-meta">
              <span class="style-list-card-creator">
                <CircleUser />
                {{ style.creator }}
              </span>
              <span class="style-list-card-license">
                <Scale />
                {{ style.license }}
              </span>
            </div>
          </div>

          <div class="style-list-card-arrow">
            <ArrowRight />
          </div>
        </a>
      </div>
    </div>

    <div v-if="styleList.length === 0" class="style-list-empty">
      <p v-if="searchQuery">No styles found matching "{{ searchQuery }}"</p>
      <p v-else>No styles found with the selected filters</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.style-list {
  margin-top: 32px;

  &-filters {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 32px;
    padding: 24px;
    background: var(--vp-c-bg-soft);
    border-radius: var(--vp-radius-sm);
  }

  &-filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
    align-items: flex-start;
  }

  &-filter-group {
    display: flex;
    flex-direction: column;
    gap: 10px;

    &-search {
      flex: 1;
      min-width: 200px;
      max-width: 300px;
    }
  }

  &-filter-footer {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &-filter-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--vp-c-text-2);
    text-transform: uppercase;
    letter-spacing: 0.5px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &-filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &-filter-chip {
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 500;
    color: var(--vp-c-text-2);
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    border-radius: var(--vp-radius-lg);
    cursor: pointer;
    transition: all var(--duration-fast) ease;

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
  }

  &-clear-filters {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 500;
    color: var(--vp-c-text-3);
    background: transparent;
    border: 1px dashed var(--vp-c-border);
    border-radius: var(--vp-radius-lg);
    cursor: pointer;
    transition: all var(--duration-fast) ease;

    &:hover {
      border-color: var(--vp-c-danger-1);
      color: var(--vp-c-danger-1);
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }

  &-category {
    margin-bottom: 48px;

    &-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--vp-c-text-1);
      margin: 0 0 20px;
      border-top: 0 !important;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--vp-c-border);
    }
  }

  &-search {
    display: flex;
    align-items: center;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    border-radius: var(--vp-radius-lg);
    padding: 0 14px;
    transition: all var(--duration-fast) ease;

    &:focus-within {
      border-color: var(--vp-c-brand-1);
      box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
    }

    &-input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 6px 0;
      font-size: 13px;
      font-weight: 500;
      color: var(--vp-c-text-1);
      outline: none;
      min-width: 0;

      &::placeholder {
        color: var(--vp-c-text-3);
      }
    }
  }

  &-count {
    font-size: 14px;
    color: var(--vp-c-text-2);
    font-weight: 500;
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
  }

  &-card {
    display: flex;
    flex-direction: column;
    background: var(--vp-c-bg-soft);
    border-radius: var(--vp-radius-md);
    padding: 20px;
    text-decoration: none;
    transition: all var(--duration-fast) ease;
    border: 2px solid transparent;
    position: relative;

    &::after {
      display: none !important;
    }

    &:hover {
      border-color: var(--vp-c-brand-1);
      transform: translateY(-4px);
      box-shadow: var(--vp-shadow-3);
    }

    &-avatars {
      display: flex;
      gap: 10px;
      margin-bottom: 16px;
    }

    &-avatar {
      width: 64px;
      height: 64px;
      border-radius: var(--vp-radius-sm);
      overflow: hidden;
      background: var(--vp-c-bg);
      box-shadow: var(--vp-shadow-1);
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &-content {
      flex: 1;
    }

    &-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--vp-c-text-1);
      margin: 0 0 8px;
    }

    &-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    &-creator,
    &-license {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--vp-c-text-2);

      svg {
        width: 16px;
        height: 16px;
        color: var(--vp-c-text-3);
      }
    }

    &-arrow {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--vp-c-bg);
      border-radius: var(--vp-radius-xs);
      opacity: 0;
      transform: translateX(-8px);
      transition: all var(--duration-fast) ease;

      svg {
        width: 18px;
        height: 18px;
        color: var(--vp-c-brand-1);
      }
    }

    &:hover &-arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &-empty {
    text-align: center;
    padding: 60px 24px;
    color: var(--vp-c-text-2);

    p {
      margin: 0;
      font-size: 16px;
    }
  }

  @media (max-width: 640px) {
    &-filter-row {
      flex-direction: column;
      gap: 20px;
    }

    &-filter-group {
      width: 100%;

      &-search {
        max-width: none;
      }
    }

    &-category-title {
      font-size: 20px;
    }

    &-grid {
      grid-template-columns: 1fr;
    }

    &-card-arrow {
      display: none;
    }
  }
}
</style>
