import * as path from 'node:path';
import { defineConfig, HeadConfig } from 'vitepress';
import { ThemeOptions } from '@theme/types';

import sidebarDocs from './config/sidebarDocs';
import sidebarPlayground from './config/sidebarPlayground';
import sidebarStyles from './config/sidebarStyles';
import avatarStyles from './config/avatarStyles';
import { siBluesky, siFigma } from 'simple-icons';

function formatStars(count: number): string {
  if (count >= 1000) {
    const k = Math.floor((count / 1000) * 10) / 10;
    return `${k}k+`;
  }
  return `${count}+`;
}

async function fetchGitHubStars(
  repos: string[],
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  await Promise.all(
    repos.map(async (repo) => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}`);
        if (res.ok) {
          const data = await res.json();
          result[repo] = formatStars(data.stargazers_count);
        }
      } catch {
        // Ignore fetch errors, fallback handled in components
      }
    }),
  );

  return result;
}

const githubStars = await fetchGitHubStars([
  'dicebear/dicebear',
  'nusu/avvvatars',
  'dmester/jdenticon',
  'multiavatar/Multiavatar',
  'boringdesigners/boring-avatars',
]);

const isProduction = process.env.NODE_ENV === 'production';

const thirdPartyScripts: HeadConfig[] = isProduction
  ? [
      [
        'script',
        {
          defer: '',
          src: 'https://hello.dicebear.com/script.js',
          'data-website-id': '2e88c8f9-fb3c-4655-8457-616ee80afe2e',
        },
      ],
    ]
  : [];

export default defineConfig<ThemeOptions>({
  title: 'DiceBear',
  description:
    'DiceBear is a free, open source avatar library and avatar API with 30+ SVG styles. Generate profile pictures and user placeholder images for any project.',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:site_name', content: 'DiceBear' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'DiceBear',
        url: 'https://www.dicebear.com',
        description:
          'DiceBear is a free, open source avatar library and Avatar API. Generate unique, deterministic SVG avatars and profile pictures with 30+ styles — privacy-focused and self-hostable.',
      }),
    ],
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'DiceBear',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        url: 'https://www.dicebear.com',
        description:
          'Privacy-focused, open source SVG avatar library with 30+ styles. Free Avatar API, JavaScript library, and CLI for generating deterministic profile pictures and user placeholder images.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      }),
    ],
    ...thirdPartyScripts,
  ],
  srcDir: path.join(__dirname, '..', 'pages'),
  transformHead: (ctx) => {
    const result: HeadConfig[] = [];

    if (ctx.pageData.relativePath) {
      const canonicalPath = ctx.pageData.relativePath
        .replace('index.md', '')
        .replace(/\.md$/, '');

      const canonicalUrl = `https://www.dicebear.com/${canonicalPath}`;

      result.push(['link', { rel: 'canonical', href: canonicalUrl }]);

      if (canonicalPath.startsWith('legal/site-notice')) {
        result.push(['meta', { name: 'robots', content: 'noindex, nofollow' }]);
      }

      const pageTitle =
        ctx.pageData.frontmatter.title || ctx.pageData.title || 'DiceBear';
      const pageDescription =
        ctx.pageData.frontmatter.description ||
        ctx.pageData.description ||
        'DiceBear is a free, open source avatar library and Avatar API with 30+ SVG styles.';

      result.push(
        ['meta', { property: 'og:title', content: pageTitle }],
        ['meta', { property: 'og:description', content: pageDescription }],
        ['meta', { property: 'og:url', content: canonicalUrl }],
        ['meta', { name: 'twitter:title', content: pageTitle }],
        ['meta', { name: 'twitter:description', content: pageDescription }],
      );
    }

    return result;
  },
  vite: {
    ssr: {
      noExternal: ['vue-countup-v3', '@ark-ui/vue'],
    },
    resolve: {
      alias: {
        '@playground': path.resolve(__dirname, 'theme/components/playground'),
        '@theme': path.resolve(__dirname, 'theme'),
        './components/VPLocalNav.vue': path.resolve(
          __dirname,
          'theme/components/layout/LayoutVPLocalNav.vue',
        ),
      },
    },
  },
  themeConfig: {
    avatarStyles,
    githubStars,
    siteTitle: '',
    logo: {
      dark: '/logo-dark.svg',
      light: '/logo.svg',
    },
    externalLinkIcon: true,
    search: {
      provider: 'local',
    },
    nav: [
      {
        text: 'Why DiceBear?',
        link: '/why-dicebear/',
      },
      {
        text: 'Documentation',
        link: '/introduction/',
        activeMatch: '^/(introduction|how-to-use|guides)',
      },
      {
        text: 'Styles',
        link: '/styles/',
        activeMatch: '^/styles',
      },
      { text: 'Playground', link: '/playground/', activeMatch: '^/playground' },
      { text: 'Editor', link: 'https://editor.dicebear.com' },
    ],
    outline: [2, 2],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/dicebear/dicebear',
        ariaLabel: 'GitHub',
      },
      {
        icon: {
          svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${siFigma.path}"/></svg>`,
        },
        link: 'https://www.figma.com/@dicebear_com',
        ariaLabel: 'Figma',
      },
      {
        icon: {
          svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${siBluesky.path}"/></svg>`,
        },
        link: 'https://bsky.app/profile/dicebear.bsky.social',
        ariaLabel: 'Bluesky',
      },
    ],
    editLink: {
      pattern:
        'https://github.com/dicebear/dicebear/edit/9.x/apps/docs/pages/:path',
    },
    sidebar: {
      '/introduction/': sidebarDocs,
      '/styles/': sidebarStyles,
      '/how-to-use/': sidebarDocs,
      '/guides/': sidebarDocs,
      '/playground/': sidebarPlayground,
    },
  },
  sitemap: {
    hostname: 'https://www.dicebear.com',
  },
  markdown: {},
});
