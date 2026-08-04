import { safeHttpUrl } from '@theme/utils/url';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export const productLinks: FooterLink[] = [
  { label: '为什么选择 DiceBear？', href: '/why-dicebear/' },
  { label: '动态头像', href: '/animated-avatars/' },
  { label: '游乐场', href: '/playground/' },
  { label: '全部风格', href: '/styles/' },
  { label: '工具', href: '/tools/' },
  { label: '编辑器', href: 'https://editor.dicebear.com', external: true },
];

export const resourceLinks: FooterLink[] = [
  { label: '文档', href: '/introduction/' },
  { label: 'JS 库', href: '/how-to-use/js-library/' },
  { label: 'HTTP API', href: '/how-to-use/http-api/' },
  { label: 'CLI', href: '/how-to-use/cli/' },
  { label: '统计数据', href: '/stats/' },
];

// Older major versions keep their docs on a subdomain of their own. This list
// replaces the version dropdown that used to sit in the top nav.
export const versionLinks: FooterLink[] = [
  { label: '10.x (current)', href: '/' },
  { label: '9.x', href: 'https://v9.dicebear.com', external: true },
];

function buildLegalLink(
  label: string,
  rawHref: string | undefined,
): FooterLink | null {
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
  buildLegalLink('法律声明', import.meta.env.VITE_LEGAL_NOTICE_URL),
].filter((link): link is FooterLink => link !== null);
