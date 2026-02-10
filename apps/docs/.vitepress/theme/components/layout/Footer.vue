<script setup lang="ts">
import { useData, withBase } from 'vitepress';
import { useLayout } from 'vitepress/theme';
import { computed } from 'vue';
import { siGithub, siFigma } from 'simple-icons';
import { UiIcon } from '../ui';
import type { StyleMeta } from '@dicebear/core';
import type { ThemeOptions } from '@theme/types';
import { productLinks, resourceLinks, legalLinks } from '../../config/footer-links';

const { theme } = useData<ThemeOptions>();
const { hasSidebar } = useLayout();

const styles = computed(() => {
  const result: StyleMeta[] = [];
  const knownWork: string[] = [];

  for (const val of Object.values(theme.value.avatarStyles)) {
    if (
      val.meta.creator === 'Florian Körner' ||
      val.meta.creator === 'DiceBear'
    ) {
      continue;
    }

    if (val.meta.source) {
      if (knownWork.includes(val.meta.source)) {
        continue;
      }

      knownWork.push(val.meta.source);
    }

    result.push(val.meta);
  }

  return result;
});
</script>

<template>
  <footer class="footer" :class="{ 'footer-has-sidebar': hasSidebar }">
    <div class="footer-divider"></div>

    <div class="footer-main">
      <div class="footer-container">
        <!-- Brand column -->
        <div class="footer-brand">
          <a href="/" class="footer-logo">
            <img
              class="footer-logo-light"
              :src="withBase('/logo.svg')"
              alt="DiceBear"
            />
            <img
              class="footer-logo-dark"
              :src="withBase('/logo-dark.svg')"
              alt="DiceBear"
            />
          </a>
          <p class="footer-tagline">
            Open source avatar generator and avatar library for designers and developers.
          </p>

          <!-- Social links -->
          <div class="footer-social">
            <a
              href="https://github.com/dicebear/dicebear"
              target="_blank"
              rel="noopener"
              class="footer-social-link"
            >
              <UiIcon :path="siGithub.path" />
            </a>
            <a
              href="https://www.figma.com/@dicebear_com"
              target="_blank"
              rel="noopener"
              class="footer-social-link"
            >
              <UiIcon :path="siFigma.path" />
            </a>
          </div>
        </div>

        <!-- Link columns -->
        <div class="footer-links">
          <div class="footer-column">
            <h3 class="footer-column-title">Explore</h3>
            <ul class="footer-column-list">
              <li v-for="link in productLinks" :key="link.label">
                <a
                  :href="link.href"
                  :target="link.external ? '_blank' : undefined"
                  :rel="link.external ? 'noopener noreferrer' : undefined"
                  class="footer-link"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>

          <div class="footer-column">
            <h3 class="footer-column-title">Resources</h3>
            <ul class="footer-column-list">
              <li v-for="link in resourceLinks" :key="link.label">
                <a
                  :href="link.href"
                  :target="link.external ? '_blank' : undefined"
                  :rel="link.external ? 'noopener noreferrer' : undefined"
                  class="footer-link"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>

          <div class="footer-column">
            <h3 class="footer-column-title">Legal</h3>
            <ul class="footer-column-list">
              <li v-for="link in legalLinks" :key="link.label">
                <a
                  :href="link.href"
                  :target="link.external ? '_blank' : undefined"
                  :rel="link.external ? 'noopener noreferrer' : undefined"
                  class="footer-link"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Sponsor -->
    <div class="footer-sponsor">
      <div class="footer-container">
        <div class="footer-sponsor-inner">
          <span class="footer-sponsor-label">CDN sponsored by</span>
          <a
            href="https://bunny.net/"
            target="_blank"
            rel="noopener"
            class="footer-sponsor-logo"
          >
            <img
              class="footer-sponsor-logo-light"
              :src="withBase('/sponsors/bunny-light.svg')"
              alt="bunny.net"
            />
            <img
              class="footer-sponsor-logo-dark"
              :src="withBase('/sponsors/bunny-dark.svg')"
              alt="bunny.net"
            />
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <div class="footer-container">
        <div class="footer-bottom-inner">
          <p class="footer-attributions">
            <template v-for="(style, index) in styles" :key="style.source">
              <a class="footer-attribution-link" :href="style.source" target="_blank" rel="noopener">{{
                style.title
              }}</a>
              by {{ style.creator }} /
              <a class="footer-attribution-link" :href="style.license?.url" target="_blank" rel="noopener">{{
                style.license?.name
              }}</a><template v-if="index < styles.length - 1">. </template>
            </template>
            — All avatars are remixes of the original works.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
:root {
  --footer-logo-light-display: inline-block;
  --footer-logo-dark-display: none;
  --footer-sponsor-logo-light-display: none;
  --footer-sponsor-logo-dark-display: inline-block;
}
.dark {
  --footer-logo-light-display: none;
  --footer-logo-dark-display: inline-block;
  --footer-sponsor-logo-light-display: inline-block;
  --footer-sponsor-logo-dark-display: none;
}
.footer-sponsor-logo-light {
  display: var(--footer-sponsor-logo-light-display);
}
.footer-sponsor-logo-dark {
  display: var(--footer-sponsor-logo-dark-display);
}
</style>

<style lang="scss" scoped>
.footer {
  position: relative;
  background: var(--vp-c-bg);

  &-divider {
    height: 1px;
    background: var(--vp-c-divider);
  }

  &-container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 32px;

    @media (min-width: 960px) {
      .footer-has-sidebar & {
        padding-left: calc(var(--vp-sidebar-width) + 32px);
      }
    }
  }

  // Main section
  &-main {
    padding: 64px 0 48px;

    .footer-container {
      display: flex;
      gap: 64px;
    }
  }

  // Brand
  &-brand {
    flex-shrink: 0;
    max-width: 260px;
  }

  &-logo {
    display: inline-block;
    margin-bottom: 16px;

    img {
      height: 24px;
    }

    &-light {
      display: var(--footer-logo-light-display);
    }

    &-dark {
      display: var(--footer-logo-dark-display);
    }
  }

  &-tagline {
    font-size: 14px;
    line-height: 1.6;
    color: var(--vp-c-text-2);
    margin: 0 0 20px;
  }

  &-social {
    display: flex;
    gap: 4px;

    &-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      color: var(--vp-c-text-2);
      transition: all 0.2s ease;

      &:hover {
        color: var(--vp-c-text-1);
        background: var(--vp-c-bg);
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  // Link columns
  &-links {
    display: flex;
    gap: 64px;
    flex: 1;
    justify-content: flex-end;
  }

  &-column {
    &-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--vp-c-text-1);
      margin: 0 0 16px;
    }

    &-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }

  &-link {
    font-size: 14px;
    color: var(--vp-c-text-2);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--vp-c-brand-1);
    }

    &::after {
      display: none !important;
    }
  }

  // Sponsor
  &-sponsor {
    padding: 24px 0;
    border-top: 1px solid var(--vp-c-divider);

    &-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    &-label {
      font-size: 13px;
      color: var(--vp-c-text-3);
    }

    &-logo {
      display: inline-flex;
      align-items: center;

      img {
        height: 52px;
      }
    }
  }

  // Bottom bar
  &-bottom {
    padding: 24px 0;
    border-top: 1px solid var(--vp-c-divider);

    &-inner {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }

  &-credit-link {
    color: var(--vp-c-text-2);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--vp-c-brand-1);
    }

    &::after {
      display: none !important;
    }
  }

  // Attributions
  &-attributions {
    margin: 0;
    font-size: 12px;
    color: var(--vp-c-text-3);
    line-height: 1.7;
  }

  &-attribution-link {
    color: var(--vp-c-text-2);
    text-decoration: none;
    border-bottom: 1px dashed var(--vp-c-text-3);
    transition: all 0.2s ease;

    &:hover {
      color: var(--vp-c-brand-1);
      border-bottom-color: var(--vp-c-brand-1);
    }

    &::after {
      display: none !important;
    }
  }

  // Responsive: with sidebar (sidebar adds ~300px)
  @media (min-width: 960px) {
    &-has-sidebar .footer-main .footer-container {
      flex-direction: column;
      gap: 40px;
    }

    &-has-sidebar .footer-brand {
      max-width: 100%;
    }

    &-has-sidebar .footer-links {
      justify-content: flex-start;
      gap: 40px;
    }
  }

  @media (min-width: 1340px) {
    &-has-sidebar .footer-main .footer-container {
      flex-direction: row;
      gap: 64px;
    }

    &-has-sidebar .footer-brand {
      max-width: 260px;
    }

    &-has-sidebar .footer-links {
      justify-content: flex-end;
      gap: 64px;
    }
  }

  // Responsive: without sidebar
  @media (max-width: 768px) {
    .footer-main .footer-container {
      flex-direction: column;
      gap: 40px;
    }

    .footer-brand {
      max-width: 100%;
    }

    .footer-links {
      justify-content: flex-start;
      gap: 40px;
    }

    .footer-copyright {
      flex-wrap: wrap;
    }
  }

  @media (max-width: 480px) {
    .footer-links {
      flex-direction: column;
      gap: 32px;
    }
  }
}
</style>
