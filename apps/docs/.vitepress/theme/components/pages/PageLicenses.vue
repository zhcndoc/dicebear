<script setup lang="ts">
import { useData } from 'vitepress';
import { ThemeOptions } from '@theme/types';
import { kebabCase } from 'change-case';

const { theme } = useData<ThemeOptions>();
const styles = theme.value.avatarStyles;
</script>

<template>
  <table v-for="(style, styleName) in styles">
    <colgroup>
      <col width="20%" />
      <col />
    </colgroup>
    <thead>
      <tr>
        <th colspan="2" align="left">
          <a :href="`/styles/${kebabCase(styleName)}/`">{{
            styleName
          }}</a>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="style.meta.title">
        <td>Title</td>
        <td>{{ style.meta.title }}</td>
      </tr>
      <tr v-if="style.meta.creator">
        <td>Creator</td>
        <td>{{ style.meta.creator }}</td>
      </tr>
      <tr v-if="style.meta.source">
        <td>Source</td>
        <td>
          <a :href="style.meta.source" target="_blank" rel="noopener noreferrer">{{ style.meta.source }}</a>
        </td>
      </tr>
      <tr v-if="style.meta.homepage">
        <td>Homepage</td>
        <td>
          <a :href="style.meta.homepage" target="_blank" rel="noopener noreferrer">{{ style.meta.homepage }}</a>
        </td>
      </tr>
      <tr v-if="style.meta.license?.name">
        <td>License Name</td>
        <td>{{ style.meta.license?.name }}</td>
      </tr>
      <tr v-if="style.meta.license?.url">
        <td>License URL</td>
        <td>
          <a :href="style.meta.license?.url" target="_blank" rel="noopener noreferrer">{{
            style.meta.license?.url
          }}</a>
        </td>
      </tr>
    </tbody>
  </table>
</template>
