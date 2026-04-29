import * as path from 'node:path';
import { defineConfig, HeadConfig } from 'vitepress';
import { ThemeOptions } from '@theme/types';

import sidebarDocs from './config/sidebarDocs';
import sidebarStyles from './config/sidebarStyles';
import avatarStyles from './config/avatarStyles';
import { formatStars } from './theme/utils/format';

async function fetchGitHubStars(
  repos: string[],
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  const TIMEOUT_MS = 5000;

  await Promise.all(
    repos.map(async (repo) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          result[repo] = formatStars(data.stargazers_count);
        }
      } catch (err) {
        console.warn(
          `[github-stars] failed for ${repo}:`,
          err instanceof Error ? err.message : err,
        );
      } finally {
        clearTimeout(timer);
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
          src: 'https://u.dicebear.com/script.js',
          'data-website-id': '75d27df5-3441-4530-8f29-70d04ae9085e',
        },
      ],
    ]
  : [];

export default defineConfig<ThemeOptions>({
  title: 'DiceBear 中文文档',
  description:
    'DiceBear 是一个免费、开源的头像库和头像 API，提供 30 多种 SVG 风格。可为任何项目生成个人资料图片和用户占位图像。',
  head: [
    ['script', { async: '', src: 'https://www.zhcndoc.com/js/common.js' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'DiceBear' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
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
        url: 'https://dicebear.zhcndoc.com',
        description:
          'DiceBear 是一个免费的开源头像库和头像 API。可生成独特、可预测的 SVG 头像和个人资料图片，拥有 30 多种风格——注重隐私且可自托管。',
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
        url: 'https://dicebear.zhcndoc.com',
        description:
          '注重隐私的开源 SVG 头像库，提供 30 多种样式。可用于生成确定性的个人资料图片和用户占位图像的免费 Avatar API、JavaScript 库和 CLI。',
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

      const canonicalUrl = `https://dicebear.zhcndoc.com/${canonicalPath}`;

      result.push(['link', { rel: 'canonical', href: canonicalUrl }]);

      if (canonicalPath.startsWith('legal/site-notice')) {
        result.push(['meta', { name: 'robots', content: 'noindex, nofollow' }]);
      }

      const pageTitle =
        ctx.pageData.frontmatter.title || ctx.pageData.title || 'DiceBear';
      const pageDescription =
        ctx.pageData.frontmatter.description ||
        ctx.pageData.description ||
        'DiceBear 是一个免费的开源头像库和头像 API，拥有 30 多种 SVG 风格。';

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
      noExternal: [
        'vue-countup-v3',
        'vue-chartjs',
        'globe.gl',
        'three',
      ],
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
        text: '文档',
        link: '/introduction/',
        activeMatch: '^/(introduction|how-to-use|guides|specification)',
      },
      {
        text: '风格',
        link: '/styles/',
        activeMatch: '^/styles',
      },
      { text: '游乐场', link: '/playground/', activeMatch: '^/playground' },
      { text: '统计', link: '/stats/', activeMatch: '^/stats' },
      { text: '简中文档', link: 'https://www.zhcndoc.com', target: '_blank' },
      { text: '编辑器', link: 'https://editor.dicebear.com' },
    ],
    outline: [2, 2],
    socialLinks: [],
    editLink: {
      pattern:
        'https://github.com/zhcndoc/dicebear/edit/main/apps/docs/pages/:path',
    },
    sidebar: {
      '/introduction/': sidebarDocs,
      '/styles/': sidebarStyles,
      '/how-to-use/': sidebarDocs,
      '/guides/': sidebarDocs,
      '/specification/': sidebarDocs,
    },
  },
  sitemap: {
    hostname: 'https://dicebear.zhcndoc.com',
  },
  markdown: {},
});
