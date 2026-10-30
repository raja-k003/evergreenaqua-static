#!/usr/bin/env node
/**
 * Builds public/images/<seo-name>.webp for every entry in
 * src/app/core/data/image-manifest.json.
 *
 * Source: a local backup of the old site (default), or the live URLs.
 *   npm run images -- --from ~/Downloads/smparamount-media   # local backup (wp-content/uploads/...)
 *   npm run images -- --remote                               # download from the manifest URLs
 */
import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import sharp from 'sharp';

const args = process.argv.slice(2);
const remote = args.includes('--remote');
const fromIdx = args.indexOf('--from');
const fromDir = resolve((fromIdx >= 0 ? args[fromIdx + 1] : '~/Downloads/smparamount-media').replace(/^~/, homedir()));

const root = new URL('..', import.meta.url).pathname;
const manifest = JSON.parse(await readFile(join(root, 'src/app/core/data/image-manifest.json'), 'utf8'));
const outDir = join(root, 'public/images');
await mkdir(outDir, { recursive: true });
const MAX_WIDTH = 800; // largest display size is ~600 CSS px; 800 covers most 2x screens at that size

async function load(url) {
  if (remote) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  const file = join(fromDir, new URL(url).pathname);
  await access(file);
  return readFile(file);
}

let failed = 0;
for (const [name, url] of Object.entries(manifest)) {
  try {
    const input = await load(url);
    const base = sharp(input).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true });
    const webp = await base.clone().webp({ quality: 75 }).toBuffer();
    await writeFile(join(outDir, `${name}.webp`), webp);
    const { width, height } = await sharp(webp).metadata();
    console.log(`✓ ${name.padEnd(36)} ${String(width).padStart(4)}×${height}  ${(input.length / 1024).toFixed(0)} kB → ${(webp.length / 1024).toFixed(0)} kB webp`);
  } catch (err) {
    failed++;
    console.error(`✗ ${name}: ${err.message}`);
  }
}
if (failed) process.exit(1);
