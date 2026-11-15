// Sportgeschäfte / Skivermietungen rund um jedes Skigebiet (OSM) → src/data/skirent.json
// Aufruf: node scripts/build-skirent.mjs [overpass.json]   (ohne Argument: frisch von Overpass)
import fs from "node:fs";

const raw = JSON.parse(fs.readFileSync("src/data/skigebiete.json", "utf8"));
const areas = Array.isArray(raw) ? raw : raw.areas;

let src;
if (process.argv[2]) src = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
else {
  const parts = areas.map((a) => `nwr["shop"~"^(sports|ski|outdoor)$"](around:3500,${a.coords.lat},${a.coords.lng});nwr["amenity"="ski_rental"](around:3500,${a.coords.lat},${a.coords.lng});`).join("");
  const res = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", headers: { "user-agent": "urban-trails-build/1.0" }, body: new URLSearchParams({ data: `[out:json][timeout:180];(${parts});out center tags;` }) });
  src = await res.json();
}

const rad = (d) => (d * Math.PI) / 180;
const dist = (a, b) => {
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

/** Ketten mit Online-Reservierung und Abholung im Shop */
const CHAINS = [
  { re: /intersport/i, chain: "Intersport Rent", book: "https://www.intersportrent.ch" },
  { re: /skiset/i, chain: "Skiset", book: "https://www.skiset.com" },
  { re: /swiss ?rent|rent a sport/i, chain: "Swiss Rent a Sport", book: "https://www.swissrent.com" },
  { re: /sport ?2000/i, chain: "Sport 2000 Rent", book: "https://www.sport2000rent.com" },
];

const shops = src.elements
  .map((e) => {
    const t = e.tags ?? {};
    const lat = e.lat ?? e.center?.lat, lng = e.lon ?? e.center?.lon;
    const name = t.name || t.brand;
    if (!name || lat == null) return null;
    const hit = CHAINS.find((c) => c.re.test(`${name} ${t.brand ?? ""} ${t.website ?? ""}`));
    const site = t.website || t["contact:website"] || "";
    return {
      name,
      lat: Math.round(lat * 1e5) / 1e5,
      lng: Math.round(lng * 1e5) / 1e5,
      website: site && !/^https?:/i.test(site) ? `https://${site}` : site,
      phone: t.phone || t["contact:phone"] || "",
      hours: t.opening_hours || "",
      rental: t.amenity === "ski_rental" || /ski/.test(t.rental ?? "") || t["service:ski:rental"] === "yes" || t.shop === "ski" || /rent|verleih|miete|location/i.test(name),
      ...(hit ? { chain: hit.chain, book: hit.book } : {}),
    };
  })
  .filter(Boolean);

const out = {};
for (const a of areas) {
  const seen = new Set();
  const list = shops
    .map((s) => ({ ...s, km: Math.round(dist(a.coords, s) * 10) / 10 }))
    .filter((s) => s.km <= 3.5)
    .sort((x, y) => Number(y.rental) - Number(x.rental) || x.km - y.km)
    .filter((s) => {
      const k = s.name.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, 8);
  if (list.length) out[a.id] = list;
}
fs.writeFileSync("src/data/skirent.json", JSON.stringify(out));
const n = Object.values(out);
console.log(`Gebiete mit Shops: ${n.length}/${areas.length}, Shops: ${n.flat().length}, Ketten mit Online-Reservierung: ${n.flat().filter((s) => s.book).length}`);
