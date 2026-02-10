import { App, onMounted, watchEffect } from 'vue';
import DefaultTheme from 'vitepress/theme';
import Layout from './Layout.vue';
import { createPinia } from 'pinia';
import { useData } from 'vitepress';
import VPBadge from 'vitepress/dist/client/theme-default/components/VPBadge.vue';

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }: { app: App }) {
    app.component('Badge', VPBadge);

    const pinia = createPinia();

    app.use(pinia);
  },
  setup: () => {
    const { site, frontmatter } = useData();

    onMounted(() => {
      watchEffect(() => {
        const lang = frontmatter.value.lang ?? site.value.lang;
        const dir = frontmatter.value.dir ?? site.value.dir;

        document.documentElement.lang = lang;
        document.documentElement.dir = dir;
      });
    });
  },
};
