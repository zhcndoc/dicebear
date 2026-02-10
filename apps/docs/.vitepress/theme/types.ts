import type { StyleMeta, StyleSchema } from '@dicebear/core';
import type { DefaultTheme } from 'vitepress';

export type AvatarStyle = {
  meta: StyleMeta;
  schema: StyleSchema;
};

export type AvatarStyles = Record<string, AvatarStyle>;

export type ThemeOptions = {
  avatarStyles: AvatarStyles;
  githubStars: Record<string, string>;
} & DefaultTheme.Config;

export type PlaygroundStoreStyle = string;
export type PlaygroundStoreOptions = Record<string, any>;
