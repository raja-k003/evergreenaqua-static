# Evergreen Aqua — Angular SSR website

Responsive, accessible, SEO-first website for **Evergreen Aqua** (Chennai), built with
Angular 22 (standalone components, signals, zoneless), Angular SSR + prerendering, and a 5-preset
dynamic theme system.

- 20 indexable URLs: home, about, services, how-it-works, products overview, 5 product landing
  pages, RO purifiers, testimonials, FAQ, careers, gallery, blog + 3 articles, contact
- 18 routes prerendered to static HTML at build time; `/products` and `/blog` are server-rendered
  because their output depends on the query string
- Real HTTP 404s, 301s for old WordPress URLs, dynamic `sitemap.xml` and `robots.txt`
- Initial JS ≈ 122 kB transferred; every page except home is a lazy chunk
- 49 unit tests (Vitest)

---

## 1. Install and run

Requires **Node 22.12+**.

```bash
npm install
npm start                 # dev server with SSR at http://localhost:4200
npm run test:ci           # unit tests once (npm test = watch mode)
npm run build             # production build + prerender → dist/smparamount
npm run serve:ssr         # run the production server at http://localhost:4000
npm run check:seo -- http://localhost:4000   # crawl the sitemap and audit on-page SEO
```

Dependencies are only Angular, Express and RxJS. No UI kit, icon font or web font is loaded.

### Images (self-hosted)

All images live in `public/images/` as optimised WebP with descriptive file names
(e.g. `terrace-softener-installation.webp`), plus `sm-paramount-logo.png` and a 1200×630
social-share image `sm-paramount-og.jpg`. The brochure is `public/brochures/sm-paramount-brochure.pdf`.
Nothing loads from the old domain.

`src/app/core/data/image-manifest.json` maps each file name to its original WordPress upload. To
regenerate the WebP files (e.g. after changing size or quality), point the script at the backup of
the old site's media:

```bash
npm run images -- --from ~/Downloads/smparamount-media
```

To add a new image: put the original in that backup (or anywhere), add a `"seo-name": "<source url>"`
line to the manifest, run the script, then use `image('seo-name', 'Alt text')` in the data files.

---

## 2. Project structure

```
src/
├── index.html                  # pre-paint theme script, favicon
├── server.ts                   # Express: redirects, sitemap, robots, /api/enquiry, caching, SSR
├── server/
│   ├── redirects.ts            # legacy WordPress → new URLs, trailing slash, ?page=1
│   └── enquiry.ts              # validated, rate-limited enquiry endpoint (wire up email here)
├── styles.scss + styles/       # design system: tokens, layout, buttons, cards, forms, tables
└── app/
    ├── app.ts / app.config.ts  # shell (skip link, header, main, footer), hydration, router
    ├── app.routes.ts           # clean URLs, lazy pages, slug guards → real 404
    ├── app.routes.server.ts    # prerender vs SSR per route, 404 status
    ├── core/
    │   ├── config/             # site.config.ts (business + base URL), pages.ts (per-page SEO), navigation.ts
    │   ├── data/               # products, RO purifiers, blog, FAQ, testimonials, gallery, images
    │   ├── seo/                # SeoService, JSON-LD builders, sitemap/robots builders, URL utils
    │   ├── theme/              # 5 presets, ThemeService, WCAG colour helpers
    │   ├── routing/            # slug guards, 404 status, pagination, reuse strategy
    │   └── enquiry/            # form submission service
    ├── shared/
    │   ├── layout/             # header (desktop dropdowns + mobile menu), footer, theme switcher
    │   ├── forms/              # accessible enquiry form (contact, careers, FAQ)
    │   └── ui/                 # button directive, icon, cards, breadcrumbs, page header, state views, CTA
    └── pages/                  # one folder per route
scripts/
├── check-seo.mjs               # post-build SEO audit
└── optimize-images.mjs         # download + convert images
deploy/
├── nginx.conf                  # HTTPS, www→apex, gzip, caching, proxy to Node
└── ecosystem.config.cjs        # PM2 cluster config
```

**Content lives in `core/data` and `core/config`** — edit those files to change copy, prices,
products or contact details. Pages, metadata, JSON-LD and the sitemap all read from the same source,
so they can't drift apart.

---

## 3. Themes

Five presets in `core/theme/themes.ts`: **Aqua** (brand `#3857F1`, default), **Ocean**, **Forest**,
**Sunset**, **Midnight** (dark). Users switch from the palette button in the header and can also pick
a **custom brand colour**, which is automatically darkened/lightened until it meets WCAG AA contrast.

How it avoids flashes and layout shift:
1. Preset CSS variables are rendered into `<head>` on the server (`ThemeService`).
2. A tiny inline script in `index.html` applies the saved preset/custom colour before first paint.
3. The choice is saved in `localStorage`.

To add a preset, append to `THEME_PRESETS`; `theme.spec.ts` will fail if any text/background pair
drops below 4.5:1 contrast. All component styles use only `--color-*` tokens.

---

## 4. SEO implementation

### SeoService (`core/seo/seo.service.ts`)
One call per page: `seo.setPage({ title, description, path, image?, type?, noindex?, breadcrumbs?, jsonLd?, article? })`

- Title via `Title` (template `%s | Evergreen Aqua`), description clamped to 160 chars
- Canonical built from `SITE.baseUrl`; tracking params, fragments and trailing slashes stripped
- Robots: `index, follow, max-image-preview:large` by default; `noindex, follow` and **no canonical**
  for noindex pages (avoids mixed signals)
- Open Graph (type, site_name, locale `en_IN`, title, description, url, image + alt), Twitter card,
  `article:*` tags (removed again on non-article pages), `<html lang="en-IN">`
- JSON-LD: BreadcrumbList generated from `breadcrumbs`; extra schemas validated (`@type` required),
  safely escaped, replaced on navigation, and left untouched during hydration if identical
- Updates existing tags rather than appending → no duplicates on SSR, hydration or client navigation
- Falls back to site defaults for empty or invalid input

### Structured data (`core/seo/schema.ts`)

| Page | Schema |
|---|---|
| Home | `LocalBusiness` (address, phones, hours, sameAs), `WebSite` |
| Contact | `LocalBusiness` |
| Inner pages | `BreadcrumbList` |
| Water softener, sand filter | `Product` + `AggregateOffer` (real MRPs only) |
| RO purifiers | `ItemList` of `Product` + `Offer` |
| Blog posts | `BlogPosting` |
| FAQ | `FAQPage` |

Deliberately **not** added: ratings/reviews (self-serving reviews aren't eligible and none are
verifiable), `JobPosting` (no posting dates/validity published), `Product` for items without prices.
Note: Google currently shows FAQ rich results mainly for government/health sites.

### Technical SEO
- **Rendering:** prerendered HTML for static routes; SSR for query-dependent pages; full hydration
  with event replay; incremental hydration for below-the-fold `@defer` blocks (HTML still in the
  initial response)
- **Status codes:** unknown routes and unknown slugs (`canMatch` guards) → **404** with `noindex`;
  out-of-range `/blog?page=N` → 404
- **Redirects (301):** `/contact-us` → `/contact`, `/products-1` → `/products`, `/ro-products` →
  `/products/ro-water-purifiers`, `/testimonial`, `/career`, `/marine`, all three old dated blog URLs,
  trailing slashes, `/blog?page=1` → `/blog`. Nginx handles http→https and www→apex.
- **Filtered pages:** `/products?category=…` are `noindex, follow`
- **Pagination:** `/blog?page=N` is self-canonical, linked with `rel=prev/next`, listed in the sitemap
- **Sitemap:** `/sitemap.xml` built from page config + products + posts (+ blog pages >1), real
  `lastmod` dates (post dates; `SITE.contentUpdated` for static pages)
- **robots.txt:** allows everything except `/api/`, links the sitemap. With `SITE_INDEXABLE=false`
  (staging) it disallows all and every response gets `X-Robots-Tag: noindex`
- Semantic landmarks, one H1 per page, logical H2/H3, descriptive alt text, visible breadcrumbs,
  dedicated landing page per product, internal links between related products and articles

---

## 5. Performance & accessibility

- Home is eager; all other routes lazy. Blog article bodies are a separate chunk.
- `NgOptimizedImage` everywhere with `fill` inside fixed aspect-ratio frames → zero CLS;
  `priority` on LCP images (adds preload during SSR); lazy-loading below the fold
- System font stack (no font download), inline SVG icons, ~3 kB of global CSS (gzipped)
- Hashed assets cached for 1 year; gzip in Nginx
- WCAG: skip link, focus moved to `<main>` after navigation, visible focus rings, 44px touch
  targets, native `<details>` accordions, radio-group theme picker, `aria-expanded` menus closing
  on Escape, labelled form fields with linked error messages, focus to first invalid field, live
  regions for loading/success/error, `prefers-reduced-motion` respected, AA contrast in every theme

---

## 6. Deploy to AWS EC2 (Nginx + PM2)

```bash
# on the server (Ubuntu), first time
sudo apt install -y nginx && sudo npm i -g pm2
sudo mkdir -p /var/www/smparamount && sudo chown $USER /var/www/smparamount

# each release (build locally or in CI, then copy)
npm ci && npm run test:ci && npm run build
rsync -az --delete dist package.json package-lock.json deploy user@server:/var/www/smparamount/
ssh user@server 'cd /var/www/smparamount && npm ci --omit=dev && pm2 startOrReload deploy/ecosystem.config.cjs && pm2 save'

# Nginx (first time)
sudo cp deploy/nginx.conf /etc/nginx/sites-available/smparamount.in
sudo ln -s /etc/nginx/sites-available/smparamount.in /etc/nginx/sites-enabled/
sudo certbot --nginx -d smparamount.in -d www.smparamount.in
sudo nginx -t && sudo systemctl reload nginx
pm2 startup   # restart on reboot
```

Environment variables: `PORT` (4000), `SITE_URL` (sitemap/robots base), `SITE_INDEXABLE`
(`false` on staging). If you deploy to a different domain, also update `SITE.baseUrl` in
`site.config.ts` (canonicals and JSON-LD) and `security.allowedHosts` in `angular.json`.

**Before going live:** wire up `deliver()` in `src/server/enquiry.ts` (email/CRM) — enquiries are
only logged right now. Swap the text logo in `header.html` for the real logo if you prefer.

---

## 7. SEO validation checklist

**Before launch (local)**
- [ ] `npm run test:ci` passes
- [ ] `npm run build && npm run serve:ssr`, then `npm run check:seo -- http://localhost:4000` reports no problems
- [ ] `curl -s localhost:4000/products/water-softeners | grep -E '<title>|canonical|ld\+json'` shows rendered metadata (view-source, not DevTools)
- [ ] `curl -I localhost:4000/nope` → `404`; `curl -I localhost:4000/contact-us` → `301` to `/contact`

**Google Rich Results Test** (https://search.google.com/test/rich-results)
- [ ] Home → LocalBusiness detected, no errors
- [ ] `/products/water-softeners` and `/products/sand-filters` → Product snippet valid (warnings for missing reviews are expected)
- [ ] `/blog/signs-of-hard-water` → Article + Breadcrumb valid
- [ ] Any inner page → Breadcrumb valid
- [ ] Also check with the Schema Markup Validator (https://validator.schema.org)

**Lighthouse** (Chrome DevTools → Lighthouse, Mobile, on the production URL)
- [ ] Performance ≥ 90 (LCP < 2.5 s, CLS < 0.1, INP < 200 ms in PageSpeed Insights field data)
- [ ] Accessibility, Best Practices, SEO ≥ 95
- [ ] Repeat with the Midnight theme for accessibility contrast

**Google Search Console** (after deploy)
- [ ] Verify the `https://smparamount.in` domain property (DNS TXT record)
- [ ] Submit `https://smparamount.in/sitemap.xml`; all URLs show "Success"
- [ ] URL Inspection → Test live URL for home, one product, one article: page fetched, rendered HTML contains the content, canonical "user-declared = Google-selected"
- [ ] Pages report: no "Duplicate without user-selected canonical", "Soft 404" or "Blocked by robots.txt" on wanted pages
- [ ] Old WordPress URLs show as "Page with redirect" over the following weeks
- [ ] Enhancements: Breadcrumbs and Products with no errors
- [ ] Core Web Vitals report green once field data accumulates

**Ongoing**
- [ ] Update `SITE.contentUpdated` when static copy changes; set `updated` on edited blog posts
- [ ] Every new page: add it to `PAGES` (unique title + description) so it lands in the sitemap
