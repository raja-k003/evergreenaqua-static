/**
 * Single source of truth for business details and SEO defaults.
 * Change `baseUrl` before deploying to a different domain: canonical URLs,
 * Open Graph URLs, the sitemap and JSON-LD are all derived from it.
 */
export const SITE = {
  baseUrl: 'https://smparamount.in',
  name: 'Evergreen Aqua',
  shortName: 'Evergreen Aqua',
  legalName: 'Evergreen Aqua',
  tagline: 'Water softeners, sand, iron and carbon filters in Chennai',
  titleTemplate: '%s | Evergreen Aqua',
  defaultTitle: 'Water Softeners & Filters in Chennai | Evergreen Aqua',
  defaultDescription:
    'Water softeners, sand, iron and carbon filters and RO purifiers for Chennai homes and businesses. 25 years of experience and a 1-year warranty.',
  lang: 'en-IN',
  ogLocale: 'en_IN',
  yearsOfExperience: 25,
  warrantyYears: 1,
  logo: {
    url: '/images/sm-paramount-logo.png',
    width: 600,
    height: 325,
  },
  /** 1200×630 social-share image used when a page has no image of its own. */
  defaultOgImage: {
    url: '/images/sm-paramount-og.jpg',
    alt: 'Evergreen Aqua water softeners and filters in Chennai',
    width: 1200,
    height: 630,
  },
  brochureUrl: '/brochures/sm-paramount-brochure.pdf',
  phones: [
    { display: '+91 73388 88636', e164: '+917338888636' },
    { display: '+91 98413 13297', e164: '+919841313297' },
  ],
  whatsapp: { display: '+91 98413 13297', number: '919841313297' },
  email: 'paramountwatersolution@gmail.com',
  address: {
    street: 'No. 126, Kamakotti Nagar, 5th Street',
    locality: 'Pallikaranai',
    city: 'Chennai',
    region: 'Tamil Nadu',
    postalCode: '600100',
    country: 'IN',
  },
  hours: { label: 'Mon – Sat, 9 am – 5 pm', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '17:00' },
  social: [
    { name: 'Facebook', url: 'https://www.facebook.com/people/Smparamount/61557440339011/', icon: 'facebook' },
    { name: 'Instagram', url: 'https://www.instagram.com/smparamount/', icon: 'instagram' },
    { name: 'YouTube', url: 'https://www.youtube.com/channel/UCa4kq1LRog3kxXk-6ltcTSQ', icon: 'youtube' },
  ],
  /** Date the static page copy was last meaningfully changed (used as sitemap lastmod). */
  contentUpdated: '2026-10-28',
  blogPageSize: 6,
} as const;

export const fullAddress = (): string => {
  const a = SITE.address;
  return `${a.street}, ${a.locality}, ${a.city} – ${a.postalCode}`;
};

export const whatsappLink = (text = 'Hi Evergreen Aqua, I would like to know more about your water solutions.'): string =>
  `https://wa.me/${SITE.whatsapp.number}?text=${encodeURIComponent(text)}`;
