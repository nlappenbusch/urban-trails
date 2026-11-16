// Schlittelwege der Schweiz aus OpenStreetMap (piste:type=sled) → src/data/schlitteln.json
// Länge, Höhen oben/unten (Mapbox terrain-rgb), Kanton, nächster Ort, Haltestellen oben und unten.
//
// Aufruf: node scripts/build-schlitteln.mjs <cache-ordner>
//   <cache-ordner>/sled.json       Overpass: way/relation["piste:type"="sled"](CH); out geom tags;
//   <cache-ordner>/orte.json, kt/  wie bei build-rubriken.mjs
// Haltestellen werden in <cache-ordner>/sled-stations.json zwischengespeichert.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = process.argv[2];
if (!dir) throw new Error("Cache-Ordner fehlt");
const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rad = (d) => (d * Math.PI) / 180;
const km = (a, b) => {
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};
const lineKm = (pts) => pts.reduce((s, p, i) => (i ? s + km(pts[i - 1], p) : 0), 0);

// ---------- Kantone + Orte (wie build-rubriken) ----------
const cantons = [];
for (let i = 1; i <= 26; i++) {
  const f = read(`kt/${i}.json`).feature;
  cantons.push({ ak: f.properties.ak, bbox: f.bbox, polys: f.geometry.type === "MultiPolygon" ? f.geometry.coordinates : [f.geometry.coordinates] });
}
const inRing = (x, y, ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const cantonOf = ({ lng, lat }) => {
  for (const c of cantons) {
    const [a, b, d, e] = c.bbox;
    if (lng < a || lng > d || lat < b || lat > e) continue;
    for (const poly of c.polys) if (inRing(lng, lat, poly[0]) && !poly.slice(1).some((h) => inRing(lng, lat, h))) return c.ak;
  }
  return null;
};
const towns = read("orte.json").elements.filter((e) => e.tags?.name).map((e) => ({ name: e.tags["name:de"] || e.tags.name, lat: e.lat, lng: e.lon }));
const nearestTown = (p) => {
  let best, bd = 99;
  for (const t of towns) {
    if (Math.abs(t.lat - p.lat) > 0.1 || Math.abs(t.lng - p.lng) > 0.15) continue;
    const d = km(p, t);
    if (d < bd) (bd = d), (best = t);
  }
  return best && bd < 8 ? best.name : undefined;
};

// ---------- Linien zusammensetzen ----------
const pts = (geom) => geom.map((g) => ({ lat: g.lat, lng: g.lon }));
function chain(segs) {
  const left = segs.map((s) => [...s]).sort((a, b) => lineKm(b) - lineKm(a));
  const chains = [];
  while (left.length) {
    let cur = left.shift();
    for (let grown = true; grown; ) {
      grown = false;
      for (let i = 0; i < left.length; i++) {
        const s = left[i], a = cur[0], b = cur[cur.length - 1];
        const s0 = s[0], s1 = s[s.length - 1];
        if (km(b, s0) < 0.04) cur = [...cur, ...s.slice(1)];
        else if (km(b, s1) < 0.04) cur = [...cur, ...[...s].reverse().slice(1)];
        else if (km(a, s1) < 0.04) cur = [...s, ...cur.slice(1)];
        else if (km(a, s0) < 0.04) cur = [...[...s].reverse(), ...cur.slice(1)];
        else continue;
        left.splice(i, 1);
        grown = true;
        break;
      }
    }
    chains.push(cur);
  }
  return chains.sort((a, b) => lineKm(b) - lineKm(a));
}

const src = read("sled.json").elements;
const ways = new Map(src.filter((e) => e.type === "way" && e.geometry).map((e) => [e.id, e]));
const used = new Set();
const runs = [];
const tagsOf = (t) => ({
  name: t.name || t["piste:name"],
  lit: t["piste:lit"] === "yes" || t.lit === "yes",
  diff: t["piste:difficulty"],
  web: t.website || t["contact:website"],
  inofficial: /inoffiziell|unofficial|stillgelegt|disused|abandoned/i.test(`${t.note ?? ""} ${t.description ?? ""} ${t.name ?? ""}`) || t.disused === "yes",
});
for (const r of src.filter((e) => e.type === "relation")) {
  const segs = [];
  for (const m of r.members ?? []) {
    if (m.type !== "way" || !m.geometry) continue;
    used.add(m.ref);
    segs.push(pts(m.geometry));
  }
  if (!segs.length) continue;
  const lit = (r.members ?? []).some((m) => { const w = ways.get(m.ref); return w && (w.tags["piste:lit"] === "yes" || w.tags.lit === "yes"); });
  const t = tagsOf(r.tags ?? {});
  runs.push({ ...t, lit: t.lit || lit, lines: chain(segs) });
}
const groups = new Map();
for (const w of ways.values()) {
  if (used.has(w.id)) continue;
  const t = tagsOf(w.tags ?? {});
  const k = t.name ?? "";
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push({ t, p: pts(w.geometry) });
}
for (const [name, list] of groups) {
  const chains = chain(list.map((x) => x.p));
  // pro zusammenhängender Kette ein Weg (gleicher Name kann an mehreren Orten vorkommen)
  for (const c of chains) {
    const own = list.filter((x) => c.some((p) => km(p, x.p[0]) < 0.05));
    const any = (f) => own.map((x) => x.t[f]).find(Boolean);
    runs.push({ name: name || undefined, lit: own.some((x) => x.t.lit), diff: any("diff"), web: any("web"), inofficial: own.some((x) => x.t.inofficial), lines: [c] });
  }
}

// ---------- Höhen ----------
const env = fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "";
const TOKEN = process.env.MAPBOX_TOKEN || /NEXT_PUBLIC_MAPBOX_TOKEN=(\S+)/.exec(env)?.[1];
const Z = 13;
const tiles = new Map();
async function tile(x, y) {
  const k = `${x}/${y}`;
  if (!tiles.has(k)) {
    tiles.set(k, (async () => {
      for (let attempt = 1; ; attempt++) {
        const res = await fetch(`https://api.mapbox.com/v4/mapbox.terrain-rgb/${Z}/${x}/${y}.pngraw?access_token=${TOKEN}`);
        if (res.ok) return sharp(Buffer.from(await res.arrayBuffer())).raw().toBuffer({ resolveWithObject: true });
        if (attempt > 4) throw new Error(`Terrain ${res.status}`);
        await sleep(2000 * attempt);
      }
    })());
  }
  return tiles.get(k);
}
async function ele(p) {
  const n2 = 2 ** Z;
  const fx = ((p.lng + 180) / 360) * n2;
  const fy = ((1 - Math.log(Math.tan(rad(p.lat)) + 1 / Math.cos(rad(p.lat))) / Math.PI) / 2) * n2;
  const { data, info } = await tile(Math.floor(fx), Math.floor(fy));
  const px = Math.min(info.width - 1, Math.floor((fx % 1) * info.width));
  const py = Math.min(info.height - 1, Math.floor((fy % 1) * info.height));
  const o = (py * info.width + px) * info.channels;
  return Math.round(-10000 + (data[o] * 65536 + data[o + 1] * 256 + data[o + 2]) * 0.1);
}

// Douglas-Peucker (~12 m)
function simplify(p, tol = 0.012) {
  if (p.length < 3) return p;
  const perp = (q, a, b) => {
    const x = (b.lng - a.lng) * Math.cos(rad(a.lat)), y = b.lat - a.lat;
    const qx = (q.lng - a.lng) * Math.cos(rad(a.lat)), qy = q.lat - a.lat;
    const l = x * x + y * y;
    const t = l ? Math.max(0, Math.min(1, (qx * x + qy * y) / l)) : 0;
    return Math.hypot(qx - t * x, qy - t * y) * 111.32;
  };
  let md = 0, mi = 0;
  for (let i = 1; i < p.length - 1; i++) { const d = perp(p[i], p[0], p[p.length - 1]); if (d > md) (md = d), (mi = i); }
  if (md <= tol) return [p[0], p[p.length - 1]];
  return [...simplify(p.slice(0, mi + 1), tol).slice(0, -1), ...simplify(p.slice(mi), tol)];
}

// ---------- Haltestellen (transport.opendata.ch) ----------
const stFile = path.join(dir, "sled-stations.json");
const stCache = fs.existsSync(stFile) ? JSON.parse(fs.readFileSync(stFile, "utf8")) : {};
async function station(p) {
  const k = `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`;
  if (!(k in stCache)) {
    for (let a = 0; a < 5; a++) {
      const res = await fetch(`https://transport.opendata.ch/v1/locations?x=${p.lat}&y=${p.lng}&type=station`);
      if (res.ok) {
        const j = await res.json();
        const s = (j.stations ?? []).filter((s) => s.id && s.coordinate?.x).map((s) => ({ name: s.name, d: Math.round(km(p, { lat: s.coordinate.x, lng: s.coordinate.y }) * 1000) })).sort((a, b) => a.d - b.d)[0];
        stCache[k] = s && s.d < 1500 ? s : null;
        break;
      }
      await sleep(3000 * (a + 1));
    }
    fs.writeFileSync(stFile, JSON.stringify(stCache));
    await sleep(350);
  }
  return stCache[k] ?? undefined;
}

const ski = JSON.parse(fs.readFileSync("src/data/skigebiete.json", "utf8"));
const areas = Array.isArray(ski) ? ski : ski.areas;
const night = JSON.parse(fs.readFileSync("src/data/nachtski.json", "utf8")).filter((o) => o.type !== "ski");

const GENERIC = /^(schlittel(weg|bahn|piste|strecke)|rodel(bahn|weg)|piste de luge|pista da slitta|pista per slittini|chemin de luge|schlittelweg \d+)$/i;
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const out = [];
const ids = new Set();
let n = 0;
for (const r of runs) {
  const main = r.lines[0];
  const len = lineKm(main);
  if (r.inofficial) continue;
  if (len < (r.name ? 0.6 : 1.5)) continue;
  // Höchster und tiefster Punkt der Hauptlinie (Endpunkte allein täuschen bei Schleifen/Gegensteigungen)
  const probe = simplify(main, 0.03);
  const withEle = [];
  for (const p of probe) withEle.push({ ...p, ele: await ele(p) });
  const top = withEle.reduce((m, p) => (p.ele > m.ele ? p : m));
  const bottom = withEle.reduce((m, p) => (p.ele < m.ele ? p : m));
  const drop = top.ele - bottom.ele;
  if (drop < 40) continue; // flache Wege sind Winterwanderwege, keine Schlittelwege
  const kt = cantonOf(bottom) || cantonOf(top);
  if (!kt) continue;
  const ort = nearestTown(bottom) || nearestTown(top);
  let name = r.name?.trim();
  let via;
  if (name && /(strasse|weg|gasse)$/i.test(name) && !/schlittel|rodel|luge|slitt/i.test(name)) (via = name), (name = undefined);
  if (!name || GENERIC.test(name) || /^d+$/.test(name) || name.length < 4 || /^(easy|talabfahrt|pista slitte|bob run|hörnli)$/i.test(name)) name = `Schlittelweg ${ort ?? kt}`;
  let id = slug(name.includes(ort ?? "") ? name : `${name} ${ort ?? ""}`);
  while (ids.has(id)) id += "-2";
  ids.add(id);
  const [stTop, stBottom] = [await station(top), await station(bottom)];
  const area = areas.map((x) => ({ x, d: km(top, x.coords) })).sort((p, q) => p.d - q.d)[0];
  const nightOffer = night.map((x) => ({ x, d: km(bottom, x.coords) })).filter((p) => p.d < 4).sort((p, q) => p.d - q.d)[0];
  out.push({
    id,
    name,
    kt,
    ...(ort ? { ort } : {}),
    km: Math.round(len * 10) / 10,
    drop,
    top: { lat: +top.lat.toFixed(5), lng: +top.lng.toFixed(5), ele: top.ele, ...(stTop ? { st: stTop.name, d: stTop.d } : {}) },
    bottom: { lat: +bottom.lat.toFixed(5), lng: +bottom.lng.toFixed(5), ele: bottom.ele, ...(stBottom ? { st: stBottom.name, d: stBottom.d } : {}) },
    ...(via ? { via } : {}),
    ...(r.lit ? { lit: true } : {}),
    ...(r.diff ? { diff: r.diff } : {}),
    ...(r.web ? { web: r.web.startsWith("http") ? r.web : `https://${r.web}` } : {}),
    ...(area && area.d < 8 ? { ski: area.x.id } : {}),
    ...(nightOffer ? { night: nightOffer.x.id } : {}),
    lines: r.lines.filter((l) => lineKm(l) > 0.1).map((l) => simplify(l).map((p) => [+p.lng.toFixed(5), +p.lat.toFixed(5)])),
  });
  if (++n % 25 === 0) console.log(`  ${n} Wege, Kacheln ${tiles.size}`);
}
out.sort((a, b) => b.km - a.km);
for (let i = out.length - 1; i >= 0; i--) {
  const o = out[i];
  const twin = out.findIndex((x, j) => j < i && x.name.replace(/-2$/, "") === o.name && km(x.top, o.top) < 2);
  if (twin >= 0) { out[twin].lines.push(...o.lines); out.splice(i, 1); }
}
// gleicher Name, verschiedene Orte → Ort anhängen
const seen = {};
for (const o of out) seen[o.name] = (seen[o.name] ?? 0) + 1;
for (const o of out) if (seen[o.name] > 1 && o.ort && !o.name.includes(o.ort)) o.name = `${o.name} (${o.ort})`;
fs.writeFileSync("src/data/schlitteln.json", JSON.stringify(out));
const by = {};
for (const o of out) by[o.kt] = (by[o.kt] ?? 0) + 1;
console.log("fertig:", out.length, "Wege,", out.filter((o) => o.lit).length, "beleuchtet,", out.filter((o) => o.top.st).length, "mit Haltestelle oben", by);
console.log(out.slice(0, 8).map((o) => `${o.name} ${o.km} km ${o.drop} m`).join("\n"));
