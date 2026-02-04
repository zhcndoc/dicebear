import { capitalCase, kebabCase } from 'change-case';
import * as collection from '@dicebear/collection';
import { DefaultTheme } from 'vitepress';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Styles',
    items: Object.keys(collection).map((styleName) => ({
      text: capitalCase(styleName),
      link: `/styles/${kebabCase(styleName)}/`,
    })),
  },
];

export default sidebar;
