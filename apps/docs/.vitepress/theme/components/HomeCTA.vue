<script setup lang="ts">
import { computed } from 'vue';
import { ThemeOptions } from '@shared/types';
import { useData } from 'vitepress';
import { kebabCase } from 'change-case';
import {
  mdiBookOpenPageVariant,
  mdiPlay,
  mdiViewGrid,
  mdiGithub,
  mdiPencil,
  mdiShieldCheck,
  mdiArrowRight,
} from '@mdi/js';

const { theme } = useData<ThemeOptions>();

const avatarStyleList = computed(() => Object.keys(theme.value.avatarStyles));

// Pick 5 diverse styles for the preview
const previewStyles = computed(() => {
  const picks = ['lorelei', 'bottts', 'avataaars', 'funEmoji', 'shapes'];
  return picks
    .filter(s => avatarStyleList.value.includes(s))
    .map(style => ({
      style: kebabCase(style),
      src: `https://api.dicebear.com/9.x/${kebabCase(style)}/svg?seed=Demo&size=80`
    }));
});
</script>

<template>
  <section class="cta">
    <div class="cta-container">
      <div class="cta-grid">
        <!-- Left: Quick links -->
        <div class="cta-column">
          <h3 class="cta-column-title">Get Started</h3>
          <nav class="cta-nav">
            <a href="/introduction/" class="cta-nav-link">
              <svg viewBox="0 0 24 24"><path :d="mdiBookOpenPageVariant" fill="currentColor" /></svg>
              Documentation
            </a>
            <a href="/playground/" class="cta-nav-link">
              <svg viewBox="0 0 24 24"><path :d="mdiPlay" fill="currentColor" /></svg>
              Playground
            </a>
            <a href="/styles/" class="cta-nav-link">
              <svg viewBox="0 0 24 24"><path :d="mdiViewGrid" fill="currentColor" /></svg>
              All Styles
            </a>
          </nav>
        </div>

        <!-- Center: Main CTA -->
        <div class="cta-main">
          <div class="cta-avatars">
            <div
              v-for="(avatar, index) in previewStyles"
              :key="avatar.style"
              class="cta-avatar"
            >
              <img :src="avatar.src" :alt="avatar.style" loading="lazy" />
            </div>
          </div>
          <h2 class="cta-title">Ready to get started?</h2>
          <p class="cta-description">
            Create unique avatars for your next project.
          </p>
          <a href="/playground/" class="cta-button">
            Open Playground
            <svg viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
          </a>
        </div>

        <!-- Right: Resources -->
        <div class="cta-column">
          <h3 class="cta-column-title">Resources</h3>
          <nav class="cta-nav">
            <a href="https://github.com/dicebear/dicebear" target="_blank" rel="noopener" class="cta-nav-link">
              <svg viewBox="0 0 24 24"><path :d="mdiGithub" fill="currentColor" /></svg>
              GitHub
            </a>
            <a href="https://editor.dicebear.com" target="_blank" rel="noopener" class="cta-nav-link">
              <svg viewBox="0 0 24 24"><path :d="mdiPencil" fill="currentColor" /></svg>
              Editor
            </a>
            <a href="/licenses/" class="cta-nav-link">
              <svg viewBox="0 0 24 24"><path :d="mdiShieldCheck" fill="currentColor" /></svg>
              Licenses
            </a>
          </nav>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  padding: 80px 24px;
  background: var(--vp-c-bg);
}

.cta-container {
  max-width: 1000px;
  margin: 0 auto;
}

.cta-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 48px;
  align-items: start;
}

.cta-column-title {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  margin: 0 0 16px;
}

.cta-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cta-nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.cta-nav-link::after {
  display: none !important;
}

.cta-nav-link:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.cta-nav-link svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.cta-main {
  text-align: center;
  padding: 40px;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
}

.cta-avatars {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.cta-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-1);
}

.cta-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cta-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 8px;
}

.cta-description {
  font-size: 16px;
  color: var(--vp-c-text-2);
  margin: 0 0 24px;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--vp-c-brand-3);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  transition: background 0.2s ease;
}

.cta-button::after {
  display: none !important;
}

.cta-button:hover {
  background: var(--vp-c-brand-2);
}

.cta-button svg {
  width: 16px;
  height: 16px;
}

@media (max-width: 900px) {
  .cta-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .cta-main {
    order: -1;
  }

  .cta-column {
    text-align: center;
  }

  .cta-nav {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .cta {
    padding: 60px 16px;
  }

  .cta-main {
    padding: 32px 24px;
  }

  .cta-nav {
    flex-direction: column;
  }

  .cta-nav-link {
    justify-content: center;
  }
}
</style>
