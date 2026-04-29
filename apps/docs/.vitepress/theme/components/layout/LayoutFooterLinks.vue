<script setup lang="ts">
import { productLinks, resourceLinks, legalLinks } from '../../config/footer-links';

const columns = [
  { title: '精选', links: productLinks },
  { title: '资源', links: resourceLinks },
  { title: '法律', links: legalLinks },
] as const;
</script>

<template>
  <div class="layout-footer-links">
    <div v-for="column in columns" :key="column.title" class="layout-footer-column">
      <h3 class="layout-footer-column-title">{{ column.title }}</h3>
      <ul class="layout-footer-column-list">
        <li v-for="link in column.links" :key="link.label">
          <a
            :href="link.href"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
            class="layout-footer-link"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
