/** Query parameters that never belong in a canonical URL. */
const TRACKING_PARAMS = /^(utm_[a-z]+|gclid|fbclid|msclkid|mc_[a-z]+|ref)$/i;

/**
 * Builds an absolute, normalised canonical URL from a root-relative path.
 * - strips fragments and tracking parameters
 * - removes trailing slashes (except the root)
 * - collapses duplicate slashes
 * - falls back to the site root for invalid input
 */
export function canonicalUrl(path: string | null | undefined, baseUrl: string): string {
  const base = baseUrl.replace(/\/+$/, '');
  let raw = (path ?? '/').trim();
  if (!raw.startsWith('/') || raw.startsWith('//')) raw = '/';

  let url: URL;
  try {
    url = new URL(raw, base + '/');
  } catch {
    return base + '/';
  }

  let pathname = url.pathname.replace(/\/{2,}/g, '/');
  if (pathname.length > 1) pathname = pathname.replace(/\/+$/, '');

  const params = [...url.searchParams.entries()]
    .filter(([key, value]) => !TRACKING_PARAMS.test(key) && value !== '')
    .sort(([a], [b]) => a.localeCompare(b));
  const query = params.length ? '?' + new URLSearchParams(params).toString() : '';

  return `${base}${pathname}${query}`;
}

/** Collapses whitespace and trims. */
export function cleanText(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

/** Truncates at a word boundary, adding an ellipsis when shortened. */
export function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  const cut = value.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–-]+$/, '') + '…';
}

/**
 * Serialises JSON-LD safely for embedding in a <script> element:
 * escapes characters that could close the script tag or break HTML parsing.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function isValidJsonLd(value: unknown): value is Record<string, unknown> {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof (value as Record<string, unknown>)['@type'] === 'string'
  );
}
