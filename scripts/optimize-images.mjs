// Generate optimized webp variants for every CMS-uploaded photo.
// Originals stay in place so Decap CMS keeps working and we have a
// fallback for browsers that can't decode webp.
//
// Runs automatically via the `prebuild` npm lifecycle hook.

import { readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'public/uploads/photos';
const OUT_DIR = 'public/uploads/photos/_opt';
// 800 mobile, 1600 desktop 1x, 2400 retina/4K. Quality 88 + effort 6 keeps
// portfolio photos visually indistinguishable from the originals while
// still cutting weight by ~70%.
const WIDTHS = [800, 1600, 2400];
const QUALITY = 88;

await mkdir(OUT_DIR, { recursive: true });

const entries = await readdir(SRC_DIR);
const sources = entries.filter((f) => /\.(jpe?g|png)$/i.test(f) && !f.startsWith('_'));

let written = 0;
let skipped = 0;

for (const file of sources) {
  const srcPath = path.join(SRC_DIR, file);
  const srcStat = await stat(srcPath);
  if (!srcStat.isFile()) continue;
  const base = file.replace(/\.[^.]+$/, '');

  for (const w of WIDTHS) {
    const outPath = path.join(OUT_DIR, `${base}-${w}.webp`);
    if (existsSync(outPath)) {
      const outStat = await stat(outPath);
      if (outStat.mtimeMs >= srcStat.mtimeMs) {
        skipped++;
        continue;
      }
    }
    await sharp(srcPath)
      .rotate()
      .resize({ width: w, withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(outPath);
    written++;
  }
}

console.log(`[optimize-images] ${written} written, ${skipped} skipped`);
