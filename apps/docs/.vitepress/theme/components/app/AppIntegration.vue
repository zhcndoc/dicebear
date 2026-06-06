<script setup lang="ts">
import { ref } from 'vue';
import {
  Globe,
  Library,
  Terminal,
  ArrowRight,
} from '@lucide/vue';
import Button from 'primevue/button';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import {
  UiContainer,
  UiSection,
  UiSectionHeader,
  UiCard,
  UiIconBox,
  UiCode,
} from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });

const libraryTab = ref('js');

const plainCode = {
  js: `import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const svg = new Avatar(style, {
  seed: 'Mia',
}).toString();`,
  php: `<?php
use Composer\\InstalledVersions;
use DiceBear\\Style;
use DiceBear\\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$definition = json_decode(
  file_get_contents($basePath . '/src/lorelei.json'), true
);

$style = new Style($definition);
$svg = (string) new Avatar($style, [
  'seed' => 'Mia',
]);`,
  python: `import json
from importlib.resources import files

from dicebear import Avatar, Style

definition = json.loads(
    files("dicebear_styles").joinpath("lorelei.json").read_text("utf-8")
)

style = Style(definition)
svg = Avatar(style, {"seed": "Mia"}).to_string()`,
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
        description="Choose the integration that works best for your project."
      >
        <template #headline>Integrate in <strong>Minutes</strong></template>
      </UiSectionHeader>

      <!-- JS, PHP & Python Libraries - combined into one tabbed card -->
      <div class="app-integration-libraries">
        <div class="app-integration-item" :style="{ animationDelay: '0s' }">
          <UiCard padding="xl" class="app-integration-card">
            <div class="app-integration-card-header">
              <UiIconBox size="lg" color="#f59e0b">
                <Library />
              </UiIconBox>
              <h3 class="app-integration-title">Libraries</h3>
              <p class="app-integration-description">
                Run DiceBear entirely in your own code — no data leaves your
                servers. JavaScript, PHP, and Python share one identical API.
              </p>
            </div>

            <Tabs v-model:value="libraryTab" class="app-integration-tabs">
              <TabList>
                <Tab value="js">JavaScript</Tab>
                <Tab value="php">PHP</Tab>
                <Tab value="python">Python</Tab>
              </TabList>
              <TabPanels>
                <TabPanel value="js" class="app-integration-tabpanel">
                  <UiCode
                    :code="plainCode.js"
                    lang="js"
                    scroll-to-bottom
                    class="app-integration-code-block"
                  />
                  <Button
                    as="a"
                    href="/how-to-use/js-library/"
                    severity="secondary"
                    variant="outlined"
                    class="app-integration-link"
                  >
                    JS Documentation
                    <ArrowRight :size="18" />
                  </Button>
                </TabPanel>
                <TabPanel value="php" class="app-integration-tabpanel">
                  <UiCode
                    :code="plainCode.php"
                    lang="php"
                    scroll-to-bottom
                    class="app-integration-code-block"
                  />
                  <Button
                    as="a"
                    href="/how-to-use/php-library/"
                    severity="secondary"
                    variant="outlined"
                    class="app-integration-link"
                  >
                    PHP Documentation
                    <ArrowRight :size="18" />
                  </Button>
                </TabPanel>
                <TabPanel value="python" class="app-integration-tabpanel">
                  <UiCode
                    :code="plainCode.python"
                    lang="python"
                    scroll-to-bottom
                    class="app-integration-code-block"
                  />
                  <Button
                    as="a"
                    href="/how-to-use/python-library/"
                    severity="secondary"
                    variant="outlined"
                    class="app-integration-link"
                  >
                    Python Documentation
                    <ArrowRight :size="18" />
                  </Button>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </UiCard>
        </div>
      </div>

      <!-- HTTP API & CLI - Side by Side -->
      <div class="app-integration-grid">
        <div class="app-integration-item" :style="{ animationDelay: '0.3s' }">
          <UiCard padding="xl" class="app-integration-card">
            <div class="app-integration-card-header">
              <UiIconBox size="lg" color="#22c55e">
                <Globe />
              </UiIconBox>
              <h3 class="app-integration-title">Avatar API</h3>
              <p class="app-integration-description">
                Free avatar API for profile pictures. Handles millions of
                requests daily via global CDN.
              </p>
            </div>

            <UiCode :code="plainCode.api" class="app-integration-code-block" />

            <Button
              as="a"
              href="/how-to-use/http-api/"
              severity="secondary"
              variant="outlined"
              class="app-integration-link"
            >
              API Documentation
              <ArrowRight :size="18" />
            </Button>
          </UiCard>
        </div>

        <div class="app-integration-item" :style="{ animationDelay: '0.45s' }">
          <UiCard padding="xl" class="app-integration-card">
            <div class="app-integration-card-header">
              <UiIconBox size="lg" color="#a855f7">
                <Terminal />
              </UiIconBox>
              <h3 class="app-integration-title">CLI</h3>
              <p class="app-integration-description">
                Generate avatars from the command line. Perfect for scripts and
                automation.
              </p>
            </div>

            <UiCode :code="plainCode.cli" class="app-integration-code-block" />

            <Button
              as="a"
              href="/how-to-use/cli/"
              severity="secondary"
              variant="outlined"
              class="app-integration-link"
            >
              CLI Documentation
              <ArrowRight :size="18" />
            </Button>
          </UiCard>
        </div>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-integration {
  &-dots {
    background-image: radial-gradient(
      circle,
      var(--vp-c-text-3) 1px,
      transparent 1px
    );
    background-size: 32px 32px;
    background-repeat: repeat !important;
    opacity: 0.2;
    mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);
    -webkit-mask-image: radial-gradient(
      ellipse 70% 50% at 50% 50%,
      black,
      transparent
    );
  }

  &-gradient {
    background: radial-gradient(
      ellipse 80% 60% at 50% 0%,
      color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent),
      transparent
    );
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

  /* Combined libraries card (JS / PHP / Python via tabs) */
  &-libraries {
    margin-bottom: 24px;
  }

  &-tabs {
    // The card already supplies xl padding; drop the panel's own padding so
    // the code block and doc link sit flush with the card edges, with a little
    // breathing room under the tab bar.
    --p-tabs-tabpanel-padding: 16px 0 0;
  }

  &-tabpanel {
    display: flex;
    flex-direction: column;
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
    height: 100%;

    :deep(.ui-card-body) {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

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
    align-self: flex-start;
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

@media (max-width: 640px) {
  .app-integration {
    &-card {
      --ui-card-padding: 24px;
    }
  }
}
</style>
