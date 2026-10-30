#!/usr/bin/env node
/**
 * Crawls every URL in /sitemap.xml of a running server and checks on-page SEO:
 * HTTP 200, exactly one <h1>, unique title + description, canonical == URL,
 * indexable robots tag, valid JSON-LD, images with alt text, no broken internal links.
 *
 *   npm run build && npm run serve:ssr   (in another terminal)
 *   npm run check:seo -- http://localhost:4000
 */
const origin = (process.argv[2] ?? 'http://localhost:4000').replace(/\/$/, '');
const problems = [];
const titles = new Map();
const descriptions = new Map();
const internalLinks = new Set();

const get = (re, html) => html.match(re)?.[1];
const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
const prodBase = new URL(urls[0]).origin;

for (const url of urls) {
  const local = origin + url.slice(prodBase.length);
  const res = await fetch(local, { redirect: 'manual' });
  const html = await res.text();
  const report = (msg) => problems.push(`${url}: ${msg}`);
  if (res.status !== 200) { report(`status ${res.status}`); continue; }

  const head = html.slice(0, html.indexOf('</head>'));
  const title = get(/<title>(.*?)<\/title>/, head);
  const desc = get(/<meta name="description" content="([^"]*)"/, head);
  const canonical = get(/<link rel="canonical" href="([^"]*)"/, head);
  const robots = get(/<meta name="robots" content="([^"]*)"/, head);
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;

  if (!title) report('missing <title>');
  else if (titles.has(title)) report(`duplicate title (also ${titles.get(title)})`);
  else titles.set(title, url);
  if (!desc) report('missing meta description');
  else if (desc.length > 160) report(`description too long (${desc.length})`);
  else if (descriptions.has(desc)) report(`duplicate description (also ${descriptions.get(desc)})`);
  else descriptions.set(desc, url);
  if (canonical !== url) report(`canonical ${canonical} != ${url}`);
  if (!robots || robots.includes('noindex')) report(`not indexable: ${robots}`);
  if (h1s !== 1) report(`${h1s} <h1> elements`);
  if ((head.match(/rel="canonical"/g) ?? []).length > 1) report('duplicate canonical');
  for (const [, json] of head.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) {
    try { if (!JSON.parse(json)['@type']) report('JSON-LD without @type'); } catch { report('invalid JSON-LD'); }
  }
  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt="[^"]+"/.test(img)) report(`image without alt: ${img.slice(0, 80)}`);
  for (const [, href] of html.matchAll(/<a[^>]+href="(\/[^"#]*)"/g)) internalLinks.add(href);
}

for (const href of internalLinks) {
  const res = await fetch(origin + href, { redirect: 'manual' });
  if (res.status !== 200) problems.push(`broken internal link ${href} → ${res.status}`);
}

console.log(`Checked ${urls.length} sitemap URLs and ${internalLinks.size} internal links.`);
if (problems.length) {
  console.error(problems.map((p) => '  ✗ ' + p).join('\n'));
  process.exit(1);
}
console.log('  ✓ No SEO problems found.');
