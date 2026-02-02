---
description: >
  Get an overview of all available avatar styles from DiceBear. From abstract
  patterns, to loving characters, it's all there!
aside: false
---

<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import StyleList from "@theme/components/StyleList.vue";

const { theme } = useData();
const styleCount = computed(() => Object.keys(theme.value.avatarStyles).length);
</script>

<div class="styles-page">
  <div class="styles-hero">
    <h1 class="styles-title">Styles Overview</h1>
    <p class="styles-description">
      From abstract patterns to lovingly designed characters. Every style is crafted by talented artists and ready to use in your projects.
    </p>
  </div>

  <StyleList />
</div>

<style>
.styles-page .styles-hero {
  text-align: center;
  padding: 40px 0 20px;
}

.styles-page .styles-title {
  font-size: 42px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 16px;
  line-height: 1.2;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-purple-1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.styles-page .styles-description {
  font-size: 18px;
  color: var(--vp-c-text-2);
  margin: 0 auto !important;
  max-width: 560px;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .styles-page .styles-hero {
    padding: 24px 0 16px;
  }

  .styles-page .styles-title {
    font-size: 32px;
  }

  .styles-page .styles-description {
    font-size: 16px;
  }
}
</style>
