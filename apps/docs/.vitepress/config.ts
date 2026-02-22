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

export default defineConfig<ThemeOptions>({
  title: 'DiceBear',
  description:
    'DiceBear is a free, open source avatar generator with 30+ styles. Create unique avatars for your project in no time.',
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
          'DiceBear is a free, open source avatar generator and avatar library. Create unique avatars, profile pictures, and user placeholder images with 30+ styles.',
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
          'Open source avatar generator and avatar library with 30+ styles. Free avatar API, JavaScript library, and CLI.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      }),
    ],
    [
      'script',
      { type: 'text/javascript' },
      `
      var _iub = _iub || [];
      _iub.csConfiguration = {"siteId":3488029,"cookiePolicyId":57216581,"lang":"en","storage":{"useSiteId":true}};
    `,
    ],
    [
      'script',
      {
        type: 'text/javascript',
        src: 'https://cs.iubenda.com/autoblocking/3488029.js',
      },
    ],
    [
      'script',
      { type: 'text/javascript', src: '//cdn.iubenda.com/cs/gpp/stub.js' },
    ],
    [
      'script',
      {
        type: 'text/javascript',
        src: '//cdn.iubenda.com/cs/iubenda_cs.js',
        charset: 'UTF-8',
        async: '',
      },
    ],
    [
      'script',
      {
        defer: '',
        src: 'https://hi.dicebear.com/script.js',
        'data-website-id': '69953f4f-b70c-4534-8ccb-370f4e9da028',
      },
    ],
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
        'DiceBear is a free, open source avatar generator and avatar library with 30+ styles.';

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
      { icon: 'github', link: 'https://github.com/dicebear/dicebear', ariaLabel: 'GitHub' },
      {
        icon: { svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${siFigma.path}"/></svg>` },
        link: 'https://www.figma.com/@dicebear_com',
        ariaLabel: 'Figma',
      },
      {
        icon: { svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${siBluesky.path}"/></svg>` },
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
