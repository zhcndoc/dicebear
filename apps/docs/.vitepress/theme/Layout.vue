<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import LayoutFooter from './components/layout/LayoutFooter.vue';
import LayoutSidebarBefore from './components/layout/LayoutSidebarBefore.vue';
import './styles/main.scss';

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #sidebar-nav-before>
      <LayoutSidebarBefore />
    </template>
    <template #layout-bottom>
      <LayoutFooter />
    </template>
  </Layout>
</template>
