import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { SITE } from './app/core/config/site.config';
import { buildRobotsTxt, buildSitemapXml, sitemapEntries } from './app/core/seo/sitemap';
import { handleEnquiry } from './server/enquiry';
import { resolveRedirect } from './server/redirects';

const browserDistFolder = join(import.meta.dirname, '../browser');

/**
 * SITE_INDEXABLE=false on staging/preview servers → robots.txt disallows all
 * and every response carries X-Robots-Tag: noindex. Production defaults to true.
 */
const INDEXABLE = process.env['SITE_INDEXABLE'] !== 'false';
const BASE_URL = process.env['SITE_URL'] ?? SITE.baseUrl;

const app = express();
const angularApp = new AngularNodeAppEngine();

app.disable('x-powered-by');
app.set('trust proxy', 'loopback'); // behind Nginx on the same host

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  if (!INDEXABLE) res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  next();
});

/** 301s: legacy WordPress URLs, trailing slashes, ?page=1. */
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const q = req.originalUrl.indexOf('?');
  const search = q >= 0 ? req.originalUrl.slice(q) : '';
  const target = resolveRedirect(req.path, search);
  if (target) return res.redirect(301, target);
  next();
});

/** Sitemap and robots.txt are generated from the same data the pages use. */
const sitemapXml = buildSitemapXml(sitemapEntries(), BASE_URL);
app.get('/sitemap.xml', (_req, res) => {
  res.type('application/xml').setHeader('Cache-Control', 'public, max-age=3600').send(sitemapXml);
});
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').setHeader('Cache-Control', 'public, max-age=3600').send(buildRobotsTxt(BASE_URL, INDEXABLE));
});

app.post('/api/enquiry', express.json({ limit: '10kb' }), (req, res) => {
  void handleEnquiry(req, res);
});
app.all('/api/{*splat}', (_req, res) => {
  res.status(404).json({ ok: false, error: 'not_found' });
});

/**
 * Static files. Hashed build output (main-ABC123.js) is cached for a year;
 * unhashed public assets get a short cache so updates show up.
 */
app.use(
  express.static(browserDistFolder, {
    index: false,
    redirect: false,
    setHeaders: (res, path) => {
      const hashed = /[-.][A-Z0-9]{8,}\.(js|css|woff2?|png|jpe?g|webp|avif|svg)$/.test(path);
      res.setHeader('Cache-Control', hashed ? 'public, max-age=31536000, immutable' : 'public, max-age=86400');
    },
  }),
);

/** Everything else is rendered by Angular (prerendered or SSR). */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) throw error;
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
