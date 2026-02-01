<script setup lang="ts">
import { ref, computed } from 'vue';
import { useData } from 'vitepress';
import { ThemeOptions } from '@shared/types';
import { kebabCase, capitalCase } from 'change-case';
import { mdiMagnify, mdiAccountCircle, mdiLicense, mdiArrowRight } from '@mdi/js';

const { theme } = useData<ThemeOptions>();
const styles = theme.value.avatarStyles;

const searchQuery = ref('');

const seeds = ['Felix', 'Aneka', 'Milo', 'Luna'];

const styleList = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();

  return Object.entries(styles)
    .map(([styleName, style]) => ({
      name: styleName,
      displayName: capitalCase(styleName),
      slug: kebabCase(styleName),
      creator: style.meta.creator || 'Unknown',
      license: style.meta.license?.name || 'Unknown',
      avatars: seeds.map(seed => ({
        seed,
        src: `https://api.dicebear.com/9.x/${kebabCase(styleName)}/svg?seed=${seed}&size=80`
      }))
    }))
    .filter(style =>
      !query ||
      style.displayName.toLowerCase().includes(query) ||
      style.creator.toLowerCase().includes(query)
    )
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
});

const totalStyles = computed(() => Object.keys(styles).length);
</script>

<template>
  <div class="style-list">
    <div class="style-list-header">
      <div class="style-list-search">
        <svg class="search-icon" viewBox="0 0 24 24">
          <path :d="mdiMagnify" fill="currentColor" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          :placeholder="`Search ${totalStyles} styles...`"
        />
      </div>
      <div class="style-list-count">
        {{ styleList.length }} {{ styleList.length === 1 ? 'style' : 'styles' }}
      </div>
    </div>

    <div class="style-list-grid">
      <a
        v-for="style in styleList"
        :key="style.name"
        :href="`/styles/${style.slug}/`"
        class="style-card"
      >
        <div class="style-card-avatars">
          <div
            v-for="avatar in style.avatars"
            :key="avatar.seed"
            class="style-card-avatar"
          >
            <img :src="avatar.src" :alt="`${style.displayName} - ${avatar.seed}`" loading="lazy" />
          </div>
        </div>

        <div class="style-card-content">
          <h3 class="style-card-name">{{ style.displayName }}</h3>

          <div class="style-card-meta">
            <span class="style-card-creator">
              <svg viewBox="0 0 24 24"><path :d="mdiAccountCircle" fill="currentColor" /></svg>
              {{ style.creator }}
            </span>
            <span class="style-card-license">
              <svg viewBox="0 0 24 24"><path :d="mdiLicense" fill="currentColor" /></svg>
              {{ style.license }}
            </span>
          </div>
        </div>

        <div class="style-card-arrow">
          <svg viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
        </div>
      </a>
    </div>

    <div v-if="styleList.length === 0" class="style-list-empty">
      <p>No styles found matching "{{ searchQuery }}"</p>
    </div>
  </div>
</template>

<style scoped>
.style-list {
  margin-top: 32px;
}

.style-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
}

.style-list-search {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 400px;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 0 16px;
  transition: all 0.2s ease;
}

.style-list-search:focus-within {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 14px 12px;
  font-size: 15px;
  color: var(--vp-c-text-1);
  outline: none;
  min-width: 0;
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.style-list-count {
  font-size: 14px;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.style-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.style-card {
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  padding: 20px;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  position: relative;
}

.style-card::after {
  display: none !important;
}

.style-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-4px);
  box-shadow: var(--vp-shadow-3);
}

.style-card-avatars {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.style-card-avatar {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-1);
  flex-shrink: 0;
}

.style-card-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.style-card-content {
  flex: 1;
}

.style-card-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 8px;
}

.style-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.style-card-creator,
.style-card-license {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.style-card-creator svg,
.style-card-license svg {
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-3);
}

.style-card-arrow {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  border-radius: 8px;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.2s ease;
}

.style-card-arrow svg {
  width: 18px;
  height: 18px;
  color: var(--vp-c-brand-1);
}

.style-card:hover .style-card-arrow {
  opacity: 1;
  transform: translateX(0);
}

.style-list-empty {
  text-align: center;
  padding: 60px 24px;
  color: var(--vp-c-text-2);
}

.style-list-empty p {
  margin: 0;
  font-size: 16px;
}

@media (max-width: 640px) {
  .style-list-header {
    flex-direction: column;
    align-items: stretch;
  }

  .style-list-search {
    max-width: none;
  }

  .style-list-count {
    text-align: center;
  }

  .style-list-grid {
    grid-template-columns: 1fr;
  }

  .style-card-arrow {
    display: none;
  }
}
</style>
