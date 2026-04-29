import { safeHttpUrl } from '@theme/utils/url';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export const productLinks: FooterLink[] = [
  { label: '为什么选择 DiceBear？', href: '/why-dicebear/' },
  { label: 'Playground', href: '/playground/' },
  { label: '全部风格', href: '/styles/' },
  { label: '编辑器', href: 'https://editor.dicebear.com', external: true },
];

export const resourceLinks: FooterLink[] = [
  { label: '文档', href: '/introduction/' },
  { label: 'JS 库', href: '/how-to-use/js-library/' },
  { label: 'HTTP API', href: '/how-to-use/http-api/' },
  { label: 'CLI', href: '/how-to-use/cli/' },
  { label: '统计', href: '/stats/' },
];

function buildLegalLink(label: string, rawHref: string | undefined): FooterLink | null {
  if (!rawHref) {
    return null;
  }

  const isExternal = /^https?:\/\//.test(rawHref);

  if (isExternal && !safeHttpUrl(rawHref)) {
    return null;
  }

  return { label, href: rawHref, external: isExternal || undefined };
}

export const legalLinks: FooterLink[] = [
  { label: '许可证', href: '/licenses/' },
  buildLegalLink('隐私政策', import.meta.env.VITE_PRIVACY_POLICY_URL),
  buildLegalLink('Cookie 政策', import.meta.env.VITE_COOKIE_POLICY_URL),
  buildLegalLink('网站声明', import.meta.env.VITE_SITE_NOTICE_URL),
].filter((link): link is FooterLink => link !== null);
