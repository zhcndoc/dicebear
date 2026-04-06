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
  definitionUrl?: string;
  meta: AvatarStyleMeta;
};

export type AvatarStyles = Record<string, AvatarStyle>;

export type ThemeOptions = {
  avatarStyles: AvatarStyles;
  githubStars: Record<string, string>;
} & DefaultTheme.Config;

export type CustomStyleEntry = {
  name: string;
  definition: object;
};

export type PlaygroundStoreStyle = string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlaygroundStoreOptions = Record<string, any>;
