import { canonicalUrl, cleanText, isValidJsonLd, serializeJsonLd, truncate } from './seo-utils';

const BASE = 'https://smparamount.in';

describe('canonicalUrl', () => {
  it('builds absolute URLs and keeps the root slash', () => {
    expect(canonicalUrl('/', BASE)).toBe('https://smparamount.in/');
    expect(canonicalUrl('/about', BASE + '/')).toBe('https://smparamount.in/about');
  });

  it('removes trailing and duplicate slashes, fragments and tracking params', () => {
    expect(canonicalUrl('//evil.com', BASE)).toBe('https://smparamount.in/');
    expect(canonicalUrl('/blog//post/', BASE)).toBe('https://smparamount.in/blog/post');
    expect(canonicalUrl('/blog?utm_source=x&page=2&gclid=1#top', BASE)).toBe('https://smparamount.in/blog?page=2');
  });

  it('sorts query params for a stable canonical', () => {
    expect(canonicalUrl('/x?b=2&a=1', BASE)).toBe('https://smparamount.in/x?a=1&b=2');
  });

  it('falls back to the root for invalid input', () => {
    expect(canonicalUrl(undefined, BASE)).toBe('https://smparamount.in/');
    expect(canonicalUrl('not-a-path', BASE)).toBe('https://smparamount.in/');
  });
});

describe('text helpers', () => {
  it('cleans whitespace', () => expect(cleanText('  a \n  b ')).toBe('a b'));

  it('truncates at a word boundary with an ellipsis', () => {
    const out = truncate('one two three four five six', 15);
    expect(out.length).toBeLessThanOrEqual(15);
    expect(out.endsWith('…')).toBe(true);
    expect(truncate('short', 15)).toBe('short');
  });
});

describe('JSON-LD helpers', () => {
  it('escapes characters that could break out of a script tag', () => {
    const out = serializeJsonLd({ '@type': 'Thing', name: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('</script>');
    expect(JSON.parse(out).name).toBe('</script><script>alert(1)</script>');
  });

  it('validates required @type', () => {
    expect(isValidJsonLd({ '@type': 'Organization' })).toBe(true);
    expect(isValidJsonLd({ name: 'x' })).toBe(false);
    expect(isValidJsonLd(null)).toBe(false);
    expect(isValidJsonLd([{ '@type': 'X' }])).toBe(false);
  });
});
