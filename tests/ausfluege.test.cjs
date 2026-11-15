const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const root = path.join(__dirname, '..');
const dir = path.join(root, 'src/data/ausfluege');
const bundles = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
const places = bundles.flatMap((b) => b.places);
const trips = bundles.flatMap((b) => b.trips);
const ids = new Map(places.map((p) => [p.id, p]));
const tourSlugs = new Set(
  fs.readdirSync(path.join(root, 'src/data/tours')).flatMap((f) => [...fs.readFileSync(path.join(root, 'src/data/tours', f), 'utf8').matchAll(/^\s{2}slug: "([^"]+)"/gm)].map((m) => m[1])),
);
const KINDS = ['hotel', 'restaurant', 'cafe', 'bar', 'aktivitaet', 'sehenswuerdigkeit', 'aussicht', 'bad'];

function load(file) {
  const out = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', out)((n) => require(n), module, module.exports);
  return module.exports;
}

test('Orte: eindeutig, vollständig, mit Quelle', () => {
  assert.equal(ids.size, places.length, 'doppelte Orts-IDs');
  for (const p of places) {
    assert.ok(KINDS.includes(p.kind), `${p.id}: Art ${p.kind}`);
    assert.ok(p.name && p.region && p.town && p.text, `${p.id}: Pflichtfeld fehlt`);
    if (p.url) assert.match(p.url, /^https?:\/\//, `${p.id}: url`);
    assert.ok(p.source, `${p.id}: keine Quelle`);
    if (p.coords) assert.ok(p.coords.lat > 45.7 && p.coords.lat < 47.9 && p.coords.lng > 5.9 && p.coords.lng < 10.6, `${p.id}: Koordinaten ausserhalb der Schweiz`);
    if (p.priceInfo) {
      const { from, to, unit } = p.priceInfo;
      assert.ok(typeof from === 'number' && from >= 0 && from < 2000, `${p.id}: Preis ${from}`);
      if (to != null) assert.ok(to >= from, `${p.id}: Preisspanne ${from}–${to}`);
      assert.ok(unit, `${p.id}: Preis ohne Einheit`);
    }
    if (p.image) {
      assert.match(p.image.source, /^https:\/\/upload\.wikimedia\.org\//, `${p.id}: Bild nicht von Commons`);
      assert.match(p.image.credit, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, `${p.id}: Bildnachweis`);
      assert.ok(p.image.alt, `${p.id}: Bild ohne alt`);
    }
  }
});

test('Budget: nur belegte Preise, Hotel geteilt, Lücken genannt', () => {
  const { tripBudget, priceText } = load('src/lib/ausfluege-core.ts');
  const pl = {
    a: { id: 'a', kind: 'aktivitaet', name: 'Bahn', priceInfo: { from: 40, unit: 'Retourbillett Erwachsene' } },
    r: { id: 'r', kind: 'restaurant', name: 'Beiz', priceInfo: { from: 25, to: 45, unit: 'Hauptgang' } },
    m: { id: 'm', kind: 'restaurant', name: 'Ohne Preis' },
    h: { id: 'h', kind: 'hotel', name: 'Hotel', priceInfo: { from: 200, unit: 'Doppelzimmer pro Nacht' } },
  };
  const days = [{ title: '1', slots: [{ time: '10:00', placeId: 'a' }, { time: '12:00', placeId: 'r' }, { time: '19:00', placeId: 'm' }] }, { title: '2', slots: [{ time: '10:00', placeId: 'a' }] }];
  const b = tripBudget(days, pl, pl.h);
  assert.equal(b.low, 200); // 40 + 25 + 100 (halbes DZ) + 40 → abgerundet
  assert.equal(b.high, 230);
  assert.deepEqual(b.missing, ['Ohne Preis']);
  assert.equal(priceText({ from: 0, unit: 'gratis' }), 'gratis');
  assert.equal(priceText({ from: 190, unit: 'Doppelzimmer pro Nacht' }), 'ab CHF 190 · Doppelzimmer pro Nacht');
});

test('Programme verweisen nur auf vorhandene Orte und Touren, Zeiten aufsteigend', () => {
  assert.ok(trips.length > 0);
  assert.equal(new Set(trips.map((t) => t.slug)).size, trips.length, 'doppelte Programm-Slugs');
  for (const t of trips) {
    assert.equal(t.dayPlans.length, t.days, `${t.slug}: Anzahl Tage`);
    for (const h of t.hotelIds ?? []) assert.equal(ids.get(h)?.kind, 'hotel', `${t.slug}: Hotel ${h}`);
    for (const d of t.dayPlans) {
      let last = '00:00';
      for (const s of d.slots) {
        assert.match(s.time, /^\d{2}:\d{2}$/, `${t.slug}: Zeit ${s.time}`);
        assert.ok(s.time >= last, `${t.slug}: Zeit ${s.time} nach ${last}`);
        last = s.time;
        if (s.placeId) assert.ok(ids.has(s.placeId), `${t.slug}: Ort ${s.placeId} fehlt`);
        if (s.rain?.placeId) assert.ok(ids.has(s.rain.placeId), `${t.slug}: Regen-Ort ${s.rain.placeId} fehlt`);
        if (s.tourSlug) assert.ok(tourSlugs.has(s.tourSlug), `${t.slug}: Tour ${s.tourSlug} fehlt`);
      }
    }
  }
});

test('Kein Ort doppelt im Programm – weder bei Sonne noch bei Regen', () => {
  for (const t of trips) {
    for (const rain of [false, true]) {
      // direkt aufeinanderfolgend am selben Ort (z. B. «länger im Vivarium») ist erlaubt
      const used = t.dayPlans.flatMap((d) => d.slots).map((s) => (rain && s.rain ? s.rain.placeId : s.placeId)).filter((id, i, a) => id && id !== a[i - 1]);
      const dup = used.filter((id, i) => used.indexOf(id) !== i && ids.get(id)?.kind !== 'hotel');
      assert.deepEqual(dup, [], `${t.slug}${rain ? ' (Regen)' : ''}: doppelt ${dup.join(', ')}`);
    }
  }
});

test('Planer nutzt nur geprüfte Orte und meidet bei Regen Draussen-Programm', () => {
  const { composePlan } = load('src/lib/compose.ts');
  const tours = [...tourSlugs].map((slug) => ({ slug, name: slug, citySlug: '', durationMinutes: 120 }));
  for (const region of new Set(places.map((p) => p.region))) {
    for (const rain of [false, true]) {
      const plan = composePlan({ region, days: 2, audience: 'paar', moods: ['genuss', 'natur'], rain, budget: 2 }, places, tours);
      const used = plan.days.flatMap((d) => d.slots).map((s) => s.placeId).filter(Boolean);
      assert.ok(used.length >= 3, `${region}: zu wenig Programm`);
      assert.equal(new Set(used).size, used.length, `${region}: Ort doppelt`);
      for (const id of used) {
        const p = ids.get(id);
        assert.equal(p.region, region);
        if (rain && ['aktivitaet', 'aussicht', 'bad', 'sehenswuerdigkeit'].includes(p.kind)) assert.ok(p.weatherProof, `${region}: ${id} bei Regen draussen`);
      }
    }
  }
});
