import { SITE } from './site.config';

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  /** Include in sitemap.xml and allow indexing. */
  indexable: boolean;
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority?: number;
  lastmod?: string;
}

/**
 * Metadata for every static route. Each page component reads its entry, and
 * the sitemap is generated from the same list, so titles, descriptions and
 * sitemap entries can never drift apart.
 */
export const PAGES = {
  home: {
    path: '/',
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
    indexable: true,
    changefreq: 'weekly',
    priority: 1,
  },
  about: {
    path: '/about',
    title: 'About Us – 25 Years of Water Treatment in Chennai',
    description: 'Evergreen Aqua has spent 25 years solving hard water, iron and turbidity problems for Chennai homes and businesses. Our vision, mission and approach.',
    indexable: true,
    changefreq: 'yearly',
    priority: 0.6,
  },
  services: {
    path: '/services',
    title: 'Water Softener Installation & Service in Chennai',
    description: 'On-site water testing, installation, recharging and maintenance for water softeners, sand, iron and carbon filters and RO purifiers across Chennai.',
    indexable: true,
    changefreq: 'monthly',
    priority: 0.8,
  },
  howItWorks: {
    path: '/how-it-works',
    title: 'How a Water Softener Works – Hard Water Explained',
    description: 'What makes water hard, the problems it causes at home, and how an ion-exchange water softener removes calcium and magnesium step by step.',
    indexable: true,
    changefreq: 'yearly',
    priority: 0.6,
  },
  products: {
    path: '/products',
    title: 'Water Softeners, Filters & RO Purifiers – Products',
    description: 'Compare Evergreen Aqua water softeners, sand, iron and carbon filters, softener resin and RO + UV purifiers, with model prices.',
    indexable: true,
    changefreq: 'monthly',
    priority: 0.9,
  },
  ro: {
    path: '/products/ro-water-purifiers',
    title: 'RO + UV + Alkaline Water Purifiers – Prices in Chennai',
    description: 'RO + UV water purifiers with alkaline and copper stages from ₹9,990, including Kent and Aqua models. Supplied and installed in Chennai.',
    indexable: true,
    changefreq: 'monthly',
    priority: 0.8,
  },
  calculator: {
    path: '/calculator',
    title: 'Water Softener Calculator – Salt, Resin Size & MPV Settings',
    description: 'Free water softener calculator: work out salt and regeneration chemistry, the resin size you need and multiport valve settings from your water hardness.',
    indexable: true,
    changefreq: 'yearly',
    priority: 0.7,
  },
  testimonials: {
    path: '/testimonials',
    title: 'Customer Reviews & Testimonials',
    description: 'What Chennai homeowners say about their Evergreen Aqua water softeners and filters: softer water, no more scale and longer-lasting appliances.',
    indexable: true,
    changefreq: 'monthly',
    priority: 0.5,
  },
  faq: {
    path: '/faq',
    title: 'Water Softener FAQ – Installation, Maintenance & Safety',
    description: 'Answers to common questions about water softeners: how ion exchange works, installation, maintenance, drinking softened water and lifespan.',
    indexable: true,
    changefreq: 'monthly',
    priority: 0.6,
  },
  careers: {
    path: '/careers',
    title: 'Careers – Join Our Team in Chennai',
    description: 'Full-time openings at Evergreen Aqua in Chennai: customer service, technical support, marketing and operations.',
    indexable: true,
    changefreq: 'monthly',
    priority: 0.4,
  },
  gallery: {
    path: '/gallery',
    title: 'Installation Gallery – Our Completed Projects',
    description: 'Photos of water softener, sand, iron and carbon filter installations completed by Evergreen Aqua at homes and apartments across Chennai.',
    indexable: true,
    changefreq: 'monthly',
    priority: 0.5,
  },
  blog: {
    path: '/blog',
    title: 'Water Treatment Blog – Tips & Guides',
    description: 'Guides on hard water, water softener maintenance and choosing the right water treatment system for your home.',
    indexable: true,
    changefreq: 'weekly',
    priority: 0.7,
  },
  contact: {
    path: '/contact',
    title: 'Contact Us – Book a Free Water Test in Chennai',
    description: 'Call +91 73388 88636 or send an enquiry to book a water test. Visit us at Kamakotti Nagar, Pallikaranai, Chennai. Open Mon–Sat, 9 am–5 pm.',
    indexable: true,
    changefreq: 'yearly',
    priority: 0.8,
  },
  notFound: {
    path: '/404',
    title: 'Page not found',
    description: 'The page you are looking for does not exist or has moved.',
    indexable: false,
  },
} satisfies Record<string, PageMeta>;

export type PageKey = keyof typeof PAGES;

/** Static paths that are safe to prerender at build time. */
export const PRERENDER_STATIC_PATHS = Object.values(PAGES as Record<string, PageMeta>)
  .filter((p) => p.indexable && p.path !== '/products' && p.path !== '/blog')
  .map((p) => p.path.replace(/^\//, ''));
