<script setup lang="ts">
import { ref, computed } from 'vue';
import { useData } from 'vitepress';
import { ThemeOptions } from '@shared/types';
import { kebabCase, capitalCase } from 'change-case';
import { mdiMagnify, mdiAccountCircle, mdiLicense, mdiArrowRight, mdiFilter, mdiClose } from '@mdi/js';

const { theme } = useData<ThemeOptions>();
const styles = theme.value.avatarStyles;

const searchQuery = ref('');
const selectedLicense = ref<string | null>(null);
const selectedCategory = ref<string | null>(null);

const seeds = ['Felix', 'Aneka', 'Milo', 'Luna'];

// Category definitions
const categoryMap: Record<string, string> = {
  // Characters - Humans
  adventurer: 'Characters',
  adventurerNeutral: 'Characters',
  avataaars: 'Characters',
  avataaarsNeutral: 'Characters',
  bigEars: 'Characters',
  bigEarsNeutral: 'Characters',
  bigSmile: 'Characters',
  croodles: 'Characters',
  croodlesNeutral: 'Characters',
  dylan: 'Characters',
  funEmoji: 'Characters',
  lorelei: 'Characters',
  loreleiNeutral: 'Characters',
  micah: 'Characters',
  miniavs: 'Characters',
  notionists: 'Characters',
  notionistsNeutral: 'Characters',
  openPeeps: 'Characters',
  personas: 'Characters',
  pixelArt: 'Characters',
  pixelArtNeutral: 'Characters',
  toonHead: 'Characters',
  // Characters - Robots
  bottts: 'Characters',
  botttsNeutral: 'Characters',
  // Minimalist
  glass: 'Minimalist',
  identicon: 'Minimalist',
  rings: 'Minimalist',
  shapes: 'Minimalist',
  initials: 'Minimalist',
  icons: 'Minimalist',
  thumbs: 'Minimalist',
};

// License normalization for filtering
const normalizeLicense = (license: string): string => {
  if (license.includes('CC BY 4.0')) return 'CC BY 4.0';
  if (license.includes('CC0 1.0')) return 'CC0 1.0';
  if (license.includes('MIT')) return 'MIT';
  return 'Other';
};

const allStyles = computed(() => {
  return Object.entries(styles)
    .map(([styleName, style]) => {
      const rawLicense = style.meta.license?.name || 'Unknown';
      return {
        name: styleName,
        displayName: capitalCase(styleName),
        slug: kebabCase(styleName),
        creator: style.meta.creator || 'Unknown',
        license: rawLicense,
        licenseNormalized: normalizeLicense(rawLicense),
        category: categoryMap[styleName] || 'Other',
        avatars: seeds.map(seed => ({
          seed,
          src: `https://api.dicebear.com/9.x/${kebabCase(styleName)}/svg?seed=${seed}&size=80`
        }))
      };
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
});

// Available licenses for filter
const availableLicenses = computed(() => {
  const licenses = new Set(allStyles.value.map(s => s.licenseNormalized));
  return Array.from(licenses).sort();
});

// Available categories for filter
const availableCategories = computed(() => {
  const categories = new Set(allStyles.value.map(s => s.category));
  const order = ['Minimalist', 'Characters', 'Other'];
  return Array.from(categories).sort((a, b) => order.indexOf(a) - order.indexOf(b));
});

const styleList = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();

  return allStyles.value.filter(style => {
    // Search filter
    if (query && !style.displayName.toLowerCase().includes(query) && !style.creator.toLowerCase().includes(query)) {
      return false;
    }
    // License filter
    if (selectedLicense.value && style.licenseNormalized !== selectedLicense.value) {
      return false;
    }
    // Category filter
    if (selectedCategory.value && style.category !== selectedCategory.value) {
      return false;
    }
    return true;
  });
});

// Group styles by category for display
const groupedStyles = computed(() => {
  const groups: Record<string, typeof styleList.value> = {};
  for (const style of styleList.value) {
    if (!groups[style.category]) {
      groups[style.category] = [];
    }
    groups[style.category].push(style);
  }
  // Sort categories
  const order = ['Minimalist', 'Characters', 'Other'];
  const sortedGroups: typeof groups = {};
  for (const cat of order) {
    if (groups[cat]) {
      sortedGroups[cat] = groups[cat];
    }
  }
  return sortedGroups;
});

const totalStyles = computed(() => Object.keys(styles).length);
const hasActiveFilters = computed(() => selectedLicense.value !== null || selectedCategory.value !== null);

const clearFilters = () => {
  selectedLicense.value = null;
  selectedCategory.value = null;
};
</script>

<template>
  <div class="styles-page style-list">
    <div class="style-list-filters">
      <div class="style-list-filter-row">
        <div class="style-list-filter-group style-list-filter-group-search">
          <span class="style-list-filter-label">
            <svg viewBox="0 0 24 24"><path :d="mdiMagnify" fill="currentColor" /></svg>
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
            <svg viewBox="0 0 24 24"><path :d="mdiFilter" fill="currentColor" /></svg>
            Category
          </span>
          <div class="style-list-filter-chips">
            <button
              v-for="category in availableCategories"
              :key="category"
              class="style-list-filter-chip"
              :class="{ active: selectedCategory === category }"
              @click="selectedCategory = selectedCategory === category ? null : category"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <div class="style-list-filter-group">
          <span class="style-list-filter-label">
            <svg viewBox="0 0 24 24"><path :d="mdiLicense" fill="currentColor" /></svg>
            License
          </span>
          <div class="style-list-filter-chips">
            <button
              v-for="license in availableLicenses"
              :key="license"
              class="style-list-filter-chip"
              :class="{ active: selectedLicense === license }"
              @click="selectedLicense = selectedLicense === license ? null : license"
            >
              {{ license }}
            </button>
          </div>
        </div>
      </div>

      <div class="style-list-filter-footer">
        <button v-if="hasActiveFilters" class="style-list-clear-filters" @click="clearFilters">
          <svg viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
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
              <img :src="avatar.src" :alt="`${style.displayName} - ${avatar.seed}`" loading="lazy" referrerpolicy="origin" />
            </div>
          </div>

          <div class="style-list-card-content">
            <h3 class="style-list-card-name">{{ style.displayName }}</h3>

            <div class="style-list-card-meta">
              <span class="style-list-card-creator">
                <svg viewBox="0 0 24 24"><path :d="mdiAccountCircle" fill="currentColor" /></svg>
                {{ style.creator }}
              </span>
              <span class="style-list-card-license">
                <svg viewBox="0 0 24 24"><path :d="mdiLicense" fill="currentColor" /></svg>
                {{ style.license }}
              </span>
            </div>
          </div>

          <div class="style-list-card-arrow">
            <svg viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
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

<style scoped>
.styles-page.style-list {
  margin-top: 32px;
}

.styles-page .style-list-filters {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
  padding: 24px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}

.styles-page .style-list-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  align-items: flex-start;
}

.styles-page .style-list-filter-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.styles-page .style-list-filter-group-search {
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.styles-page .style-list-filter-footer {
  display: flex;
  align-items: center;
  gap: 16px;
}

.styles-page .style-list-filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.styles-page .style-list-filter-label svg {
  width: 16px;
  height: 16px;
}

.styles-page .style-list-filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.styles-page .style-list-filter-chip {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.styles-page .style-list-filter-chip:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.styles-page .style-list-filter-chip.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.styles-page .style-list-clear-filters {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  background: transparent;
  border: 1px dashed var(--vp-c-border);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.styles-page .style-list-clear-filters:hover {
  border-color: var(--vp-c-danger-1);
  color: var(--vp-c-danger-1);
}

.styles-page .style-list-clear-filters svg {
  width: 14px;
  height: 14px;
}

.styles-page .style-list-category {
  margin-bottom: 48px;
}

.styles-page .style-list-category-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 20px;
  border-top: 0 !important;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--vp-c-border);
}

.styles-page .style-list-search {
  display: flex;
  align-items: center;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 20px;
  padding: 0 14px;
  transition: all 0.2s ease;
}

.styles-page .style-list-search:focus-within {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.styles-page .style-list-search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 6px 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  outline: none;
  min-width: 0;
}

.styles-page .style-list-search-input::placeholder {
  color: var(--vp-c-text-3);
}

.styles-page .style-list-count {
  font-size: 14px;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.styles-page .style-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.styles-page .style-list-card {
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

.styles-page .style-list-card::after {
  display: none !important;
}

.styles-page .style-list-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-4px);
  box-shadow: var(--vp-shadow-3);
}

.styles-page .style-list-card-avatars {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.styles-page .style-list-card-avatar {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-1);
  flex-shrink: 0;
}

.styles-page .style-list-card-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.styles-page .style-list-card-content {
  flex: 1;
}

.styles-page .style-list-card-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 8px;
}

.styles-page .style-list-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.styles-page .style-list-card-creator,
.styles-page .style-list-card-license {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.styles-page .style-list-card-creator svg,
.styles-page .style-list-card-license svg {
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-3);
}

.styles-page .style-list-card-arrow {
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

.styles-page .style-list-card-arrow svg {
  width: 18px;
  height: 18px;
  color: var(--vp-c-brand-1);
}

.styles-page .style-list-card:hover .style-list-card-arrow {
  opacity: 1;
  transform: translateX(0);
}

.styles-page .style-list-empty {
  text-align: center;
  padding: 60px 24px;
  color: var(--vp-c-text-2);
}

.styles-page .style-list-empty p {
  margin: 0;
  font-size: 16px;
}

@media (max-width: 640px) {
  .styles-page .style-list-filter-row {
    flex-direction: column;
    gap: 20px;
  }

  .styles-page .style-list-filter-group {
    width: 100%;
  }

  .styles-page .style-list-filter-group-search {
    max-width: none;
  }

  .styles-page .style-list-category-title {
    font-size: 20px;
  }

  .styles-page .style-list-grid {
    grid-template-columns: 1fr;
  }

  .styles-page .style-list-card-arrow {
    display: none;
  }
}
</style>
