#!/usr/bin/env node
/**
 * Regenerates sitemap.xml and robots.txt from the built SSR server (same data the pages use)
 * and writes them to public/ (source) and docs/browser/ (the published GitHub Pages folder).
 *
 *   npm run build:pages     (build + this script + 404.html)
 *   npm run seo:generate    (this script only; needs an existing build in docs/)
 */
import { spawn } from 'node:child_process';
import { copyFile, writeFile } from 'node:fs/promises';

const PORT = process.env.PORT ?? '4599';
const origin = `http://localhost:${PORT}`;
const outDirs = ['public', 'docs/browser'];

const server = spawn(process.execPath, ['docs/server/server.mjs'], {
  env: { ...process.env, PORT },
  stdio: 'ignore',
});

const waitForServer = async () => {
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(`${origin}/robots.txt`)).ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('SSR server did not start. Run the build first (docs/server/server.mjs missing?).');
};

try {
  await waitForServer();
  for (const file of ['sitemap.xml', 'robots.txt']) {
    const res = await fetch(`${origin}/${file}`);
    if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
    const body = await res.text();
    for (const dir of outDirs) await writeFile(`${dir}/${file}`, body);
    console.log(`wrote ${file} (${body.length} bytes)`);
  }
  await copyFile('docs/browser/index.csr.html', 'docs/browser/404.html');
  console.log('wrote 404.html');
} finally {
  server.kill();
}
