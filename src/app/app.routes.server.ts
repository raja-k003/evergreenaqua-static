import { RenderMode, ServerRoute } from '@angular/ssr';
import { PRERENDER_STATIC_PATHS } from './core/config/pages';
import { BLOG_POSTS } from './core/data/blog';
import { PRODUCTS } from './core/data/products';

/**
 * Rendering strategy per route:
 * - Prerender (SSG) for static content: fastest TTFB, fully rendered HTML.
 * - Server (SSR) for pages whose output depends on the query string
 *   (/products?category=, /blog?page=), because prerendered HTML ignores queries.
 * - Everything else hits the wildcard: server-rendered with HTTP 404.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  ...PRERENDER_STATIC_PATHS.filter((p) => p !== '').map((path) => ({ path, renderMode: RenderMode.Prerender as const })),
  {
    path: 'products/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PRODUCTS.map((p) => ({ slug: p.slug })),
  },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => BLOG_POSTS.map((p) => ({ slug: p.slug })),
  },
  { path: 'products', renderMode: RenderMode.Server },
  { path: 'blog', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server, status: 404, headers: { 'Cache-Control': 'no-store' } },
];
