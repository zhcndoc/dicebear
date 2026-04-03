import { capitalCase } from 'change-case';
import { DefaultTheme } from 'vitepress';
import avatarStyles from './avatarStyles';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Styles',
    items: Object.keys(avatarStyles).map((styleName) => ({
      text: capitalCase(styleName),
      link: `/styles/${styleName}/`,
    })),
  },
];

export default sidebar;
