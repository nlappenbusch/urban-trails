/**
 * Nächtlicher Abgleich der Orte-Datenbank mit OpenStreetMap (Verzeichnis):
 * - geänderte Tags (Website, Öffnungszeiten, Eintritt, Rollstuhl) übernehmen
 * - neue Orte anlegen (Kanton per swisstopo, Kurztext/Foto per Wikidata → Wikipedia/Commons)
 * - verschwundene markieren und nach 14 Tagen ausblenden (nie löschen)
 * - Dubletten zu geprüften Orten neu verknüpfen
 * Korrekturen aus der Pflegeseite bleiben immer erhalten (eigene Tabelle).
 */
import { bump, getDb, linkDuplicates, log, markMissing, upsert, type UpsertRow } from "@/lib/db";
import type { RubrikItem } from "@/lib/rubriken-core";

const UA = { "user-agent": "UrbanTrailsSync/1.0 (https://urban-trails.ch)" };
const OVERPASS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"];
// Zwei kleinere Abfragen statt einer grossen: Overpass bricht grosse Abfragen unter Last ab.
const HEAD = `[out:json][timeout:300];
area(3600051701)->.ch;
(`;
const QUERIES = [
  `${HEAD}
 nwr["tourism"="zoo"](area.ch);
 nwr["tourism"="museum"]["name"](area.ch);
 nwr["historic"~"^(castle|fort|ruins)$"]["name"]["castle_type"!~"manor|stately"](area.ch);
 nwr["natural"="cave_entrance"]["name"](area.ch);
 nwr["tourism"="theme_park"](area.ch);
 nwr["leisure"="water_park"]["name"](area.ch);
 nwr["man_made"="tower"]["tower:type"="observation"]["name"](area.ch);
 nwr["waterway"="waterfall"]["name"](area.ch);
 nwr["natural"="waterfall"]["name"](area.ch);
 nwr["sport"="climbing_adventure"](area.ch);
 nwr["leisure"="miniature_golf"]["name"](area.ch);
 nwr["tourism"="aquarium"](area.ch);
 nwr["amenity"="planetarium"](area.ch);
 nwr["man_made"="observatory"]["name"](area.ch);
);
out center tags;`,
  `${HEAD}
 nwr["leisure"="ice_rink"]["name"](area.ch);
 relation["route"="piste"]["piste:type"~"^(nordic|hike|snowshoe)$"]["name"](area.ch);
 nwr["attraction"="summer_toboggan"]["name"](area.ch);
 nwr["sport"="climbing"]["leisure"~"sports_centre|sports_hall|pitch"]["name"](area.ch);
 way["highway"="via_ferrata"]["name"](area.ch);
 relation["route"~"^(ferrata|via_ferrata)$"]["name"](area.ch);
 nwr["amenity"="public_bath"]["name"](area.ch);
 nwr["leisure"="spa"]["name"](area.ch);
 relation["route"~"^(hiking|foot)$"]["name"~"lehrpfad|themenweg|erlebnisweg|sagenweg|planetenweg|naturpfad|skulpturenweg|barfuss|märliweg|zwergliweg|kulturweg|sentier didactique|sentier découverte|sentiero didattico",i](area.ch);
 way["railway"="funicular"]["name"](area.ch);
 way["aerialway"~"^(cable_car|gondola)$"]["name"](area.ch);
 relation["route"~"^(bicycle|mtb)$"]["network"~"^(ncn|rcn)$"](area.ch);
 nwr["leisure"="bike_park"](area.ch);
 nwr["sport"~"bmx|pump"]["name"](area.ch);
 nwr["name"~"pump ?track|bike ?park|dirt ?park|velopark|bike ?parcours|skills ?park",i](area.ch);
);
out center tags;`,
];

type Tags = Record<string, string | undefined>;
const CASTLE = /burg|schloss|ruine|château|chateau|castel|castell|feste|festung|chastè|tour |turm|tour$|fort/i;
const THEMENWEG = /lehrpfad|themenweg|erlebnisweg|sagenweg|planetenweg|naturpfad|skulpturenweg|barfuss|märliweg|zwergliweg|kulturweg|sentier didactique|sentier découverte|sentiero didattico/i;
const THERME = /therm|bogn|solbad|sole|spa\b|hammam|bains|bagni/i;
/** Linien (Loipen, Bahnen, Wege): Abschnitte gleichen Namens bis 3 km gelten als derselbe Ort */
const LINE_RUBRIKEN = new Set(["langlauf", "winterwandern", "klettersteige", "bergbahnen", "themenwege", "velorouten"]);
const BIKE = /pump ?track|bike ?park|dirt ?park|bmx|velopark|bike ?parcours|skills ?park/i;
const cleanName = (n: string) => n.replace(/^(snowshoes?|raquettes?)\s*:\s*/i, "").replace(/^Scheeschuh/, "Schneeschuh").replace(/_/g, " ").trim();

/** gleiche Regeln wie scripts/build-rubriken.mjs */
export function rubrikOf(t: Tags, type = "node"): string | null {
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
  if (t.access === "private" || t.access === "no") return null;
  if (t.leisure === "ice_rink") return t.sport === "curling" || /curling/i.test(t.name ?? "") ? null : "eisbahnen";
  if (t.route === "piste") return t["piste:type"] === "nordic" ? "langlauf" : /^(hike|snowshoe)$/.test(t["piste:type"] ?? "") ? "winterwandern" : null;
  if (t.attraction === "summer_toboggan") return /sentier|chemin|weg$/i.test(t.name ?? "") ? null : "rodelbahnen";
  if (t.highway === "via_ferrata" || t.route === "ferrata" || t.route === "via_ferrata") return "klettersteige";
  if (t.sport === "climbing") return t.leisure === "sports_centre" || t.leisure === "sports_hall" || /halle|boulder|kletterzentrum|salle|bloc/i.test(t.name ?? "") ? "kletterhallen" : null;
  if (t.amenity === "public_bath") return /^(lake|river|pool|foot_bath)$/.test(t["bath:type"] ?? "") ? null : /^(thermal|hot_spring|brine|hammam|roman|onsen)$/.test(t["bath:type"] ?? "") || THERME.test(t.name ?? "") ? "thermen" : null;
  if (t.leisure === "spa") return "thermen";
  if ((t.route === "hiking" || t.route === "foot") && type === "relation") return THEMENWEG.test(t.name ?? "") ? "themenwege" : null;
  if (t.railway === "funicular" || t.aerialway === "cable_car" || t.aerialway === "gondola") return t.usage === "freight" ? null : "bergbahnen";
  if ((t.route === "bicycle" || t.route === "mtb") && type === "relation") return /^(ncn|rcn)$/.test(t.network ?? "") && t.type !== "superroute" && (t.ref || /schweiz ?mobil|veloland/i.test(`${t.operator} ${t.url} ${t.website}`)) && !(Number.parseFloat(t.distance ?? "") < 5) ? "velorouten" : null;
  if (t.leisure === "bike_park" || /bmx|pump/.test(t.sport ?? "") || BIKE.test(t.name ?? "")) return t.tourism || t.amenity || t.shop || t.information || /posten|infotafel|regeln|club ?house|chalet|départ|rennbahn|velodrom|vélodrome/i.test(t.name ?? "") ? null : "bikeparks";
  return null;
}

/** Etappen-Name für Velo-/MTB-Routen; nationale Routen ohne Etappe (ganze Schweiz) fallen weg */
export function veloName(t: Tags, name: string) {
  const base = (name || (t.note ?? "").replace(/\s*-\s*stage.*$/i, "")).replace(/ - /g, " – ").trim();
  if (!base) return "";
  if (/\(.+–.+\)/.test(base) || (t.from && t.to && base.includes(t.from) && base.includes(t.to))) return base;
  if (t.from && t.to) return `${base.replace(/\s*–\s*(etappe|étape|tappa|stage).*$/i, "")}: ${t.from} – ${t.to}`;
  if (/etappe|étape|tappa|stage/i.test(base)) return base;
  const m = `${t.website ?? ""} ${t.url ?? ""}`.match(/etappe(\d+)\.0?(\d+)/);
  if (t.stage || m) return `${base} – Etappe ${t.stage ?? m![2]}`;
  return t.network === "ncn" ? "" : base;
}
const veloDesc = (t: Tags) => [`${t.route === "mtb" ? "Mountainbike" : "Velo"}-Route${t.ref ? ` ${t.ref.split(";")[0]}` : ""}, ${t.network === "ncn" ? "national" : "regional"}`, Number.parseFloat(t.distance ?? "") ? `${Math.round(Number.parseFloat(t.distance!))} km` : ""].filter(Boolean).join(" · ");

export function subOf(r: string, t: Tags): string | undefined {
  if (r === "eisbahnen") return t.indoor === "yes" || (t.building && t.building !== "no") || /halle|hall|arena|stadion|stadium/i.test(t.name ?? "") ? "halle" : t.indoor === "no" || /natur|see\b|lac\b/i.test(t.name ?? "") ? "freiluft" : undefined;
  if (r === "langlauf") { const g = t["piste:grooming"] ?? ""; return /classic/.test(g) && /skating/.test(g) ? "klassisch-skating" : /skating/.test(g) ? "skating" : /classic/.test(g) ? "klassisch" : undefined; }
  if (r === "winterwandern") return t["piste:type"] === "snowshoe" || /schneeschuh|scheeschuh|snowshoe|raquette|racchett/i.test(t.name ?? "") ? "schneeschuh" : "winterwanderweg";
  if (r === "klettersteige") return t.via_ferrata_scale ? `K${String(t.via_ferrata_scale).replace(/^k/i, "")}` : undefined;
  if (r === "bergbahnen") return t.railway === "funicular" ? "funicular" : t.aerialway;
  if (r === "thermen") return t["bath:type"] === "hammam" ? "hammam" : t.leisure === "spa" ? "spa" : "therme";
  if (r === "velorouten") return t.route === "mtb" ? "mtb" : "velo";
  if (r === "bikeparks") return /pump/i.test(`${t.sport ?? ""} ${t.name ?? ""}`) ? "pumptrack" : /bmx/i.test(`${t.sport ?? ""} ${t.name ?? ""}`) ? "bmx" : "bikepark";
  return t.zoo || t.museum || t.castle_type || undefined;
}

type OsmEl = { type: string; id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Tags };

async function overpassOne(query: string): Promise<OsmEl[]> {
  for (const url of OVERPASS) {
    for (let i = 0; i < 3; i++) {
      try {
        const res = await fetch(url, { method: "POST", headers: UA, body: new URLSearchParams({ data: query }), signal: AbortSignal.timeout(330_000) });
        if (res.ok) {
          const j = await res.json();
          if (Array.isArray(j.elements) && j.elements.length > 500) return j.elements; // Plausibilität: Teilantwort nie übernehmen
        }
      } catch {
        /* nächster Versuch */
      }
      await new Promise((r) => setTimeout(r, 30_000 * (i + 1)));
    }
  }
  throw new Error("Overpass nicht erreichbar");
}

/** Alle Teilabfragen – nur wenn jede vollständig kam (sonst würden Orte fälschlich als «fehlt» markiert). */
async function overpass(): Promise<OsmEl[]> {
  const all = new Map<string, OsmEl>();
  for (const q of QUERIES) for (const e of await overpassOne(q)) all.set(`${e.type}${e.id}`, e);
  return [...all.values()];
}

async function cantonOf(lat: number, lng: number): Promise<string | null> {
  const u = `https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometry=${lng},${lat}&geometryType=esriGeometryPoint&layers=all:ch.swisstopo.swissboundaries3d-kanton-flaeche.fill&sr=4326&tolerance=0&returnGeometry=false&imageDisplay=1,1,1&mapExtent=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}`;
  try {
    const j = (await (await fetch(u, { headers: UA })).json()) as { results?: { attributes?: { ak?: string } }[] };
    return j.results?.[0]?.attributes?.ak ?? null;
  } catch {
    return null;
  }
}

/** Kurztext + Foto für neue Orte mit Wikidata-Verweis (wenige pro Nacht). */
async function wikiFor(qid: string): Promise<Pick<RubrikItem, "text" | "desc" | "wiki" | "img">> {
  try {
    const wd = await (await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks|claims|descriptions&languages=de&sitefilter=dewiki&ids=${qid}`, { headers: UA })).json();
    const e = wd.entities?.[qid];
    const title: string | undefined = e?.sitelinks?.dewiki?.title;
    const file: string | undefined = e?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
    const out: Pick<RubrikItem, "text" | "desc" | "wiki" | "img"> = {};
    if (e?.descriptions?.de?.value) out.desc = e.descriptions.de.value;
    if (title) {
      const wp = await (await fetch(`https://de.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=extracts&exintro=1&explaintext=1&exsentences=2&titles=${encodeURIComponent(title)}`, { headers: UA })).json();
      const page = Object.values(wp.query?.pages ?? {})[0] as { title?: string; extract?: string } | undefined;
      if (page?.extract) out.text = page.extract.replace(/\s*\([^()]*\)/g, "").replace(/\s+/g, " ").trim().slice(0, 320);
      out.wiki = `https://de.wikipedia.org/wiki/${encodeURIComponent((page?.title ?? title).replace(/ /g, "_"))}`;
    }
    if (file && !/\.(svg|tif|tiff|pdf)$/i.test(file)) {
      const c = await (await fetch(`https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=640&iiextmetadatafilter=Artist|LicenseShortName&titles=${encodeURIComponent(`File:${file}`)}`, { headers: UA })).json();
      const ii = (Object.values(c.query?.pages ?? {})[0] as { imageinfo?: { thumburl: string; thumbwidth: number; thumbheight: number; descriptionurl: string; extmetadata?: { Artist?: { value: string }; LicenseShortName?: { value: string } } }[] })?.imageinfo?.[0];
      if (ii) out.img = { src: ii.thumburl, w: ii.thumbwidth, h: ii.thumbheight, page: ii.descriptionurl, by: ii.extmetadata?.Artist?.value.replace(/<[^>]+>/g, "").trim().slice(0, 80) || undefined, lic: ii.extmetadata?.LicenseShortName?.value };
    }
    return out;
  } catch {
    return {};
  }
}

const r5 = (x: number) => Math.round(x * 1e5) / 1e5;

/** Dubletten-Regel wie scripts/build-rubriken.mjs: gleiche Rubrik, < 400 m (Linien < 3 km), Name gleich oder enthalten. */
const normName = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
type Pos = { r: string; name: string; lat: number; lng: number };
const kmOf = (a: Pos, b: Pos) => Math.hypot((a.lat - b.lat) * 111.2, (a.lng - b.lng) * 111.2 * Math.cos((a.lat * Math.PI) / 180));
export function isSameSpot(a: Pos, b: Pos) {
  if (a.r !== b.r || kmOf(a, b) >= (LINE_RUBRIKEN.has(a.r) ? 3 : 0.4)) return false;
  const x = normName(a.name), y = normName(b.name);
  return !!x && !!y && (x === y || x.includes(y) || y.includes(x));
}

/** Später angelegte Dubletten (ohne Korrekturen) entfernen – der zuerst angelegte Eintrag bleibt. */
function removeDuplicateRows(d: ReturnType<typeof getDb>) {
  const rows = d.prepare("SELECT id, daten FROM ort WHERE bestand = 'verzeichnis' AND id NOT IN (SELECT ort_id FROM korrektur) ORDER BY erstellt, rowid").all() as { id: string; daten: string }[];
  const kept: Pos[] = [];
  const del = d.prepare("DELETE FROM ort WHERE id = ?");
  let n = 0;
  for (const r of rows) {
    const p = JSON.parse(r.daten) as Pos;
    if (kept.some((k) => isSameSpot(k, p))) { del.run(r.id); n++; } else kept.push(p);
  }
  return n;
}

export async function syncVerzeichnis() {
  const d = getDb();
  const started = new Date().toISOString();
  const els = await overpass();
  const existing = new Map((d.prepare("SELECT id, daten FROM ort WHERE bestand = 'verzeichnis'").all() as { id: string; daten: string }[]).map((r) => [r.id, JSON.parse(r.daten) as RubrikItem]));
  const seen = new Set<string>();
  const rows: UpsertRow[] = [];
  const known: Pos[] = [...existing.values()];
  let neu = 0, geaendert = 0, doppelt = 0;
  for (const e of els) {
    const t = e.tags ?? {};
    const r = rubrikOf(t, e.type);
    const lat = e.lat ?? e.center?.lat, lng = e.lon ?? e.center?.lon;
    let name = cleanName(t["name:de"] || t.name || "");
    if (r === "velorouten") name = veloName(t, name);
    if (!r || lat == null || lng == null || !name || t.disused || t["disused:tourism"] || t.abandoned) continue;
    const id = `osm:${e.type[0]}${e.id}`;
    const old = existing.get(id);
    seen.add(id);
    const web = (t.website || t["contact:website"] || t.url || "").split(";")[0].trim() || undefined;
    const patch = {
      name,
      web: web ? (web.startsWith("http") ? web : `https://${web}`) : old?.web,
      hours: t.opening_hours || undefined,
      fee: t.fee === "no" ? false : t.fee === "yes" ? true : undefined,
      wheel: t.wheelchair === "yes" ? true : t.wheelchair === "no" ? false : undefined,
    };
    if (old) {
      const next = { ...old, ...Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)), r, lat: r5(lat), lng: r5(lng) };
      if (JSON.stringify(next) === JSON.stringify(old)) continue;
      geaendert++;
      rows.push({ id, art: r, bestand: "verzeichnis", name, lat: next.lat, lng: next.lng, kanton: next.kt, ort: next.ort, web: next.web, daten: next, quelle: "osm", quelle_ref: next.id, stand: started });
    } else {
      // Dublette eines bestehenden Eintrags (z. B. Punkt + Fläche)? Dann nicht neu anlegen.
      if (known.some((k) => isSameSpot(k, { r, name, lat, lng }))) { doppelt++; continue; }
      const kt = await cantonOf(lat, lng);
      if (!kt) continue; // ausserhalb der Schweiz
      const wiki = t.wikidata && /^Q\d+$/.test(t.wikidata) ? await wikiFor(t.wikidata) : {};
      const item: RubrikItem = {
        r, id: `${e.type[0]}${e.id}`, name, lat: r5(lat), lng: r5(lng), kt,
        ...(t["addr:city"] ? { ort: t["addr:city"] } : {}),
        ...Object.fromEntries(Object.entries(patch).filter(([k, v]) => k !== "name" && v !== undefined)),
        ...(Number.parseFloat(t.height ?? "") ? { height: Number.parseFloat(t.height!) } : {}),
        ...(subOf(r, t) ? { sub: subOf(r, t) } : {}),
        ...(r === "velorouten" ? { desc: veloDesc(t) } : {}),
        ...wiki,
        q: (wiki.text ? 4 : 0) + (wiki.img ? 3 : 0) + (patch.web ? 2 : 0) + (patch.hours ? 1 : 0) + (t.wikidata ? 1 : 0),
      };
      neu++;
      known.push(item);
      rows.push({ id, art: r, bestand: "verzeichnis", name, lat: item.lat, lng: item.lng, kanton: kt, ort: item.ort, web: item.web, daten: item, quelle: "osm", quelle_ref: item.id, stand: started });
    }
  }
  d.exec("BEGIN IMMEDIATE");
  try {
    upsert(rows, d);
    const weg = removeDuplicateRows(d);
    const miss = markMissing("verzeichnis", seen, "osm", d);
    const links = linkDuplicates(d);
    d.prepare("INSERT INTO meta(k, v) VALUES('sync_verzeichnis', ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").run(started);
    const msg = `OSM-Abgleich: ${els.length} Objekte geladen, ${neu} neu, ${doppelt} als Dublette übersprungen, ${weg} Dubletten entfernt, ${geaendert} geändert,${miss.marked} fehlen neu, ${miss.gone} nach 14 Tagen ausgeblendet, ${links} Dubletten-Verknüpfungen geändert`;
    log("abgleich", msg, d);
    bump(d);
    d.exec("COMMIT");
    return msg;
  } catch (e) {
    d.exec("ROLLBACK");
    throw e;
  }
}

let running: Promise<string> | null = null;
/** Abgleich starten (läuft höchstens einmal gleichzeitig). */
export function runSync() {
  running ??= syncVerzeichnis()
    .catch((e) => {
      const msg = `Abgleich fehlgeschlagen: ${e instanceof Error ? e.message : String(e)}`;
      try { log("fehler", msg); } catch { /* DB nicht erreichbar */ }
      return msg;
    })
    .finally(() => { running = null; });
  return running;
}
