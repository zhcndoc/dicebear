import { capitalCase } from 'change-case';
import { DefaultTheme } from 'vitepress';
import avatarStyles from './avatarStyles';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '头像风格',
    items: Object.keys(avatarStyles)
      .sort((a, b) => a.localeCompare(b))
      .map((styleName) => ({
        text: capitalCase(styleName),
        link: `/styles/${styleName}/`,
      })),
  },
];

export default sidebar;
