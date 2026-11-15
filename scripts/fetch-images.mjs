// Holt alle Fotos aus src/data/images.ts einmal von Wikimedia und legt sie
// als WebP in zwei Breiten unter public/img/ ab (s/ = Stopps, t/ = Tour-Titelbilder).
// Masse landen in src/data/image-meta.json. Bereits vorhandene Dateien werden übersprungen.
//   node scripts/fetch-images.mjs            alle fehlenden holen
//   node scripts/fetch-images.mjs --force    alles neu
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "src/data/images.ts"), "utf8");
const metaPath = join(root, "src/data/image-meta.json");
const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : {};
const force = process.argv.includes("--force");
const WIDTHS = [480, 1200];

const split = src.indexOf("export const tourHeroImages");
const entries = [];
for (const [part, kind] of [[src.slice(0, split), "s"], [src.slice(split), "t"]]) {
  for (const m of part.matchAll(/"([^"]+)":\s*\{\s*source:\s*"([^"]+)"/g)) entries.push({ key: `${kind}/${m[1]}`, url: m[2] });
}
console.log(`${entries.length} Bilder in images.ts`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let done = 0, skipped = 0, failed = [];

for (const e of entries) {
  const out = (w) => join(root, "public/img", `${e.key}-${w}.webp`);
  if (!force && meta[e.key] && WIDTHS.every((w) => existsSync(out(w)))) { skipped++; continue; }
  mkdirSync(dirname(out(480)), { recursive: true });
  let buf;
  for (let attempt = 1; attempt <= 6; attempt++) {
    const res = await fetch(e.url, { headers: { "User-Agent": "ImageMirror/1.0 (static site build; one-time download)" } });
    if (res.ok) { buf = Buffer.from(await res.arrayBuffer()); break; }
    console.warn(`  ${e.key}: HTTP ${res.status}, Versuch ${attempt}`);
    const retry = Number(res.headers.get("retry-after")) || 0;
    await sleep(res.status === 429 ? Math.max(retry * 1000, 45000 * attempt) : 3000);
  }
  if (!buf) { failed.push(e.key); continue; }
  const img = sharp(buf).rotate();
  const { width, height } = await img.metadata();
  let dims;
  for (const w of WIDTHS) {
    const info = await img.clone().resize({ width: w, withoutEnlargement: true }).webp({ quality: w > 600 ? 70 : 72 }).toFile(out(w));
    if (w === 1200) dims = [info.width, info.height];
  }
  meta[e.key] = dims ?? [width, height];
  done++;
  console.log(`${done + skipped}/${entries.length} ${e.key} ${meta[e.key].join("x")}`);
  writeFileSync(metaPath, JSON.stringify(meta, null, 1) + "\n");
  await sleep(4000); // Wikimedia sperrt sonst nach wenigen Bildern (HTTP 429)
}

// Einträge ohne Quelle entfernen
const keys = new Set(entries.map((e) => e.key));
for (const k of Object.keys(meta)) if (!keys.has(k)) delete meta[k];
writeFileSync(metaPath, JSON.stringify(meta, null, 1) + "\n");
console.log(`fertig: ${done} neu, ${skipped} vorhanden, ${failed.length} fehlgeschlagen ${failed.join(", ")}`);
if (failed.length) process.exit(1);
