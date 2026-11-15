// Pistenausrichtung je Skigebiet: Pisten aus OSM, Höhen aus Mapbox Terrain-RGB
// → src/data/sonne/<gebiet>.json  { runs: [{ n, d, km, seg: [[aspect°, slope°, km]], g: [[lng,lat],…] }] }
// Aufruf: node scripts/build-sonne.mjs [overpass.json]
import fs from "node:fs";
import sharp from "sharp";

const raw = JSON.parse(fs.readFileSync("src/data/skigebiete.json", "utf8"));
const areas = Array.isArray(raw) ? raw : raw.areas;
const R = 7; // km um den Gebietspunkt

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rad = (d) => (d * Math.PI) / 180;
const deg = (r) => (r * 180) / Math.PI;
const dist = (a, b) => {
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};
const bearing = (a, b) => {
  const y = Math.sin(rad(b.lng - a.lng)) * Math.cos(rad(b.lat));
  const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lng - a.lng));
  return (deg(Math.atan2(y, x)) + 360) % 360;
};

let src;
if (process.argv[2]) src = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
else {
  const parts = areas.map((a) => `way["piste:type"="downhill"](around:${R * 1000},${a.coords.lat},${a.coords.lng});`).join("");
  const res = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", headers: { "user-agent": "urban-trails-build/1.0" }, body: new URLSearchParams({ data: `[out:json][timeout:300];(${parts});out geom tags;` }) });
  src = await res.json();
  fs.writeFileSync(process.env.SONNE_CACHE ?? "sonne-osm.json", JSON.stringify(src));
}

/** Punkt bei Anteil f entlang der Linie */
function along(g, f) {
  const segs = g.slice(1).map((p, i) => dist(g[i], p));
  const total = segs.reduce((s, x) => s + x, 0);
  let want = total * f;
  for (let i = 0; i < segs.length; i++) {
    if (want <= segs[i] || i === segs.length - 1) {
      const t = segs[i] ? Math.min(1, want / segs[i]) : 0;
      return { lat: g[i].lat + (g[i + 1].lat - g[i].lat) * t, lng: g[i].lng + (g[i + 1].lng - g[i].lng) * t };
    }
    want -= segs[i];
  }
  return g.at(-1);
}

const runs = [];
for (const e of src.elements) {
  if (e.type !== "way" || !e.geometry || e.geometry.length < 2) continue;
  if (e.tags.area === "yes" || e.geometry[0].lat === e.geometry.at(-1).lat && e.geometry[0].lon === e.geometry.at(-1).lon) continue;
  const g = e.geometry.map((p) => ({ lat: p.lat, lng: p.lon }));
  const km = g.slice(1).reduce((s, p, i) => s + dist(g[i], p), 0);
  if (km < 0.15) continue;
  // Gebiet: nächster Gebietspunkt
  const mid = along(g, 0.5);
  let best = null;
  for (const a of areas) {
    const d = dist(a.coords, mid);
    if (d <= R && (!best || d < best.d)) best = { a, d };
  }
  if (!best) continue;
  const n = Math.min(6, Math.max(2, Math.round(km / 0.4))) ; // Abschnitte
  const pts = Array.from({ length: n + 1 }, (_, i) => along(g, i / n));
  runs.push({ area: best.a.id, name: e.tags["piste:name"] || e.tags.name || "", diff: e.tags["piste:difficulty"] || "", km, g, pts });
}
console.log(`${runs.length} Pisten, ${runs.reduce((s, r) => s + r.pts.length, 0)} Höhenpunkte`);

// Höhen aus Mapbox Terrain-RGB (z13, ~15 m Pixel): height = -10000 + (R*65536 + G*256 + B) * 0.1
const env = fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "";
const TOKEN = process.env.MAPBOX_TOKEN || /NEXT_PUBLIC_MAPBOX_TOKEN=(\S+)/.exec(env)?.[1];
if (!TOKEN) throw new Error("Mapbox-Token fehlt");
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
const all = runs.flatMap((r) => r.pts);
const n2 = 2 ** Z;
for (let i = 0; i < all.length; i++) {
  const p = all[i];
  const fx = ((p.lng + 180) / 360) * n2;
  const fy = ((1 - Math.log(Math.tan(rad(p.lat)) + 1 / Math.cos(rad(p.lat))) / Math.PI) / 2) * n2;
  const { data, info } = await tile(Math.floor(fx), Math.floor(fy));
  const px = Math.min(info.width - 1, Math.floor((fx % 1) * info.width));
  const py = Math.min(info.height - 1, Math.floor((fy % 1) * info.height));
  const o = (py * info.width + px) * info.channels;
  p.ele = -10000 + (data[o] * 65536 + data[o + 1] * 256 + data[o + 2]) * 0.1;
  if (i % 3000 === 0) console.log(`  Höhen ${i}/${all.length}, Kacheln ${tiles.size}`);
}
console.log(`  Kacheln geladen: ${tiles.size}`);

const out = {};
for (const r of runs) {
  const seg = [];
  for (let i = 1; i < r.pts.length; i++) {
    const a = r.pts[i - 1], b = r.pts[i];
    const h = dist(a, b);
    const drop = a.ele - b.ele;
    if (!h || Math.abs(drop) < 8) continue; // flach → keine Ausrichtung
    const [hi, lo] = drop > 0 ? [a, b] : [b, a];
    seg.push([Math.round(bearing(hi, lo)), Math.round(deg(Math.atan(Math.abs(drop) / (h * 1000)))), Math.round(h * 100) / 100]);
  }
  if (!seg.length) continue;
  const step = Math.max(1, Math.ceil(r.g.length / 14));
  const g = r.g.filter((_, i) => i % step === 0 || i === r.g.length - 1).map((p) => [Math.round(p.lng * 1e5) / 1e5, Math.round(p.lat * 1e5) / 1e5]);
  const top = Math.round(Math.max(...r.pts.map((p) => p.ele)));
  (out[r.area] ??= []).push({ n: r.name, d: r.diff, km: Math.round(r.km * 100) / 100, top, seg, g });
}

fs.mkdirSync("src/data/sonne", { recursive: true });
for (const [id, list] of Object.entries(out)) fs.writeFileSync(`src/data/sonne/${id}.json`, JSON.stringify({ runs: list }));
console.log(`Gebiete: ${Object.keys(out).length}/${areas.length}; ohne: ${areas.filter((a) => !out[a.id]).map((a) => a.id).join(", ")}`);
