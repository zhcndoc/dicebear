import { DefaultTheme } from 'vitepress';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '介绍',
    items: [{ text: '什么是 DiceBear？', link: '/introduction/' }],
  },
  {
    text: '使用方式',
    items: [
      {
        text: 'JS 库',
        link: '/how-to-use/js-library/',
        items: [
          { text: '核心', link: '/how-to-use/js-library/' },
          { text: '转换器', link: '/how-to-use/js-library/converter/' },
        ],
      },
      { text: 'PHP 库', link: '/how-to-use/php-library/' },
      { text: 'HTTP API', link: '/how-to-use/http-api/' },
      { text: 'CLI', link: '/how-to-use/cli/' },
    ],
  },
  {
    text: '框架',
    items: [
      {
        text: 'Angular',
        link: '/guides/use-the-library-with-angular/',
      },
      {
        text: 'React',
        link: '/guides/use-the-library-with-react/',
      },
      {
        text: 'React Native',
        link: '/guides/use-the-library-with-react-native/',
      },
      {
        text: 'Svelte',
        link: '/guides/use-the-library-with-svelte/',
      },
      {
        text: 'Vue',
        link: '/guides/use-the-library-with-vue/',
      },
    ],
  },
  {
    text: '自定义风格',
    items: [
      {
        text: '使用 Figma',
        link: '/guides/create-an-avatar-style-with-figma/',
      },
      {
        text: '从零开始',
        link: '/guides/create-an-avatar-style-from-scratch/',
      },
    ],
  },
  {
    text: '规范',
    items: [
      {
        text: '定义模式',
        link: '/specification/definition-schema/',
      },
      {
        text: '实现 DiceBear Core',
        link: '/specification/implement-dicebear-core/',
      },
    ],
  },
  {
    text: '使用场景',
    items: [
      {
        text: '头像占位符',
        link: '/guides/use-as-avatar-placeholder/',
      },
      {
        text: 'Gravatar 默认头像',
        link: '/guides/use-the-http-api-as-gravatar-default-image/',
      },
      {
        text: '自托管 HTTP API',
        link: '/guides/host-the-http-api-yourself/',
      },
    ],
  },
  {
    text: '进阶',
    items: [
      {
        text: '访问风格选项',
        link: '/guides/access-all-available-options/',
      },
      {
        text: '唯一头像数量',
        link: '/guides/how-many-unique-avatars/',
      },
    ],
  },
  {
    text: '参与贡献',
    items: [
      {
        text: '文档',
        link: '/guides/contribute-to-the-documentation/',
      },
      {
        text: '编辑器',
        link: '/guides/contribute-to-the-editor/',
      },
      {
        text: 'API',
        link: '/guides/contribute-to-the-api/',
      },
      {
        text: '核心库',
        link: '/guides/contribute-to-the-library/',
      },
    ],
  },
];

export default sidebar;
