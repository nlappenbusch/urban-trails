/** Sonnen-Rangliste der Skigebiete – nur serverseitig. */
import { memo } from "@/lib/api-utils";
import { skiAreas } from "@/lib/ski";
import { aspectShare, bestRuns, sunDay, type SunRun } from "@/lib/sonne-core";

export interface SunRank {
  id: string;
  name: string;
  canton: string;
  km: number;
  /** mittlere Sonnenstunden je Pistenmeter zwischen 8.30 und 16.30 Uhr */
  hours: number;
  south: number;
  north: number;
  peak: { hm: string; share: number };
  pm: string[];
}

export const sunRuns = (id: string): Promise<SunRun[]> =>
  import(`@/data/sonne/${id}.json`).then((m) => (m.default as { runs: SunRun[] }).runs).catch(() => []);

const cache = memo<SunRank[]>(12 * 60 * 60_000);

export function sunRanking(iso: string): Promise<SunRank[]> {
  return cache(iso, async () => {
    const out: SunRank[] = [];
    for (const a of skiAreas) {
      const runs = await sunRuns(a.id);
      const km = runs.reduce((s, r) => s + r.km, 0);
      if (km < 3) continue;
      const day = sunDay(runs, iso, a.coords);
      const rose = aspectShare(runs);
      const t = rose.reduce((s, x) => s + x, 0) || 1;
      const peak = day.reduce((b, h) => (h.share > b.share ? h : b), day[0]);
      out.push({
        id: a.id,
        name: a.name,
        canton: a.canton,
        km: Math.round(km),
        hours: Math.round(day.reduce((s, h) => s + h.share * 0.5, 0) * 10) / 10,
        south: Math.round(((rose[3] + rose[4] + rose[5]) / t) * 100),
        north: Math.round(((rose[7] + rose[0] + rose[1]) / t) * 100),
        peak: { hm: peak.hm, share: Math.round(peak.share * 100) },
        pm: bestRuns(runs, day, "13:30", "16:00", 3).map((x) => x.name),
      });
    }
    return out.sort((a, b) => b.hours - a.hours);
  });
}
