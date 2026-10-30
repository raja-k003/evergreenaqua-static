export interface NavLink {
  label: string;
  path: string;
  exact?: boolean;
}

export interface NavGroup {
  label: string;
  children: NavLink[];
}

export type NavItem = NavLink | NavGroup;

export const isGroup = (item: NavItem): item is NavGroup => 'children' in item;

export const PRODUCT_LINKS: NavLink[] = [
  { label: 'All products', path: '/products', exact: true },
  { label: 'Water softeners', path: '/products/water-softeners' },
  { label: 'Softener resin', path: '/products/purolite-softener-resin' },
  { label: 'Sand filters', path: '/products/sand-filters' },
  { label: 'Iron filters', path: '/products/iron-filters' },
  { label: 'Carbon filters', path: '/products/carbon-filters' },
  { label: 'RO water purifiers', path: '/products/ro-water-purifiers' },
];

export const COMPANY_LINKS: NavLink[] = [
  { label: 'About us', path: '/about' },
  { label: 'How it works', path: '/how-it-works' },
  { label: 'Softener calculator', path: '/calculator' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Careers', path: '/careers' },
];

export const MAIN_NAV: NavItem[] = [
  { label: 'Home', path: '/', exact: true },
  { label: 'About', children: COMPANY_LINKS },
  { label: 'Products', children: PRODUCT_LINKS },
  { label: 'Services', path: '/services' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];
