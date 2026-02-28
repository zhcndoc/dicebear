import { DefaultTheme } from 'vitepress';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Introduction',
    items: [{ text: 'What is DiceBear?', link: '/introduction/' }],
  },
  {
    text: 'How to use',
    items: [
      {
        text: 'JS-Library',
        link: '/how-to-use/js-library/',
        items: [
          { text: 'Core', link: '/how-to-use/js-library/' },
          { text: 'Converter', link: '/how-to-use/js-library/converter/' },
        ],
      },
      { text: 'HTTP-API', link: '/how-to-use/http-api/' },
      { text: 'CLI', link: '/how-to-use/cli/' },
    ],
  },
  {
    text: 'Frameworks',
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
    text: 'Create Avatar Styles',
    items: [
      {
        text: 'With Figma',
        link: '/guides/create-an-avatar-style-with-figma/',
      },
      {
        text: 'From Scratch',
        link: '/guides/create-an-avatar-style-from-scratch/',
      },
    ],
  },
  {
    text: 'Use Cases',
    items: [
      {
        text: 'Avatar Placeholder',
        link: '/guides/use-as-avatar-placeholder/',
      },
      {
        text: 'Gravatar Default Image',
        link: '/guides/use-the-http-api-as-gravatar-default-image/',
      },
      {
        text: 'Self-host the HTTP-API',
        link: '/guides/host-the-http-api-yourself/',
      },
    ],
  },
  {
    text: 'Advanced',
    items: [
      {
        text: 'Access Style Options',
        link: '/guides/access-all-available-options/',
      },
      {
        text: 'Unique Avatar Count',
        link: '/guides/how-many-unique-avatars/',
      },
      {
        text: 'Use without Tree Shaking',
        link: '/guides/use-the-library-without-tree-shaking/',
      },
      {
        text: 'Use without ESM',
        link: '/guides/use-the-library-without-esm/',
      },
    ],
  },
  {
    text: 'Contributing',
    items: [
      {
        text: 'Documentation',
        link: '/guides/contribute-to-the-documentation/',
      },
      {
        text: 'Editor',
        link: '/guides/contribute-to-the-editor/',
      },
      {
        text: 'API',
        link: '/guides/contribute-to-the-api/',
      },
      {
        text: 'Library',
        link: '/guides/contribute-to-the-library/',
      },
    ],
  },
];

export default sidebar;
