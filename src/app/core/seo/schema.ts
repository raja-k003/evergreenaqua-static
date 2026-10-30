import { SITE } from '../config/site.config';
import { BlogPost } from '../data/blog';
import { absoluteImageUrl } from '../data/images';
import { highestPrice, lowestPrice, Product } from '../data/products';
import { RoPurifier, Faq } from '../data/content';
import { Breadcrumb, JsonLd } from './seo.models';
import { canonicalUrl } from './seo-utils';

const abs = (path: string) => canonicalUrl(path, SITE.baseUrl);
const ORG_ID = `${SITE.baseUrl}/#organization`;
const WEBSITE_ID = `${SITE.baseUrl}/#website`;

/**
 * LocalBusiness (a subtype of Organization) for the business itself.
 * Used on the home and contact pages; other pages reference it by @id.
 */
export function localBusinessSchema(): JsonLd {
  const a = SITE.address;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.defaultDescription,
    url: abs('/'),
    logo: { '@type': 'ImageObject', url: absoluteImageUrl(SITE.logo.url, SITE.baseUrl), width: SITE.logo.width, height: SITE.logo.height },
    image: absoluteImageUrl(SITE.defaultOgImage.url, SITE.baseUrl),
    telephone: SITE.phones[0].e164,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: `${a.locality}, ${a.city}`,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    areaServed: { '@type': 'City', name: 'Chennai' },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: SITE.hours.days.map((d) => `https://schema.org/${d}`),
        opens: SITE.hours.opens,
        closes: SITE.hours.closes,
      },
    ],
    contactPoint: SITE.phones.map((p) => ({
      '@type': 'ContactPoint',
      telephone: p.e164,
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'ta'],
    })),
    sameAs: SITE.social.map((s) => s.url),
  };
}

export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    url: abs('/'),
    inLanguage: SITE.lang,
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbSchema(items: Breadcrumb[], currentPath: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: abs(item.path ?? currentPath),
    })),
  };
}

export function articleSchema(post: BlogPost): JsonLd {
  const url = abs(`/blog/${post.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.description,
    image: [absoluteImageUrl(post.image.src, SITE.baseUrl)],
    datePublished: post.published,
    dateModified: post.updated ?? post.published,
    inLanguage: SITE.lang,
    author: { '@type': 'Organization', name: post.author, url: abs('/about') },
    publisher: { '@id': ORG_ID },
  };
}

/**
 * Product schema is only emitted for products with real, published prices.
 * We never invent ratings, reviews or availability.
 */
export function productSchema(product: Product): JsonLd | null {
  const low = lowestPrice(product);
  const high = highestPrice(product);
  if (low === undefined || high === undefined) return null;
  const url = abs(`/products/${product.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: `Evergreen Aqua ${product.name}`,
    description: product.summary,
    image: [absoluteImageUrl(product.image.src, SITE.baseUrl)],
    brand: { '@type': 'Brand', name: SITE.shortName },
    url,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: low,
      highPrice: high,
      offerCount: product.models?.length ?? 1,
      seller: { '@id': ORG_ID },
    },
  };
}

export function roItemListSchema(items: RoPurifier[]): JsonLd {
  const url = abs('/products/ro-water-purifiers');
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'RO water purifiers',
    itemListElement: items.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        brand: { '@type': 'Brand', name: p.brand },
        image: absoluteImageUrl(p.image.src, SITE.baseUrl),
        url,
        offers: { '@type': 'Offer', price: p.price, priceCurrency: 'INR', url, seller: { '@id': ORG_ID } },
      },
    })),
  };
}

/**
 * FAQPage markup is valid for genuine Q&A content. Note: Google currently
 * shows FAQ rich results mainly for authoritative government and health
 * sites, so this mostly helps other search and AI engines understand the page.
 */
export function faqSchema(faqs: Faq[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
