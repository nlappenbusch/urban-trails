// Beleuchtete Pisten (OSM piste:lit/lit=yes) je Nachtski-Angebot → src/data/nachtski-lit.json
// Aufruf: node scripts/build-nachtski-lit.mjs [overpass.json]   (ohne Argument: frisch von Overpass)
import fs from "node:fs";

const Q = `[out:json][timeout:120];area["ISO3166-1"="CH"][admin_level=2]->.ch;(way["piste:type"~"downhill|sled|nordic"]["piste:lit"="yes"](area.ch);way["piste:type"~"downhill|sled|nordic"]["lit"="yes"](area.ch););out geom tags;`;

const src = process.argv[2]
  ? JSON.parse(fs.readFileSync(process.argv[2], "utf8"))
  : await (await fetch("https://overpass-api.de/api/interpreter", { method: "POST", headers: { "user-agent": "urban-trails-build/1.0" }, body: new URLSearchParams({ data: Q }) })).json();

const offers = JSON.parse(fs.readFileSync("src/data/nachtski.json", "utf8"));
const R = 6371;
const rad = (d) => (d * Math.PI) / 180;
const dist = (a, b) => {
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
const len = (g) => g.slice(1).reduce((s, p, i) => s + dist({ lat: g[i].lat, lng: g[i].lon }, { lat: p.lat, lng: p.lon }), 0);
const round = (n) => Math.round(n * 1e5) / 1e5;

const ways = src.elements
  .filter((e) => e.type === "way" && e.geometry?.length > 1)
  .map((e) => {
    const t = e.tags["piste:type"].split(";")[0];
    return {
      id: e.id,
      kind: t === "downhill" ? "ski" : t === "sled" ? "schlitteln" : "langlauf",
      name: e.tags["piste:name"] || e.tags.name || "",
      diff: e.tags["piste:difficulty"] || "",
      geom: e.geometry,
      km: len(e.geometry),
    };
  });

const out = {};
for (const o of offers) {
  const want = o.type === "ski" ? "ski" : "schlitteln";
  const near = ways.filter((w) => w.kind === want && w.geom.some((p) => dist(o.coords, { lat: p.lat, lng: p.lon }) < 3.5));
  if (!near.length) continue;
  const km = near.reduce((s, w) => s + w.km, 0);
  out[o.id] = {
    km: Math.round(km * 10) / 10,
    type: "FeatureCollection",
    features: near.map((w) => ({
      type: "Feature",
      properties: { name: w.name, diff: w.diff },
      geometry: { type: "LineString", coordinates: w.geom.map((p) => [round(p.lon), round(p.lat)]) },
    })),
  };
}

// Beleuchtete Loipen (Nachtlanglauf) als eigene Liste
const loipen = ways.filter((w) => w.kind === "langlauf");
fs.writeFileSync("src/data/nachtski-lit.json", JSON.stringify(out));
console.log(`Angebote mit OSM-Lichtpiste: ${Object.keys(out).length}/${offers.length}`);
for (const [k, v] of Object.entries(out)) console.log(`  ${k}: ${v.features.length} Wege, ${v.km} km`);
console.log(`Beleuchtete Loipen in OSM: ${loipen.length}`);
