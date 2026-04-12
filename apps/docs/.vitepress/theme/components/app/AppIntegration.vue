<script setup lang="ts">
import { ref } from 'vue';
import { Globe, MonitorSmartphone, Server, Terminal } from '@lucide/vue';
import { UiContainer, UiSection, UiSectionHeader, UiCard, UiIconBox, UiCode } from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });

const plainCode = {
  js: `import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json';

const style = new Style(lorelei);
const svg = new Avatar(style, {
  seed: 'Mia',
}).toString();`,
  php: `<?php
use Composer\\InstalledVersions;
use DiceBear\\Style;
use DiceBear\\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/definitions');
$definition = json_decode(
  file_get_contents($basePath . '/src/lorelei.json'), true
);

$style = new Style($definition);
$svg = (string) new Avatar($style, [
  'seed' => 'Mia',
]);`,
  api: `https://api.dicebear.com/10.x/lorelei/svg?seed=Mia`,
  cli: `npx dicebear lorelei --seed "Mia" --format svg`,
};
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-integration-dots"></div>
      <div class="app-integration-gradient"></div>
    </template>
    <UiContainer>
      <UiSectionHeader
        class="app-integration-header"
        badge="Easy to Use"
        description="Choose the integration that works best for your project."
      >
        <template #headline>Integrate in <strong>Minutes</strong></template>
      </UiSectionHeader>

      <!-- JS & PHP Libraries - Side by Side -->
      <div class="app-integration-grid app-integration-grid-libraries">
        <div class="app-integration-item" :style="{ animationDelay: '0s' }">
          <UiCard padding="lg" radius="md" class="app-integration-card">
            <div class="app-integration-card-header">
              <UiIconBox size="lg" color="#1689cc">
                <MonitorSmartphone />
              </UiIconBox>
              <h3 class="app-integration-title">JS Library</h3>
              <p class="app-integration-description">No data sent externally. Full control over your avatar creation with a simple API.</p>
            </div>

            <UiCode :code="plainCode.js" lang="js" scroll-to-bottom class="app-integration-code-block" />

            <a href="/how-to-use/js-library/" class="app-integration-link">
              JS Documentation &rarr;
            </a>
          </UiCard>
        </div>

        <div class="app-integration-item" :style="{ animationDelay: '0.15s' }">
          <UiCard padding="lg" radius="md" class="app-integration-card">
            <div class="app-integration-card-header">
              <UiIconBox size="lg" color="#7b83eb">
                <Server />
              </UiIconBox>
              <h3 class="app-integration-title">PHP Library</h3>
              <p class="app-integration-description">Server-side avatar generation for PHP 8.2+. The same API as the JS library.</p>
            </div>

            <UiCode :code="plainCode.php" lang="php" scroll-to-bottom class="app-integration-code-block" />

            <a href="/how-to-use/php-library/" class="app-integration-link">
              PHP Documentation &rarr;
            </a>
          </UiCard>
        </div>
      </div>

      <!-- HTTP API & CLI - Side by Side -->
      <div class="app-integration-grid">
        <div class="app-integration-item" :style="{ animationDelay: '0.3s' }">
          <UiCard padding="lg" radius="md" class="app-integration-card">
            <div class="app-integration-card-header">
              <UiIconBox size="lg" color="#22c55e">
                <Globe />
              </UiIconBox>
              <h3 class="app-integration-title">Avatar API</h3>
              <p class="app-integration-description">Free avatar API for profile pictures. Handles millions of requests daily via global CDN.</p>
            </div>

            <UiCode :code="plainCode.api" class="app-integration-code-block" />

            <a href="/how-to-use/http-api/" class="app-integration-link">
              API Documentation &rarr;
            </a>
          </UiCard>
        </div>

        <div class="app-integration-item" :style="{ animationDelay: '0.45s' }">
          <UiCard padding="lg" radius="md" class="app-integration-card">
            <div class="app-integration-card-header">
              <UiIconBox size="lg" color="#a855f7">
                <Terminal />
              </UiIconBox>
              <h3 class="app-integration-title">CLI</h3>
              <p class="app-integration-description">Generate avatars from the command line. Perfect for scripts and automation.</p>
            </div>

            <UiCode :code="plainCode.cli" class="app-integration-code-block" />

            <a href="/how-to-use/cli/" class="app-integration-link">
              CLI Documentation &rarr;
            </a>
          </UiCard>
        </div>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-integration {
  &-dots {
    background-image: radial-gradient(circle, var(--vp-c-text-3) 1px, transparent 1px);
    background-size: 32px 32px;
    background-repeat: repeat !important;
    opacity: 0.2;
    mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);
    -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);
  }

  &-gradient {
    background: radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent), transparent);
  }

  &-header {
    opacity: 0;
    transform: translateY(30px);
    transition: all var(--duration-reveal) var(--ease-smooth);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-item {
    opacity: 0;
    transform: translateY(30px);

    .visible & {
      animation: reveal-up 0.6s var(--ease-smooth) forwards;
    }
  }

  /* Grid for JS & PHP Libraries */
  &-grid-libraries {
    margin-bottom: 24px;
  }

  /* Grid for HTTP API & CLI */
  &-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;

    > * {
      min-width: 0;
    }
  }

  &-card {
    display: flex;
    flex-direction: column;
    height: 100%;

    &-header {
      margin-bottom: 24px;
    }
  }

  &-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--vp-c-text-1);
    margin: 16px 0 8px;
  }

  &-description {
    font-size: 15px;
    color: var(--vp-c-text-2);
    margin: 0;
    line-height: 1.6;
  }

  &-code-block {
    flex: 1;
    margin-bottom: 20px;
    min-height: 48px;
  }

  &-link {
    font-size: 14px;
    font-weight: 700;
    color: var(--vp-c-brand-1);
    text-decoration: none;
    transition: all var(--duration-fast) ease;
    display: inline-flex;
    align-items: center;
    gap: 4px;

    &::after {
      display: none !important;
    }

    &:hover {
      color: var(--vp-c-brand-2);
      gap: 8px;
    }
  }
}
@media (max-width: 1000px) {
  .app-integration {
    &-grid {
      grid-template-columns: 1fr;
      max-width: 500px;
      margin: 0 auto;
    }
  }
}
</style>
