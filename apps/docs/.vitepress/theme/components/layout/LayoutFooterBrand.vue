<script setup lang="ts">
import { withBase } from 'vitepress';
import { siGithub, siFigma } from 'simple-icons';
import { UiIcon } from '../ui';
</script>

<template>
  <div class="layout-footer-brand">
    <a href="/" class="layout-footer-logo">
      <img
        class="layout-footer-logo-light"
        :src="withBase('/logo.svg')"
        alt="DiceBear"
      />
      <img
        class="layout-footer-logo-dark"
        :src="withBase('/logo-dark.svg')"
        alt="DiceBear"
      />
    </a>
    <p class="layout-footer-tagline">
      面向设计师和开发者的开源 SVG 头像库与头像 API。
    </p>

    <div class="layout-footer-social">
      <a
        href="https://github.com/dicebear/dicebear"
        target="_blank"
        rel="me noopener"
        aria-label="GitHub"
        class="layout-footer-social-link"
      >
        <UiIcon :path="siGithub.path" />
      </a>
      <a
        href="https://www.figma.com/@dicebear_com"
        target="_blank"
        rel="me noopener"
        aria-label="Figma"
        class="layout-footer-social-link"
      >
        <UiIcon :path="siFigma.path" />
      </a>
    </div>
  </div>
</template>
