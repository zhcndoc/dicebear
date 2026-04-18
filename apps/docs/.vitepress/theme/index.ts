import '@fontsource-variable/figtree';
import { App, onMounted, watchEffect } from 'vue';
import DefaultTheme from 'vitepress/theme';
import Layout from './Layout.vue';
import { createPinia } from 'pinia';
import { useData } from 'vitepress';
import VPBadge from 'vitepress/dist/client/theme-default/components/VPBadge.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import Tooltip from 'primevue/tooltip';

const DiceBearPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{stone.50}',
          100: '{stone.100}',
          200: '{stone.200}',
          300: '{stone.300}',
          400: '{stone.400}',
          500: '{stone.500}',
          600: '{stone.600}',
          700: '{stone.700}',
          800: '{stone.800}',
          900: '{stone.900}',
          950: '{stone.950}',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '#f5f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#57534e',
          600: '#3f3f46',
          700: '#2c2c32',
          800: '#242429',
          900: '#1a1a1e',
          950: '#111115',
        },
      },
    },
  },
  components: {
    button: {
      colorScheme: {
        light: {
          root: {
            secondary: {
              background: '#f0efed',
              hoverBackground: '#e7e5e4',
              activeBackground: '#d6d3d1',
              borderColor: 'transparent',
              hoverBorderColor: 'transparent',
              activeBorderColor: 'transparent',
              color: 'var(--vp-c-text-1)',
              hoverColor: 'var(--vp-c-text-1)',
              activeColor: 'var(--vp-c-text-1)',
            },
          },
        },
        dark: {
          root: {
            secondary: {
              background: '#2f2f36',
              hoverBackground: '#3a3a42',
              activeBackground: '#48484f',
              borderColor: 'transparent',
              hoverBorderColor: 'transparent',
              activeBorderColor: 'transparent',
              color: 'var(--vp-c-text-1)',
              hoverColor: 'var(--vp-c-text-1)',
              activeColor: 'var(--vp-c-text-1)',
            },
          },
        },
      },
    },
  },
});

let clickListenerAdded = false;

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }: { app: App }) {
    app.component('Badge', VPBadge);

    const pinia = createPinia();

    app.use(pinia);
    app.directive('tooltip', Tooltip);
    app.use(PrimeVue, {
      theme: {
        preset: DiceBearPreset,
        options: {
          darkModeSelector: '.dark',
        },
      },
    });
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

      if (typeof window !== 'undefined' && !clickListenerAdded) {
        clickListenerAdded = true;
        window.addEventListener('click', (e) => {
          const link = (e.target as HTMLElement)?.closest('a');

          if (link && link.hostname) {
            if (link.hostname !== window.location.hostname) {

              if (typeof umami !== 'undefined') {
                umami.track('Outbound Link', { url: link.hostname });
              }
            }
          }
        });
      }
    });
  },
};
