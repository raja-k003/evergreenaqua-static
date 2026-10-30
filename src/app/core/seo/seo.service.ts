import { DOCUMENT, Injectable, inject, isDevMode } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { SITE } from '../config/site.config';
import { absoluteImageUrl } from '../data/images';
import { breadcrumbSchema } from './schema';
import { JsonLd, SeoData } from './seo.models';
import { canonicalUrl, cleanText, isValidJsonLd, serializeJsonLd, truncate } from './seo-utils';

const JSON_LD_ATTR = 'data-seo-jsonld';
const MAX_TITLE = 70;
const MAX_DESCRIPTION = 160;

/**
 * Sets every piece of per-route metadata in one call. Safe to call on the
 * server and in the browser: it always updates existing elements instead of
 * appending, so hydration and client-side navigation never create duplicates.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  setPage(input: SeoData): void {
    const data = this.sanitize(input);
    const url = canonicalUrl(data.path, SITE.baseUrl);
    const image = data.image ?? SITE.defaultOgImage;
    const imageUrl = absoluteImageUrl(image.url, SITE.baseUrl);

    this.doc.documentElement.setAttribute('lang', SITE.lang);
    this.title.setTitle(data.title);
    // A noindex page should not also declare a canonical (mixed signals to crawlers).
    if (data.noindex) this.removeCanonical();
    else this.setCanonical(url);

    const robots = [
      data.noindex ? 'noindex' : 'index',
      data.follow === false ? 'nofollow' : 'follow',
      ...(data.noindex ? [] : ['max-image-preview:large', 'max-snippet:-1']),
    ].join(', ');

    this.upsert({ name: 'description', content: data.description });
    this.upsert({ name: 'robots', content: robots });

    // Open Graph
    this.upsert({ property: 'og:type', content: data.type === 'article' ? 'article' : 'website' });
    this.upsert({ property: 'og:site_name', content: SITE.name });
    this.upsert({ property: 'og:locale', content: SITE.ogLocale });
    this.upsert({ property: 'og:title', content: data.title });
    this.upsert({ property: 'og:description', content: data.description });
    this.upsert({ property: 'og:url', content: url });
    this.upsert({ property: 'og:image', content: imageUrl });
    this.upsert({ property: 'og:image:alt', content: cleanText(image.alt) || SITE.name });
    this.upsertOrRemove('property', 'og:image:width', image.width?.toString());
    this.upsertOrRemove('property', 'og:image:height', image.height?.toString());

    // Article metadata (removed on non-article pages so it never leaks across routes)
    const art = data.type === 'article' ? data.article : undefined;
    this.upsertOrRemove('property', 'article:published_time', art?.publishedTime);
    this.upsertOrRemove('property', 'article:modified_time', art?.modifiedTime ?? art?.publishedTime);
    this.upsertOrRemove('property', 'article:author', art?.author);
    this.upsertOrRemove('property', 'article:section', art?.section);

    // Twitter / X
    this.upsert({ name: 'twitter:card', content: 'summary_large_image' });
    this.upsert({ name: 'twitter:title', content: data.title });
    this.upsert({ name: 'twitter:description', content: data.description });
    this.upsert({ name: 'twitter:image', content: imageUrl });
    this.upsert({ name: 'twitter:image:alt', content: cleanText(image.alt) || SITE.name });

    // Structured data
    const schemas: JsonLd[] = [];
    if (data.breadcrumbs?.length) schemas.push(breadcrumbSchema(data.breadcrumbs, data.path));
    const extra = data.jsonLd ? (Array.isArray(data.jsonLd) ? data.jsonLd : [data.jsonLd]) : [];
    schemas.push(...extra);
    this.setJsonLd(schemas);
  }

  /** Replaces all page-level JSON-LD blocks. Invalid entries are skipped. */
  setJsonLd(schemas: unknown[]): void {
    const head = this.doc.head;
    const valid = schemas.filter((s) => {
      const ok = isValidJsonLd(s);
      if (!ok && isDevMode()) console.warn('[SeoService] Skipping invalid JSON-LD (missing @type):', s);
      return ok;
    });
    const payloads = valid.map((s) => serializeJsonLd({ '@context': 'https://schema.org', ...s }));

    const existing = Array.from(head.querySelectorAll<HTMLScriptElement>(`script[${JSON_LD_ATTR}]`));
    // Skip DOM churn when hydrating a server-rendered page with identical data.
    if (existing.length === payloads.length && existing.every((el, i) => el.textContent === payloads[i])) return;

    existing.forEach((el) => el.remove());
    for (const payload of payloads) {
      const script = this.doc.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute(JSON_LD_ATTR, '');
      script.textContent = payload;
      head.appendChild(script);
    }
  }

  private sanitize(input: SeoData): SeoData {
    const rawTitle = cleanText(input?.title);
    const title = !rawTitle
      ? SITE.defaultTitle
      : input.rawTitle || rawTitle.includes(SITE.shortName)
        ? truncate(rawTitle, MAX_TITLE)
        : truncate(SITE.titleTemplate.replace('%s', rawTitle), MAX_TITLE + SITE.shortName.length);
    const description = truncate(cleanText(input?.description) || SITE.defaultDescription, MAX_DESCRIPTION);
    const path = typeof input?.path === 'string' && input.path.startsWith('/') ? input.path : '/';
    const image = input?.image?.url ? input.image : undefined;
    return { ...input, title, description, path, image };
  }

  private setCanonical(url: string): void {
    const links = Array.from(this.doc.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]'));
    const [link, ...duplicates] = links;
    duplicates.forEach((el) => el.remove());
    if (link) {
      link.setAttribute('href', url);
      return;
    }
    const el = this.doc.createElement('link');
    el.setAttribute('rel', 'canonical');
    el.setAttribute('href', url);
    this.doc.head.appendChild(el);
  }

  private removeCanonical(): void {
    this.doc.head.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
  }

  private upsert(tag: MetaDefinition): void {
    const key = tag.property ? 'property' : 'name';
    const selector = `${key}="${tag[key]}"`;
    // Remove accidental duplicates before updating the first match.
    const all = this.meta.getTags(selector);
    all.slice(1).forEach((el) => this.meta.removeTagElement(el));
    this.meta.updateTag(tag, selector);
  }

  private upsertOrRemove(attr: 'name' | 'property', key: string, content: string | undefined): void {
    if (content) this.upsert({ [attr]: key, content });
    else this.meta.removeTag(`${attr}="${key}"`);
  }
}
