/// <reference types="vitepress/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}

interface Umami {
  track(event: string, data?: Record<string, string>): void;
}

declare var umami: Umami | undefined;
