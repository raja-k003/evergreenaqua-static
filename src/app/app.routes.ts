import { Routes } from '@angular/router';
import { BLOG_SLUGS } from './core/data/blog';
import { PRODUCT_SLUGS } from './core/data/products';
import { slugIn } from './core/routing/route-utils';
import { Home } from './pages/home/home';

/**
 * Clean, descriptive URLs. Home is eager (fastest LCP); every other page is a
 * lazy chunk. Legacy WordPress URLs are 301-redirected in server.ts.
 */
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.About) },
  { path: 'services', loadComponent: () => import('./pages/services/services').then((m) => m.Services) },
  { path: 'how-it-works', loadComponent: () => import('./pages/how-it-works/how-it-works').then((m) => m.HowItWorks) },
  { path: 'products', loadComponent: () => import('./pages/products/products').then((m) => m.Products) },
  {
    path: 'products/ro-water-purifiers',
    loadComponent: () => import('./pages/ro-purifiers/ro-purifiers').then((m) => m.RoPurifiers),
  },
  {
    path: 'products/:slug',
    canMatch: [slugIn(PRODUCT_SLUGS)],
    loadComponent: () => import('./pages/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  { path: 'calculator', loadComponent: () => import('./pages/calculator/calculator').then((m) => m.Calculator) },
  { path: 'testimonials', loadComponent: () => import('./pages/testimonials/testimonials').then((m) => m.Testimonials) },
  { path: 'faq', loadComponent: () => import('./pages/faq/faq').then((m) => m.FaqPage) },
  { path: 'careers', loadComponent: () => import('./pages/careers/careers').then((m) => m.Careers) },
  { path: 'gallery', loadComponent: () => import('./pages/gallery/gallery').then((m) => m.Gallery) },
  { path: 'blog', loadComponent: () => import('./pages/blog/blog').then((m) => m.Blog) },
  {
    path: 'blog/:slug',
    canMatch: [slugIn(BLOG_SLUGS)],
    loadComponent: () => import('./pages/blog-post/blog-post').then((m) => m.BlogPostPage),
  },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound) },
];
