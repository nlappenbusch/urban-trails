// Badestellen der Schweiz aus OpenStreetMap (ODbL) → src/data/badestellen.json
// node scripts/build-badestellen.mjs [overpass.json]   (ohne Datei: frisch von Overpass holen)
import fs from "node:fs";

const Q = `[out:json][timeout:180];area["ISO3166-1"="CH"][admin_level=2]->.ch;(nwr["leisure"="bathing_place"](area.ch);nwr["leisure"="swimming_area"](area.ch);nwr["leisure"="water_park"](area.ch);nwr["leisure"="beach_resort"](area.ch);nwr["amenity"="public_bath"](area.ch);nwr["leisure"="sports_centre"]["sport"="swimming"](area.ch);nwr["leisure"="swimming_pool"]["access"!~"private|customers|no"]["name"](area.ch););out center tags;`;

const src = process.argv[2];
const j = src
  ? JSON.parse(fs.readFileSync(src, "utf8"))
  : await (await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: new URLSearchParams({ data: Q }), headers: { "User-Agent": "urban-trails.ch" } })).json();

const OPEN = /strandbad|seebad|flussbad|freibad am see|lido|plage|bain des|bains des|bagno|rheinbad|aarebad|badeplatz|badestelle|badestrand|badeanstalt|badhütte|badi\b|uferbad|seeuferbad|schwimmbad am see|baignade/i;
const INDOOR = /hallenbad|piscine couverte|piscina coperta|indoor|sportbad|schwimmhalle/i;
const THERME = /therm|mineralbad|bains de|bagni|solbad|spa\b|wellness/i;
const NOPE = /hotel|resort|privat|schule|school|kinderplansch|plansch|fitness|reha|spital|klinik|kaserne/i;

const kindOf = (t) => {
  const n = `${t.name ?? ""} ${t.alt_name ?? ""}`;
  if (t.leisure === "bathing_place" || t.leisure === "swimming_area" || t.leisure === "beach_resort") return "offen";
  if (THERME.test(n) && !OPEN.test(n)) return "therme";
  if (OPEN.test(n)) return "offen";
  if (INDOOR.test(n) || t.covered === "yes" || t.indoor === "yes" || t["bath:open_air"] === "no" || t.building) return "hallenbad";
  return "freibad";
};

const out = [];
for (const e of j.elements) {
  const t = e.tags ?? {};
  if (!t.name || NOPE.test(t.name) || !/[a-zà-ü]{3}/i.test(t.name)) continue;
  if (!["bathing_place", "swimming_area", "water_park", "beach_resort", "sports_centre", "swimming_pool"].includes(t.leisure) && t.amenity !== "public_bath") continue;
  const lat = e.lat ?? e.center?.lat, lng = e.lon ?? e.center?.lon;
  if (lat == null || lng == null) continue;
  const fee = t.fee === "no" ? false : t.fee === "yes" ? true : undefined;
  out.push({
    id: `osm-${e.type[0]}${e.id}`,
    name: t.name.trim(),
    kind: kindOf(t),
    lat: Math.round(lat * 1e5) / 1e5,
    lng: Math.round(lng * 1e5) / 1e5,
    ...(t["addr:city"] ? { town: t["addr:city"] } : {}),
    ...(t.website || t["contact:website"] ? { url: t.website || t["contact:website"] } : {}),
    ...(t.opening_hours ? { hours: t.opening_hours } : {}),
    ...(fee !== undefined ? { fee } : {}),
    ...(t.wheelchair === "yes" ? { wheelchair: true } : {}),
    ...(t.supervised === "yes" || t.lifeguard === "yes" ? { supervised: true } : {}),
  });
}

// Dubletten (gleicher Name, < 400 m) zusammenlegen – das Objekt mit mehr Angaben gewinnt
const km = (a, b) => {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180, dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(x));
};
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const kept = [];
for (const b of out.sort((x, y) => Object.keys(y).length - Object.keys(x).length)) {
  const dup = kept.find((k) => (norm(k.name) === norm(b.name) && km(k, b) < 0.4) || km(k, b) < 0.05);
  if (dup) {
    for (const [k, v] of Object.entries(b)) if (dup[k] === undefined) dup[k] = v;
    if (b.kind === "offen") dup.kind = "offen";
  } else kept.push(b);
}
kept.sort((a, b) => a.name.localeCompare(b.name, "de"));
fs.writeFileSync(new URL("../src/data/badestellen.json", import.meta.url), JSON.stringify(kept));
const by = kept.reduce((a, b) => ((a[b.kind] = (a[b.kind] ?? 0) + 1), a), {});
console.log(`${kept.length} Badestellen`, by);
