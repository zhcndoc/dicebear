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

declare const __LEGAL_PRIVACY_POLICY_URL__: string;
declare const __LEGAL_COOKIE_POLICY_URL__: string;
declare const __LEGAL_SITE_NOTICE_URL__: string;
