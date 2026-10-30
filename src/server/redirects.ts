import { BLOG_POSTS } from '../app/core/data/blog';

/** 301 redirects from the old WordPress URLs to the new clean URLs. */
export const LEGACY_REDIRECTS: Record<string, string> = {
  '/index.php': '/',
  '/home': '/',
  '/about-us': '/about',
  '/testimonial': '/testimonials',
  '/career': '/careers',
  '/products-1': '/products',
  '/product': '/products',
  '/ro-products': '/products/ro-water-purifiers',
  '/marine': '/products',
  '/contact-us': '/contact',
  ...Object.fromEntries(BLOG_POSTS.map((p) => [p.legacyPath, `/blog/${p.slug}`])),
};

/**
 * Returns the redirect target for a request path + query, or null.
 * - legacy URLs → new URLs
 * - trailing slashes removed (/about/ → /about)
 * - duplicate slashes collapsed
 * - /blog?page=1 → /blog (one URL for page one)
 */
export function resolveRedirect(path: string, search: string): string | null {
  let target = path.replace(/\/{2,}/g, '/');
  if (target.length > 1) target = target.replace(/\/+$/, '');
  target = LEGACY_REDIRECTS[target.toLowerCase()] ?? target;

  let query = search;
  if (target === '/blog') {
    const params = new URLSearchParams(search);
    if (params.get('page') === '1') {
      params.delete('page');
      const rest = params.toString();
      query = rest ? `?${rest}` : '';
    }
  }

  const result = target + query;
  return result === path + search ? null : result;
}
