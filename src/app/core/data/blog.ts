import { image, SiteImage } from './images';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  published: string; // ISO date
  updated?: string;
  author: string;
  readingMinutes: number;
  image: SiteImage;
  /** Old WordPress path, 301-redirected to the new URL by the server. */
  legacyPath?: string;
  relatedProduct?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'signs-of-hard-water',
    title: 'Common signs of hard water and why a water softener is essential',
    description: 'Scale on taps, soap scum, stiff laundry and spotty glasses are all signs of hard water. Learn what causes them and how a water softener helps.',
    excerpt: 'White scale on taps, soap that will not lather and stiff, dull laundry all point to the same cause.',
    published: '2023-12-09',
    author: 'Evergreen Aqua Systems',
    readingMinutes: 4,
    image: image('blog-signs-of-hard-water', 'Person washing hands under a kitchen tap'),
    legacyPath: '/2023/12/09/common-signs-of-hard-water-and-why-a-water-softener-is-essential-2',
    relatedProduct: 'water-softeners',
  },
  {
    slug: 'water-softener-maintenance-tips',
    title: 'DIY maintenance tips for your water softener system',
    description: 'Simple maintenance steps that keep a water softener working: salt levels, salt bridges, brine tank cleaning, resin care and hardness testing.',
    excerpt: 'A few minutes of regular care keeps your softener working at full capacity for years.',
    published: '2023-12-08',
    author: 'Evergreen Aqua Systems',
    readingMinutes: 4,
    image: image('blog-water-softener-maintenance', 'Hands under water running from a tap'),
    legacyPath: '/2023/12/08/diy-maintenance-tips-for-your-water-softener-system',
    relatedProduct: 'water-softeners',
  },
  {
    slug: 'choosing-the-right-water-softener',
    title: 'Choosing the right water softener: a complete guide',
    description: 'How to choose a water softener: test your hardness, compare salt-based and salt-free systems, size the capacity and flow rate, and plan running costs.',
    excerpt: 'Hardness, household size, regeneration type and running cost all decide which softener is right for you.',
    published: '2023-12-08',
    author: 'Evergreen Aqua Systems',
    readingMinutes: 5,
    image: image('blog-choosing-water-softener', 'Technician checking a wall-mounted water heater'),
    legacyPath: '/2023/12/08/common-signs-of-hard-water-and-why-a-water-softener-is-essential',
    relatedProduct: 'water-softeners',
  },
  {
    slug: 'iron-in-borewell-water',
    title: 'Iron in borewell water: signs, problems and how to remove it',
    description: 'Rusty stains, a metallic taste and orange-brown water point to iron in your borewell supply. Learn the causes and how an iron removal filter fixes it.',
    excerpt: 'Orange stains on tiles, a metallic taste and yellow-tinged water are classic signs of iron in your water.',
    published: '2024-05-06',
    author: 'Evergreen Aqua Systems',
    readingMinutes: 4,
    image: image('iron-filter', 'Iron removal filter vessel installed for a home'),
    relatedProduct: 'iron-filters',
  },
  {
    slug: 'sand-and-carbon-filters-explained',
    title: 'Sand filters and carbon filters: what each one does',
    description: 'Sand filters remove dirt and turbidity; activated carbon filters remove chlorine, odour and colour. See how they work and when you need both.',
    excerpt: 'Sand filters catch visible dirt, carbon filters clear smell and taste. Here is how to tell which your home needs.',
    published: '2024-05-13',
    author: 'Evergreen Aqua Systems',
    readingMinutes: 4,
    image: image('carbon-filter', 'Activated carbon filter vessel'),
    relatedProduct: 'carbon-filters',
  },
];

export const BLOG_SLUGS = new Set(BLOG_POSTS.map((p) => p.slug));

export const findPost = (slug: string | null | undefined): BlogPost | undefined =>
  slug ? BLOG_POSTS.find((p) => p.slug === slug) : undefined;

/** Posts sorted newest first. */
export const sortedPosts = (): BlogPost[] =>
  [...BLOG_POSTS].sort((a, b) => b.published.localeCompare(a.published));
