// Responsive image variants of the demo site (run after `next build`): every image under public/images is
// written at a few widths into out/_img/<width>/images/…, in its own format; images uploaded in the
// builder (uploads/builder) also get AVIF versions. The site's resolver (src/builder/render.tsx) points
// the Image widget's srcset at them. Never upscaled.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const WIDTHS = [384, 640, 1080, 1920];
const ROOT = process.cwd();
const SRC = path.join(ROOT, "public", "images");
const OUT = path.join(ROOT, "out", "_img");
const EXT = /\.(jpe?g|png|webp)$/i;

async function* walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (EXT.test(e.name)) yield p;
  }
}

let n = 0;
for await (const file of walk(SRC)) {
  const rel = path.relative(path.join(ROOT, "public"), file);
  const ext = path.extname(file).toLowerCase();
  const avif = rel.split(path.sep).includes("builder");
  for (const w of WIDTHS) {
    const out = path.join(OUT, String(w), rel);
    await fs.mkdir(path.dirname(out), { recursive: true });
    const img = sharp(file).rotate().resize({ width: w, withoutEnlargement: true });
    await (ext === ".png" ? img.png({ compressionLevel: 9 }) : ext === ".webp" ? img.webp({ quality: 78 }) : img.jpeg({ quality: 78, mozjpeg: true })).toFile(out);
    if (avif) await sharp(file).rotate().resize({ width: w, withoutEnlargement: true }).avif({ quality: 55 }).toFile(out.replace(/\.\w+$/, ".avif"));
    n++;
  }
}
console.log(`[images] ${n} variants written to out/_img`);
