import { capitalCase, kebabCase } from 'change-case';
import { DefaultTheme } from 'vitepress';
import avatarStyles from './avatarStyles';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Styles',
    items: Object.keys(avatarStyles).map((styleName) => ({
      text: capitalCase(styleName),
      link: `/styles/${kebabCase(styleName)}/`,
    })),
  },
];

export default sidebar;
