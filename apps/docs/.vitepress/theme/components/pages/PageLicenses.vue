<script setup lang="ts">
import { useData } from 'vitepress';
import type { ThemeOptions } from '@theme/types';
import { kebabCase } from 'change-case';
import { safeHttpUrl } from '@theme/utils/url';

const { theme } = useData<ThemeOptions>();
const styles = theme.value.avatarStyles;
</script>

<template>
  <table v-for="(style, styleName) in styles" :key="styleName">
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
        <td>标题</td>
        <td>{{ style.meta.title }}</td>
      </tr>
      <tr v-if="style.meta.creator">
        <td>作者</td>
        <td>{{ style.meta.creator }}</td>
      </tr>
      <tr v-if="style.meta.source">
        <td>来源</td>
        <td>
          <a v-if="safeHttpUrl(style.meta.source)" :href="safeHttpUrl(style.meta.source)" target="_blank" rel="noopener noreferrer">{{ style.meta.source }}</a>
          <template v-else>{{ style.meta.source }}</template>
        </td>
      </tr>
      <tr v-if="style.meta.homepage">
        <td>主页</td>
        <td>
          <a v-if="safeHttpUrl(style.meta.homepage)" :href="safeHttpUrl(style.meta.homepage)" target="_blank" rel="noopener noreferrer">{{ style.meta.homepage }}</a>
          <template v-else>{{ style.meta.homepage }}</template>
        </td>
      </tr>
      <tr v-if="style.meta.license?.name">
        <td>许可证名称</td>
        <td>{{ style.meta.license?.name }}</td>
      </tr>
      <tr v-if="style.meta.license?.url">
        <td>许可证地址</td>
        <td>
          <a v-if="safeHttpUrl(style.meta.license?.url)" :href="safeHttpUrl(style.meta.license?.url)" target="_blank" rel="noopener noreferrer">{{
            style.meta.license?.url
          }}</a>
          <template v-else>{{ style.meta.license?.url }}</template>
        </td>
      </tr>
    </tbody>
  </table>
</template>
