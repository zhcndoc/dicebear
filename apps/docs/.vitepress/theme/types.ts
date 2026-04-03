import type { DefaultTheme } from 'vitepress';

export type AvatarStyleMeta = {
  title?: string;
  creator?: string;
  homepage?: string;
  source?: string;
  license?: {
    name?: string;
    url?: string;
    text?: string;
  };
};

export type AvatarStyle = {
  meta: AvatarStyleMeta;
};

export type AvatarStyles = Record<string, AvatarStyle>;

export type ThemeOptions = {
  avatarStyles: AvatarStyles;
  githubStars: Record<string, string>;
} & DefaultTheme.Config;

export type PlaygroundStoreStyle = string;
export type PlaygroundStoreOptions = Record<string, any>;
