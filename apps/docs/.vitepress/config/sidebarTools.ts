import { DefaultTheme } from 'vitepress';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Tools',
    items: [
      { text: 'WCAG Contrast Picker', link: '/tools/contrast/' },
      { text: 'Bundle Size Estimator', link: '/tools/bundle-size/' },
      { text: 'Batch Download', link: '/tools/batch-download/' },
    ],
  },
];

export default sidebar;
