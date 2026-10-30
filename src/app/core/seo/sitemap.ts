import { PageMeta, PAGES } from '../config/pages';
import { SITE } from '../config/site.config';
import { BLOG_POSTS, sortedPosts } from '../data/blog';
import { PRODUCTS } from '../data/products';
import { totalPages } from '../routing/pagination';
import { canonicalUrl } from './seo-utils';

export interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: PageMeta['changefreq'];
  priority?: number;
}

const xmlEscape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const isIsoDate = (s: string | undefined): s is string => !!s && /^\d{4}-\d{2}-\d{2}/.test(s) && !isNaN(Date.parse(s));

/** Collects every canonical, indexable URL from the same data the pages use. */
export function sitemapEntries(): SitemapEntry[] {
  const latestPost = sortedPosts()[0];
  const blogLastmod = latestPost ? latestPost.updated ?? latestPost.published : SITE.contentUpdated;

  const staticPages: SitemapEntry[] = (Object.values(PAGES) as PageMeta[])
    .filter((p) => p.indexable)
    .map((p) => ({
      path: p.path,
      lastmod: p.path === '/blog' ? blogLastmod : p.lastmod ?? SITE.contentUpdated,
      changefreq: p.changefreq,
      priority: p.priority,
    }));

  const products: SitemapEntry[] = PRODUCTS.map((p) => ({
    path: `/products/${p.slug}`,
    lastmod: SITE.contentUpdated,
    changefreq: 'monthly',
    priority: 0.8,
  }));

  const posts: SitemapEntry[] = BLOG_POSTS.map((p) => ({
    path: `/blog/${p.slug}`,
    lastmod: p.updated ?? p.published,
    changefreq: 'yearly',
    priority: 0.6,
  }));

  // Paginated blog listing pages are self-canonical and indexable (page 1 is /blog).
  const pages = totalPages(BLOG_POSTS.length, SITE.blogPageSize);
  const blogPages: SitemapEntry[] = Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({
    path: `/blog?page=${i + 2}`,
    lastmod: blogLastmod,
    changefreq: 'weekly',
    priority: 0.3,
  }));

  return [...staticPages, ...products, ...posts, ...blogPages];
}

export function buildSitemapXml(entries: SitemapEntry[], baseUrl: string = SITE.baseUrl): string {
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const e of entries) {
    const loc = canonicalUrl(e.path, baseUrl);
    if (seen.has(loc)) continue;
    seen.add(loc);
    const parts = [`    <loc>${xmlEscape(loc)}</loc>`];
    if (isIsoDate(e.lastmod)) parts.push(`    <lastmod>${e.lastmod.slice(0, 10)}</lastmod>`);
    if (e.changefreq) parts.push(`    <changefreq>${e.changefreq}</changefreq>`);
    if (typeof e.priority === 'number') parts.push(`    <priority>${Math.min(1, Math.max(0, e.priority)).toFixed(1)}</priority>`);
    urls.push(`  <url>\n${parts.join('\n')}\n  </url>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

export function buildRobotsTxt(baseUrl: string, indexable: boolean): string {
  if (!indexable) {
    // Staging / preview: keep everything out of search results.
    return 'User-agent: *\nDisallow: /\n';
  }
  return [
    'User-agent: *',
    'Allow: /',
    // API endpoints return JSON, not pages.
    'Disallow: /api/',
    '',
    `Sitemap: ${baseUrl.replace(/\/+$/, '')}/sitemap.xml`,
    '',
  ].join('\n');
}
