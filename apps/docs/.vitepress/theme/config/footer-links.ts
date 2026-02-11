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

export const legalLinks: FooterLink[] = [
  { label: 'Licenses', href: '/licenses/' },
  {
    label: 'Privacy Policy',
    href: 'https://www.iubenda.com/privacy-policy/57216581/full-legal',
    external: true,
  },
  {
    label: 'Cookie Policy',
    href: 'https://www.iubenda.com/privacy-policy/57216581/cookie-policy',
    external: true,
  },
  { label: 'Site Notice', href: '/legal/site-notice/' },
];
