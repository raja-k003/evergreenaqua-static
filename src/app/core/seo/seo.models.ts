export interface Breadcrumb {
  label: string;
  /** Root-relative path. Omit for the current page (last crumb). */
  path?: string;
}

export interface SeoImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export type JsonLd = Record<string, unknown>;

export interface SeoData {
  /** Page title without the site suffix; the template is applied automatically. */
  title: string;
  description: string;
  /** Root-relative canonical path, optionally with a query string (e.g. '/blog?page=2'). */
  path: string;
  image?: SeoImage;
  type?: 'website' | 'article' | 'product';
  /** Defaults to index,follow. Set noindex for thin, filtered or private pages. */
  noindex?: boolean;
  /** Set false to stop crawlers following links on this page. Defaults to true. */
  follow?: boolean;
  breadcrumbs?: Breadcrumb[];
  jsonLd?: JsonLd | JsonLd[];
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
  };
  /** Use the title exactly as given (skip the site-name template). */
  rawTitle?: boolean;
}
