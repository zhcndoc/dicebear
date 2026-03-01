export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export const productLinks: FooterLink[] = [
  { label: 'Playground', href: '/playground/' },
  { label: 'All Styles', href: '/styles/' },
  { label: 'Editor', href: 'https://editor.dicebear.com', external: true },
];

export const resourceLinks: FooterLink[] = [
  { label: 'Documentation', href: '/introduction/' },
  { label: 'JS Library', href: '/how-to-use/js-library/' },
  { label: 'HTTP API', href: '/how-to-use/http-api/' },
  { label: 'CLI', href: '/how-to-use/cli/' },
];

const legalLinks: FooterLink[] = [{ label: 'Licenses', href: '/licenses/' }];

if (import.meta.env.VITE_PRIVACY_POLICY_URL) {
  legalLinks.push({ label: 'Privacy Policy', href: import.meta.env.VITE_PRIVACY_POLICY_URL, external: !import.meta.env.VITE_PRIVACY_POLICY_URL.startsWith('/') });
}

if (import.meta.env.VITE_COOKIE_POLICY_URL) {
  legalLinks.push({ label: 'Cookie Policy', href: import.meta.env.VITE_COOKIE_POLICY_URL, external: !import.meta.env.VITE_COOKIE_POLICY_URL.startsWith('/') });
}

if (import.meta.env.VITE_SITE_NOTICE_URL) {
  legalLinks.push({ label: 'Site Notice', href: import.meta.env.VITE_SITE_NOTICE_URL, external: !import.meta.env.VITE_SITE_NOTICE_URL.startsWith('/') });
}

export { legalLinks };
