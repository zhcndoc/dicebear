<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import { VPDocAsideSponsors } from 'vitepress/theme';
import { withBase } from 'vitepress';
import LayoutFooter from './components/layout/LayoutFooter.vue';
import LayoutSidebarBefore from './components/layout/LayoutSidebarBefore.vue';
import './styles/main.scss';

const { Layout } = DefaultTheme;

const sponsors = [
  {
    tier: 'CDN sponsored by',
    size: 'medium' as const,
    items: [
      {
        name: 'bunny.net',
        img: withBase('/sponsors/bunny-dark.svg'),
        url: 'https://bunny.net/',
      },
    ],
  },
];
</script>

<template>
  <Layout>
    <template #sidebar-nav-before>
      <LayoutSidebarBefore />
    </template>
    <template #aside-outline-after>
      <div class="layout-aside-sponsors">
        <VPDocAsideSponsors :data="sponsors" />
      </div>
    </template>
    <template #layout-bottom>
      <LayoutFooter />
    </template>
  </Layout>
</template>
