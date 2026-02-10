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
  { label: 'HTTP API', href: '/how-to-use/http-api/' },
  {
    label: 'GitHub',
    href: 'https://github.com/dicebear/dicebear',
    external: true,
  },
  {
    label: 'Figma',
    href: 'https://www.figma.com/@dicebear_com',
    external: true,
  },
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
