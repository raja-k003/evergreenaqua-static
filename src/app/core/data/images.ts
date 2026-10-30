import manifest from './image-manifest.json';

export type ImageKey = keyof typeof manifest;

export interface SiteImage {
  /** Absolute or root-relative URL. */
  src: string;
  /** Descriptive alt text; empty string only for purely decorative images. */
  alt: string;
}

/**
 * `true`: serve the optimised copies in /public/images/<seo-friendly-name>.webp
 * (built by `npm run images` from the backup of the old site).
 * `false`: fall back to the original URLs listed in image-manifest.json.
 */
export const USE_LOCAL_IMAGES = true;

export function image(key: ImageKey, alt: string): SiteImage {
  const src = USE_LOCAL_IMAGES ? `/images/${key}.webp` : manifest[key];
  return { src, alt };
}

export function absoluteImageUrl(src: string, baseUrl: string): string {
  try {
    return new URL(src, baseUrl).toString();
  } catch {
    return baseUrl;
  }
}
