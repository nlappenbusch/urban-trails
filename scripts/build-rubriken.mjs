// Schweiz-Verzeichnis nach Rubriken (Tierparks, Museen, Burgen …) aus OpenStreetMap,
// angereichert mit Wikidata/Wikipedia (Kurzbeschreibung, Foto mit Urheber) → src/data/rubriken.json
//
// Aufruf: node scripts/build-rubriken.mjs <cache-ordner>
//   <cache-ordner>/rubriken.json  Overpass-Antwort (out center tags)
//   <cache-ordner>/orte.json      Overpass place=city|town|village (out qt)
//   <cache-ordner>/kt/1..26.json  Kantonsflächen von api3.geo.admin.ch (geojson, sr=4326)
// Wikidata-/Wikipedia-Antworten werden in <cache-ordner>/wiki-cache.json zwischengespeichert.
import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
if (!dir) throw new Error("Cache-Ordner fehlt");
const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
const UA = { "user-agent": "UrbanTrailsBuild/1.0 (https://urban-trails.ch; build script)", "api-user-agent": "UrbanTrailsBuild/1.0 (https://urban-trails.ch)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- Kantone ----------
const cantons = [];
for (let i = 1; i <= 26; i++) {
  const f = read(`kt/${i}.json`).feature;
  const g = f.geometry;
  cantons.push({ ak: f.properties.ak, bbox: f.bbox, polys: g.type === "MultiPolygon" ? g.coordinates : [g.coordinates] });
}
const inRing = (x, y, ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const cantonOf = (lng, lat) => {
  for (const c of cantons) {
    const [a, b, d, e] = c.bbox;
    if (lng < a || lng > d || lat < b || lat > e) continue;
    for (const poly of c.polys) if (inRing(lng, lat, poly[0]) && !poly.slice(1).some((h) => inRing(lng, lat, h))) return c.ak;
  }
  return null;
};

// ---------- Orte ----------
const rad = (d) => (d * Math.PI) / 180;
const km = (a, b) => {
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};
const towns = read("orte.json").elements.filter((e) => e.tags?.name).map((e) => ({ name: e.tags["name:de"] || e.tags.name, lat: e.lat, lng: e.lon }));
const grid = new Map();
const key = (lat, lng) => `${Math.floor(lat * 10)}:${Math.floor(lng * 10)}`;
for (const t of towns) {
  const k = key(t.lat, t.lng);
  if (!grid.has(k)) grid.set(k, []);
  grid.get(k).push(t);
}
const nearestTown = (p) => {
  let best = null, bd = 99;
  const la = Math.floor(p.lat * 10), lo = Math.floor(p.lng * 10);
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (const t of grid.get(`${la + i}:${lo + j}`) ?? []) {
    const d = km(p, t);
    if (d < bd) (bd = d), (best = t);
  }
  return best && bd < 8 ? best.name : undefined;
};

// ---------- Rubriken ----------
const CASTLE = /burg|schloss|ruine|château|chateau|castel|castell|feste|festung|chastè|tour |turm|tour$|fort/i;
function rubrik(t) {
  if (t.tourism === "zoo") return t.zoo === "enclosure" ? null : "tierparks";
  if (t.tourism === "aquarium") return "tierparks";
  if (t.tourism === "museum") return "museen";
  if (t.historic === "castle" || t.historic === "fort") return "burgen-schloesser";
  if (t.historic === "ruins") return t.ruins === "castle" || t.castle_type || CASTLE.test(t.name ?? "") ? "burgen-schloesser" : null;
  if (t.natural === "cave_entrance") return t.tourism || t.website || t.wikidata || t.wikipedia || t.fee || t.opening_hours || t["contact:website"] ? "hoehlen" : null;
  if (t.tourism === "theme_park") return "freizeitparks";
  if (t.leisure === "water_park") return "erlebnisbaeder";
  if (t.man_made === "tower" && t["tower:type"] === "observation") return "aussichtstuerme";
  if (t.waterway === "waterfall" || t.natural === "waterfall") return "wasserfaelle";
  if (t.sport === "climbing_adventure" || t.leisure === "high_ropes_course") return "seilparks";
  if (t.leisure === "miniature_golf") return "minigolf";
  if (t.amenity === "planetarium") return "sternwarten";
  if (t.man_made === "observatory") return /sternwarte|observatoire|osservatorio|planet|volks|public/i.test(`${t.name} ${t.operator ?? ""}`) || t.website || t.tourism ? "sternwarten" : null;
  return null;
}

const raw = read("rubriken.json").elements;
let items = [];
for (const e of raw) {
  const t = e.tags ?? {};
  const r = rubrik(t);
  const lat = e.lat ?? e.center?.lat, lng = e.lon ?? e.center?.lon;
  const name = t["name:de"] || t.name;
  if (!r || lat == null || !name) continue;
  if (t.disused || t["disused:tourism"] || t.abandoned || /geschlossen|closed/i.test(t.note ?? "")) continue;
  const kt = cantonOf(lng, lat);
  if (!kt) continue;
  items.push({
    r,
    id: `${e.type[0]}${e.id}`,
    name: name.trim(),
    lat: Math.round(lat * 1e5) / 1e5,
    lng: Math.round(lng * 1e5) / 1e5,
    kt,
    ort: t["addr:city"] || undefined,
    web: (t.website || t["contact:website"] || t.url || "").split(";")[0].trim() || undefined,
    hours: t.opening_hours || undefined,
    fee: t.fee === "no" ? false : t.fee === "yes" ? true : undefined,
    wheel: t.wheelchair === "yes" ? true : t.wheelchair === "no" ? false : undefined,
    height: Number.parseFloat(t.height) || undefined,
    ele: Number.parseFloat(t.ele) || undefined,
    sub: t.zoo || t["museum"] || t.castle_type || undefined,
    wd: t.wikidata || undefined,
    wp: t.wikipedia || undefined,
    score: Object.keys(t).length + (t.wikidata ? 10 : 0) + (t.website ? 5 : 0),
  });
}

// Dubletten: gleiche Rubrik, ähnlicher Name, < 400 m (z. B. Wasserfall als Punkt und als Linie)
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
items.sort((a, b) => b.score - a.score);
const kept = [];
for (const it of items) {
  const n = norm(it.name);
  const dup = kept.find((k) => k.r === it.r && km(k, it) < 0.4 && (norm(k.name) === n || norm(k.name).includes(n) || n.includes(norm(k.name))));
  if (dup) {
    for (const f of ["web", "hours", "wd", "wp", "height", "ele", "ort"]) dup[f] ??= it[f];
    continue;
  }
  kept.push(it);
}
items = kept;
for (const it of items) it.ort ??= nearestTown(it);

// ---------- Wikidata / Wikipedia ----------
const cacheFile = path.join(dir, "wiki-cache.json");
const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, "utf8")) : { wd: {}, wp: {}, img: {} };
const save = () => fs.writeFileSync(cacheFile, JSON.stringify(cache));
async function getJson(url) {
  for (let i = 0; i < 9; i++) {
    const res = await fetch(url, { headers: UA });
    if (res.ok) return res.json();
    const wait = Math.min(90000, 5000 * 2 ** i);
    console.log(`  HTTP ${res.status}, warte ${wait / 1000} s`);
    await sleep(wait);
  }
  throw new Error(`fehlgeschlagen: ${url}`);
}

const wdIds = [...new Set(items.map((i) => i.wd).filter((q) => q && /^Q\d+$/.test(q) && !(q in cache.wd)))];
for (let i = 0; i < wdIds.length; i += 50) {
  const ids = wdIds.slice(i, i + 50);
  const j = await getJson(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks|claims|descriptions&languages=de&sitefilter=dewiki|frwiki|itwiki&ids=${ids.join("|")}`);
  for (const q of ids) {
    const e = j.entities?.[q];
    cache.wd[q] = e
      ? {
          de: e.sitelinks?.dewiki?.title,
          img: e.claims?.P18?.[0]?.mainsnak?.datavalue?.value,
          web: e.claims?.P856?.[0]?.mainsnak?.datavalue?.value,
          desc: e.descriptions?.de?.value,
        }
      : {};
  }
  console.log(`wikidata ${Math.min(i + 50, wdIds.length)}/${wdIds.length}`);
  save();
  await sleep(1500);
}

for (const it of items) {
  const w = it.wd ? cache.wd[it.wd] : undefined;
  let de = w?.de;
  if (!de && it.wp?.startsWith("de:")) de = it.wp.slice(3);
  it.deTitle = de;
  it.wdImg = w?.img;
  it.web ??= w?.web;
  it.wdDesc = w?.desc;
}

const titles = [...new Set(items.map((i) => i.deTitle).filter((t) => t && !(t in cache.wp)))];
for (let i = 0; i < titles.length; i += 20) {
  const batch = titles.slice(i, i + 20);
  const j = await getJson(`https://de.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=extracts|pageimages&exintro=1&explaintext=1&exsentences=3&exlimit=20&piprop=name&titles=${encodeURIComponent(batch.join("|"))}`);
  const back = {};
  for (const r of j.query?.normalized ?? []) back[r.to] = r.from;
  for (const r of j.query?.redirects ?? []) back[r.to] = back[r.from] ?? r.from;
  for (const p of Object.values(j.query?.pages ?? {})) {
    const orig = back[p.title] ?? p.title;
    cache.wp[orig] = p.missing !== undefined ? {} : { title: p.title, ex: p.extract, img: p.pageimage };
  }
  for (const t of batch) cache.wp[t] ??= {};
  console.log(`wikipedia ${Math.min(i + 20, titles.length)}/${titles.length}`);
  save();
  await sleep(1500);
}

// Foto: Wikidata P18 vor Wikipedia-Seitenbild; Urheber + Lizenz aus Commons
for (const it of items) {
  const wp = it.deTitle ? cache.wp[it.deTitle] : undefined;
  it.file = it.wdImg || wp?.img;
  if (wp?.title) it.wpTitle = wp.title;
  it.ex = wp?.ex;
}
const files = [...new Set(items.map((i) => i.file).filter((f) => f && !(f in cache.img) && !/\.(svg|tif|tiff|pdf)$/i.test(f)))];
for (let i = 0; i < files.length; i += 40) {
  const batch = files.slice(i, i + 40);
  const j = await getJson(`https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=640&iiextmetadatafilter=Artist|LicenseShortName&titles=${encodeURIComponent(batch.map((f) => `File:${f}`).join("|"))}`);
  const back = {};
  for (const r of j.query?.normalized ?? []) back[r.to] = r.from.replace(/^File:/, "");
  for (const p of Object.values(j.query?.pages ?? {})) {
    const orig = back[p.title] ?? p.title.replace(/^File:/, "");
    const ii = p.imageinfo?.[0];
    if (!ii) { cache.img[orig] = {}; continue; }
    const artist = (ii.extmetadata?.Artist?.value ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 80);
    cache.img[orig] = { src: ii.thumburl, page: ii.descriptionurl, w: ii.thumbwidth, h: ii.thumbheight, by: artist || undefined, lic: ii.extmetadata?.LicenseShortName?.value };
  }
  for (const f of batch) cache.img[f] ??= {};
  console.log(`commons ${Math.min(i + 40, files.length)}/${files.length}`);
  save();
  await sleep(1500);
}

// Kurzbeschreibung: höchstens zwei Sätze, ohne Klammer-Aussprache/Koordinaten
const clean = (s) => {
  if (!s) return undefined;
  let t = s.replace(/\s*\([^()]*\)/g, "").replace(/\s+/g, " ").replace(/\s+([,.])/g, "$1").trim();
  const sentences = t.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [t];
  t = "";
  for (const x of sentences) {
    if ((t + x).length > 320 && t) break;
    t += x;
  }
  return t.trim() || undefined;
};

const out = items
  .map((it) => {
    const im = it.file ? cache.img[it.file] : undefined;
    return {
      r: it.r,
      id: it.id,
      name: it.name,
      lat: it.lat,
      lng: it.lng,
      kt: it.kt,
      ...(it.ort ? { ort: it.ort } : {}),
      ...(it.web ? { web: it.web.startsWith("http") ? it.web : `https://${it.web}` } : {}),
      ...(it.hours ? { hours: it.hours } : {}),
      ...(it.fee !== undefined ? { fee: it.fee } : {}),
      ...(it.wheel !== undefined ? { wheel: it.wheel } : {}),
      ...(it.height ? { height: it.height } : {}),
      ...(it.ele ? { ele: Math.round(it.ele) } : {}),
      ...(it.sub ? { sub: it.sub } : {}),
      ...(clean(it.ex) ? { text: clean(it.ex) } : it.wdDesc ? { desc: it.wdDesc } : {}),
      ...(it.wpTitle ? { wiki: `https://de.wikipedia.org/wiki/${encodeURIComponent(it.wpTitle.replace(/ /g, "_"))}` } : {}),
      ...(im?.src ? { img: { src: im.src, w: im.w, h: im.h, page: im.page, by: im.by, lic: im.lic } } : {}),
      q: (it.ex ? 4 : 0) + (im?.src ? 3 : 0) + (it.web ? 2 : 0) + (it.hours ? 1 : 0) + (it.wd ? 1 : 0),
    };
  })
  .sort((a, b) => b.q - a.q || a.name.localeCompare(b.name, "de"));

fs.writeFileSync("src/data/rubriken.json", JSON.stringify(out));
const by = {};
for (const o of out) by[o.r] = (by[o.r] ?? 0) + 1;
console.log("fertig:", out.length, by, "mit Text", out.filter((o) => o.text).length, "mit Foto", out.filter((o) => o.img).length);
