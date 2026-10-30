import { pagePath, paginate, parsePage, totalPages } from './pagination';

describe('pagination', () => {
  it('counts pages', () => {
    expect(totalPages(0, 6)).toBe(1);
    expect(totalPages(7, 6)).toBe(2);
  });

  it('parses only clean, in-range page numbers (page 1 lives at the bare URL)', () => {
    expect(parsePage(null, 3)).toBe(1);
    expect(parsePage('2', 3)).toBe(2);
    expect(parsePage('1', 3)).toBeNull();
    expect(parsePage('4', 3)).toBeNull();
    expect(parsePage('02', 3)).toBeNull();
    expect(parsePage('abc', 3)).toBeNull();
  });

  it('slices items and builds paths', () => {
    expect(paginate([1, 2, 3, 4, 5], 2, 2)).toEqual([3, 4]);
    expect(pagePath('/blog', 1)).toBe('/blog');
    expect(pagePath('/blog', 3)).toBe('/blog?page=3');
  });
});
