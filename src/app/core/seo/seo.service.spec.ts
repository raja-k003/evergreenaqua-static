import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SITE } from '../config/site.config';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let seo: SeoService;
  let doc: Document;
  const q = (sel: string) => doc.head.querySelectorAll(sel);
  const content = (sel: string) => doc.head.querySelector(sel)?.getAttribute('content');

  beforeEach(() => {
    TestBed.configureTestingModule({});
    seo = TestBed.inject(SeoService);
    doc = TestBed.inject(DOCUMENT);
    doc.head.querySelectorAll('meta, link[rel=canonical], script[data-seo-jsonld]').forEach((e) => e.remove());
  });

  it('sets title with the site template, description and canonical', () => {
    seo.setPage({ title: 'Sand filters', description: 'Clear water.', path: '/products/sand-filters' });
    expect(doc.title).toBe('Sand filters | Evergreen Aqua');
    expect(content('meta[name=description]')).toBe('Clear water.');
    expect(q('link[rel=canonical]')[0].getAttribute('href')).toBe(`${SITE.baseUrl}/products/sand-filters`);
    expect(content('meta[name=robots]')).toContain('index, follow');
  });

  it('sets Open Graph and Twitter tags with absolute URLs', () => {
    seo.setPage({ title: 'About', description: 'd', path: '/about', image: { url: '/images/a.webp', alt: 'Alt' } });
    expect(content('meta[property="og:url"]')).toBe(`${SITE.baseUrl}/about`);
    expect(content('meta[property="og:image"]')).toBe(`${SITE.baseUrl}/images/a.webp`);
    expect(content('meta[property="og:locale"]')).toBe('en_IN');
    expect(content('meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(content('meta[name="twitter:image:alt"]')).toBe('Alt');
    expect(doc.documentElement.lang).toBe('en-IN');
  });

  it('never duplicates tags across navigations', () => {
    seo.setPage({ title: 'A', description: 'a', path: '/a' });
    seo.setPage({ title: 'B', description: 'b', path: '/b' });
    expect(q('meta[name=description]').length).toBe(1);
    expect(q('meta[property="og:title"]').length).toBe(1);
    expect(q('link[rel=canonical]').length).toBe(1);
    expect(content('meta[name=description]')).toBe('b');
  });

  it('removes article tags when moving to a non-article page', () => {
    seo.setPage({ title: 'Post', description: 'p', path: '/blog/x', type: 'article', article: { publishedTime: '2023-12-09' } });
    expect(content('meta[property="article:published_time"]')).toBe('2023-12-09');
    seo.setPage({ title: 'Home', description: 'h', path: '/' });
    expect(q('meta[property="article:published_time"]').length).toBe(0);
  });

  it('noindex pages get a noindex robots tag and no canonical', () => {
    seo.setPage({ title: 'A', description: 'a', path: '/a' });
    seo.setPage({ title: 'Filtered', description: 'f', path: '/products', noindex: true });
    expect(content('meta[name=robots]')).toBe('noindex, follow');
    expect(q('link[rel=canonical]').length).toBe(0);
  });

  it('replaces JSON-LD and builds BreadcrumbList from breadcrumbs', () => {
    seo.setPage({
      title: 'A', description: 'a', path: '/products/x',
      breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'X' }],
      jsonLd: { '@type': 'Product', name: 'X' },
    });
    let scripts = q('script[type="application/ld+json"]');
    expect(scripts.length).toBe(2);
    const crumbs = JSON.parse(scripts[0].textContent!);
    expect(crumbs['@type']).toBe('BreadcrumbList');
    expect(crumbs.itemListElement[1].item).toBe(`${SITE.baseUrl}/products/x`);

    seo.setPage({ title: 'B', description: 'b', path: '/b' });
    scripts = q('script[type="application/ld+json"]');
    expect(scripts.length).toBe(0);
  });

  it('handles missing or invalid data safely', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    seo.setPage({ title: '  ', description: '', path: 'relative', jsonLd: [{ name: 'no type' } as never] });
    expect(doc.title).toBe(SITE.defaultTitle);
    expect(content('meta[name=description]')).toBe(SITE.defaultDescription);
    expect(q('link[rel=canonical]')[0].getAttribute('href')).toBe(`${SITE.baseUrl}/`);
    expect(q('script[type="application/ld+json"]').length).toBe(0);
    warn.mockRestore();
  });

  it('clamps long descriptions to 160 characters', () => {
    seo.setPage({ title: 'A', description: 'word '.repeat(80), path: '/' });
    expect(content('meta[name=description]')!.length).toBeLessThanOrEqual(160);
  });
});
