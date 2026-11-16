// Weihnachtsmärkte 2026: Recherche-Dateien zusammenführen und prüfen → src/data/weihnachtsmaerkte.json
// - Koordinaten müssen im angegebenen Kanton liegen (Kantonsflächen von geo.admin.ch)
// - Haltestellen werden gegen transport.opendata.ch geprüft und notfalls durch die nächste ersetzt
// Aufruf: node scripts/build-weihnachtsmaerkte.mjs <cache-ordner mit kt/> <recherche1.json> [<recherche2.json> …]
import fs from "node:fs";
import path from "node:path";

const [dir, ...inputs] = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rad = (d) => (d * Math.PI) / 180;
const km = (a, b) => {
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};
const cantons = [];
for (let i = 1; i <= 26; i++) {
  const f = JSON.parse(fs.readFileSync(path.join(dir, `kt/${i}.json`), "utf8")).feature;
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

async function get(url) {
  for (let i = 0; i < 5; i++) {
    const r = await fetch(url);
    if (r.ok) return r.json();
    await sleep(3000 * (i + 1));
  }
  return {};
}

const all = inputs.flatMap((f) => JSON.parse(fs.readFileSync(f, "utf8")));
const ids = new Set();
const out = [];
for (const m of all) {
  if (ids.has(m.id)) continue;
  ids.add(m.id);
  const kt = cantonOf(m.coords);
  // Basler Märkte können knapp jenseits der Grenze liegen (Laufenburg DE) → nur warnen
  if (kt !== m.canton) console.log(`! ${m.id}: Koordinaten in ${kt ?? "Ausland"}, angegeben ${m.canton}`);
  // Haltestelle prüfen
  let oev = m.oev;
  const found = oev ? await get(`https://transport.opendata.ch/v1/locations?query=${encodeURIComponent(oev)}&type=station`) : {};
  const exact = (found.stations ?? []).find((s) => s.id && s.name === oev && s.coordinate?.x && km(m.coords, { lat: s.coordinate.x, lng: s.coordinate.y }) < 3);
  if (!exact) {
    const near = await get(`https://transport.opendata.ch/v1/locations?x=${m.coords.lat}&y=${m.coords.lng}&type=station`);
    const best = (near.stations ?? []).filter((s) => s.id && s.coordinate?.x).map((s) => ({ name: s.name, d: km(m.coords, { lat: s.coordinate.x, lng: s.coordinate.y }) })).sort((a, b) => a.d - b.d)[0];
    console.log(`  ${m.id}: Haltestelle «${oev}» → «${best?.name}» (${best ? Math.round(best.d * 1000) : "?"} m)`);
    oev = best?.name;
  }
  await sleep(250);
  const { confirmed, note, ...rest } = m;
  out.push({ ...rest, oev, checked: "2026-11-16" });
}
out.sort((a, b) => ({ gross: 0, mittel: 1, klein: 2 })[a.size] - ({ gross: 0, mittel: 1, klein: 2 })[b.size] || a.from.localeCompare(b.from));
fs.writeFileSync("src/data/weihnachtsmaerkte.json", JSON.stringify(out, null, 1));
console.log("fertig:", out.length);
