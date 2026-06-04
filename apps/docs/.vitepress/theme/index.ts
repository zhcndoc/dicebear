import '@fontsource-variable/inter';
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
      borderRadius: 'var(--vp-radius-sm)',
    },
    content: {
      borderRadius: 'var(--vp-radius-sm)',
    },
    text: {
      color: 'var(--vp-c-text-1)',
      hoverColor: 'var(--vp-c-text-1)',
      mutedColor: 'var(--vp-c-text-2)',
      hoverMutedColor: 'var(--vp-c-text-1)',
    },
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
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
          background: 'var(--vp-c-bg-soft)',
          hoverBackground: 'var(--vp-c-bg-soft)',
          borderColor: 'var(--pg-border)',
          color: 'var(--vp-c-text-1)',
          hoverColor: 'var(--vp-c-text-1)',
        },
        formField: {
          background: 'var(--vp-c-bg-soft)',
          hoverBorderColor: 'var(--vp-c-gray-1)',
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
        // Aura's outlined-secondary uses surface tokens that render almost
        // invisible against our bg-soft surface in dark mode and read very
        // muted in light mode. Lift border + text to VitePress tokens so
        // outlined buttons stay legible in both themes.
        //
        // Aura's contrast hover is also too subtle (one step on the surface
        // scale). Bump it a few steps so the hover state is noticeable.
        light: {
          outlined: {
            secondary: {
              borderColor: 'var(--vp-c-border)',
              color: 'var(--vp-c-text-1)',
              // Aura's hover background is `surface.50` (#fafaf9) — identical
              // to VitePress's `--vp-c-bg` in light mode, so the hover state
              // is invisible against the page. `bg-elv` is pure white and
              // semantically right for an "elevated on hover" effect.
              hoverBackground: 'var(--vp-c-bg-elv)',
              activeBackground: 'var(--vp-c-bg-soft)',
            },
          },
          root: {
            // Filled secondary defaults to ~surface-100 which blends with
            // VitePress's --vp-c-bg-soft (also surface-100). Lift to bg-elv
            // (#ffffff) so filled buttons sit a step above the page surface,
            // matching the card-like "elevated" presence the design calls for.
            secondary: {
              background: 'var(--vp-c-bg-elv)',
              hoverBackground: 'var(--vp-c-bg-soft)',
              activeBackground: 'var(--vp-c-bg-soft)',
              borderColor: 'var(--vp-c-border)',
              hoverBorderColor: 'var(--vp-c-border)',
              activeBorderColor: 'var(--vp-c-border)',
              color: 'var(--vp-c-text-1)',
              hoverColor: 'var(--vp-c-text-1)',
              activeColor: 'var(--vp-c-text-1)',
            },
            contrast: {
              hoverBackground: '{surface.800}',
              hoverBorderColor: '{surface.800}',
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
              borderColor: 'var(--vp-c-border)',
              color: 'var(--vp-c-text-1)',
            },
          },
          root: {
            // Filled secondary defaults to bg-soft (#242429), identical to
            // the card surface around them — buttons read flat. Lift to
            // bg-elv (#2c2c32) for a clear one-step elevation above the
            // card, matching the visual presence of the primary CTA group.
            secondary: {
              background: 'var(--vp-c-bg-elv)',
              hoverBackground: '{surface.600}',
              activeBackground: '{surface.600}',
              borderColor: 'var(--vp-c-bg-elv)',
              hoverBorderColor: '{surface.600}',
              activeBorderColor: '{surface.600}',
              color: 'var(--vp-c-text-1)',
              hoverColor: 'var(--vp-c-text-1)',
              activeColor: 'var(--vp-c-text-1)',
            },
            contrast: {
              hoverBackground: '{surface.100}',
              hoverBorderColor: '{surface.100}',
            },
          },
          link: {
            color: 'var(--p-text-muted-color)',
            hoverColor: 'var(--p-text-color)',
            activeColor: 'var(--p-text-color)',
          },
        },
      },
      // Buttons used here put icon + label in the default slot, so PrimeVue
      // does not wrap the text in `.p-button-label`. Apply Aura's label
      // weight to the button root so default-slot text picks it up via
      // inheritance (Aura default is 500).
      css: () => `
        .p-button {
          font-weight: 500;
        }
      `,
    },
    accordion: {
      colorScheme: {
        dark: {
          header: {
            background: 'var(--vp-c-bg-soft)',
            hoverBackground: 'var(--vp-c-bg-soft)',
            activeBackground: 'var(--vp-c-bg-soft)',
            activeHoverBackground: 'var(--vp-c-bg-soft)',
          },
          content: {
            background: 'var(--vp-c-bg-soft)',
          },
        },
      },
    },
    tag: {
      colorScheme: {
        dark: {
          secondary: {
            background: 'var(--vp-c-bg)',
          },
        },
      },
    },
    togglebutton: {
      colorScheme: {
        dark: {
          root: {
            background: 'var(--vp-c-bg)',
            hoverBackground: 'var(--vp-c-bg)',
            checkedBackground: 'var(--vp-c-bg)',
            borderColor: 'var(--vp-c-bg)',
            checkedBorderColor: 'var(--vp-c-bg)',
          },
          content: {
            checkedBackground: 'var(--vp-c-bg-soft)',
          },
        },
      },
    },
    menu: {
      colorScheme: {
        // The shared content tokens map background and hoverBackground to
        // the same VitePress surface, so the default menu-item hover is
        // invisible against the menu's own background. Lift hover to an
        // adjacent surface step so it actually shows.
        dark: {
          item: {
            focusBackground: '{surface.700}',
          },
        },
        light: {
          item: {
            focusBackground: '{surface.100}',
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
