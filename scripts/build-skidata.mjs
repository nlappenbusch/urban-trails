// Baut src/data/ski-osm.json: Schweizer Skigebiete aus OpenSkiData (ODbL, © OpenStreetMap-Mitwirkende, OpenSkiMap, Skimap.org).
// Aufruf: node scripts/build-skidata.mjs [pfad/zu/ski_areas.geojson]  (ohne Pfad wird heruntergeladen, ~21 MB)
import { readFileSync, writeFileSync } from "node:fs";

const src = process.argv[2];
const raw = src
  ? readFileSync(src, "utf8")
  : await (await fetch("https://tiles.openskimap.org/geojson/ski_areas.geojson", { headers: { "User-Agent": "urban-trails.ch build" } })).text();
const fc = JSON.parse(raw);

const r1 = (x) => Math.round(x * 10) / 10;
const out = [];
for (const f of fc.features) {
  const p = f.properties;
  if (!(p.places ?? []).some((x) => x.iso3166_1Alpha2 === "CH")) continue;
  if (p.status !== "operating" || !p.activities?.includes("downhill") || !p.name) continue;
  const d = p.statistics?.runs?.byActivity?.downhill?.byDifficulty ?? {};
  const cat = (k) => (d[k] ? { n: d[k].count, km: r1(d[k].lengthInKm) } : undefined);
  const blue = [cat("novice"), cat("easy")].filter(Boolean).reduce((a, b) => ({ n: a.n + b.n, km: r1(a.km + b.km) }), { n: 0, km: 0 });
  const runs = { blue, red: cat("intermediate") ?? { n: 0, km: 0 }, black: [cat("advanced"), cat("expert")].filter(Boolean).reduce((a, b) => ({ n: a.n + b.n, km: r1(a.km + b.km) }), { n: 0, km: 0 }), freeride: cat("freeride") };
  const totalKm = r1(runs.blue.km + runs.red.km + runs.black.km);
  if (totalKm < 2) continue;
  const lifts = Object.values(p.statistics?.lifts?.byType ?? {}).reduce((a, b) => a + b.count, 0);
  const [lng, lat] = f.geometry.type === "Point" ? f.geometry.coordinates : [null, null];
  if (lat == null) continue;
  const canton = (p.places.find((x) => x.iso3166_2)?.iso3166_2 ?? "").replace("CH-", "");
  out.push({
    id: p.id.slice(0, 12),
    name: p.name,
    canton,
    lat: Math.round(lat * 1e4) / 1e4,
    lng: Math.round(lng * 1e4) / 1e4,
    web: p.websites?.[0],
    minEl: p.statistics?.minElevation ? Math.round(p.statistics.minElevation) : undefined,
    maxEl: p.statistics?.maxElevation ? Math.round(p.statistics.maxElevation) : undefined,
    runs,
    totalKm,
    lifts,
  });
}
out.sort((a, b) => b.totalKm - a.totalKm);
writeFileSync(new URL("../src/data/ski-osm.json", import.meta.url), JSON.stringify(out));
console.log(`${out.length} Skigebiete, grösstes: ${out[0].name} (${out[0].totalKm} km)`);
