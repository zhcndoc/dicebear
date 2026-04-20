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
    formField: {
      borderRadius: 'var(--vp-radius-xs)',
    },
    content: {
      borderRadius: 'var(--vp-radius-xs)',
    },
    text: {
      color: 'var(--vp-c-text-1)',
      hoverColor: 'var(--vp-c-text-1)',
      mutedColor: 'var(--vp-c-text-2)',
      hoverMutedColor: 'var(--vp-c-text-1)',
    },
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
        content: {
          background: 'var(--vp-c-bg-elv)',
          hoverBackground: 'var(--vp-c-bg-soft)',
          borderColor: 'var(--pg-border)',
          color: 'var(--vp-c-text-1)',
          hoverColor: 'var(--vp-c-text-1)',
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
        content: {
          background: 'var(--vp-c-bg)',
          hoverBackground: 'var(--vp-c-bg-soft)',
          borderColor: 'var(--pg-border)',
          color: 'var(--vp-c-text-1)',
          hoverColor: 'var(--vp-c-text-1)',
        },
        text: {
          mutedColor: 'rgba(235, 235, 245, 0.78)',
        },
      },
    },
  },
  components: {
    button: {
      colorScheme: {
        light: {
          outlined: {
            secondary: {
              hoverBackground: 'var(--vp-c-bg-soft)',
              activeBackground: 'var(--vp-c-bg-soft)',
              borderColor: 'var(--p-form-field-border-color)',
              color: 'var(--vp-c-text-1)',
            },
          },
          link: {
            color: 'var(--vp-c-text-1)',
            hoverColor: 'var(--p-text-color)',
            activeColor: 'var(--p-text-color)',
          },
        },
        dark: {
          outlined: {
            secondary: {
              hoverBackground: 'var(--vp-c-bg-soft)',
              activeBackground: 'var(--vp-c-bg-soft)',
              borderColor: 'var(--p-form-field-border-color)',
              color: 'var(--vp-c-text-1)',
            },
          },
          link: {
            color: 'var(--p-text-muted-color)',
            hoverColor: 'var(--p-text-color)',
            activeColor: 'var(--p-text-color)',
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
