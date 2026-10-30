import { resolveRedirect } from './redirects';

describe('resolveRedirect', () => {
  it('maps legacy WordPress URLs', () => {
    expect(resolveRedirect('/contact-us/', '')).toBe('/contact');
    expect(resolveRedirect('/ro-products', '')).toBe('/products/ro-water-purifiers');
    expect(resolveRedirect('/2023/12/08/diy-maintenance-tips-for-your-water-softener-system/', '')).toBe(
      '/blog/water-softener-maintenance-tips',
    );
  });

  it('removes trailing slashes but keeps the query', () => {
    expect(resolveRedirect('/about/', '?x=1')).toBe('/about?x=1');
  });

  it('collapses /blog?page=1 to /blog', () => {
    expect(resolveRedirect('/blog', '?page=1')).toBe('/blog');
  });

  it('returns null when no redirect is needed', () => {
    expect(resolveRedirect('/', '')).toBeNull();
    expect(resolveRedirect('/about', '')).toBeNull();
    expect(resolveRedirect('/blog', '?page=2')).toBeNull();
  });
});
