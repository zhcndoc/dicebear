<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import Footer from './components/layout/Footer.vue';
import SidebarBefore from './components/layout/SidebarBefore.vue';
import './styles/main.scss';

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #sidebar-nav-before>
      <SidebarBefore />
    </template>
    <template #layout-bottom>
      <Footer />
    </template>
  </Layout>
</template>
