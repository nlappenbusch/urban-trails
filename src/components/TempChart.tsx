/** Temperaturverlauf als schlichte Linie (serverseitig, ohne Bibliothek). Prognose gestrichelt. */
export default function TempChart({ points, label }: { points: { t: string; v: number }[]; label: string }) {
  if (points.length < 3) return null;
  const W = 720, H = 220, L = 36, R = 12, T = 14, B = 28;
  const now = Date.now();
  const xs = points.map((p) => Date.parse(p.t));
  const x0 = xs[0], x1 = xs[xs.length - 1];
  const vs = points.map((p) => p.v);
  let lo = Math.floor(Math.min(...vs) - 0.5), hi = Math.ceil(Math.max(...vs) + 0.5);
  if (hi - lo < 3) (lo -= 1), (hi += 1);
  const X = (t: number) => L + ((t - x0) / (x1 - x0 || 1)) * (W - L - R);
  const Y = (v: number) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  const path = (pts: { t: string; v: number }[]) => pts.map((p, i) => `${i ? "L" : "M"}${X(Date.parse(p.t)).toFixed(1)},${Y(p.v).toFixed(1)}`).join("");
  const past = points.filter((p) => Date.parse(p.t) <= now);
  const future = points.filter((p) => Date.parse(p.t) >= now);
  if (past.length && future.length) future.unshift(past[past.length - 1]);
  const ticks = Array.from({ length: 4 }, (_, i) => lo + ((hi - lo) * i) / 3);
  const days: number[] = [];
  const d = new Date(x0);
  d.setHours(24, 0, 0, 0);
  for (let t = d.getTime(); t < x1; t += 86400_000) days.push(t);
  const nowX = now > x0 && now < x1 ? X(now) : undefined;
  const fmt = (v: number) => v.toLocaleString("de-CH", { maximumFractionDigits: 1 });
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={label}>
        {ticks.map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={Y(v)} y2={Y(v)} stroke="currentColor" className="text-cream/10" />
            <text x={L - 6} y={Y(v) + 4} textAnchor="end" className="fill-cream-faint text-[11px]">{fmt(v)}°</text>
          </g>
        ))}
        {days.map((t) => (
          <text key={t} x={X(t) + 4} y={H - 8} className="fill-cream-faint text-[11px]">
            {new Date(t).toLocaleDateString("de-CH", { weekday: "short", timeZone: "Europe/Zurich" })}
          </text>
        ))}
        {days.map((t) => <line key={`l${t}`} x1={X(t)} x2={X(t)} y1={T} y2={H - B} stroke="currentColor" className="text-cream/5" />)}
        {past.length > 1 && <path d={path(past)} fill="none" stroke="#0284c7" strokeWidth={2.5} strokeLinejoin="round" />}
        {future.length > 1 && <path d={path(future)} fill="none" stroke="#0284c7" strokeWidth={2.5} strokeDasharray="5 5" strokeLinejoin="round" />}
        {nowX !== undefined && (
          <g>
            <line x1={nowX} x2={nowX} y1={T} y2={H - B} stroke="currentColor" className="text-signal-500" strokeWidth={1.5} />
            <text x={nowX + 4} y={T + 10} className="fill-signal-600 text-[11px] font-bold">jetzt</text>
          </g>
        )}
      </svg>
      <figcaption className="mt-1 text-xs text-cream-faint">{label}{future.length > 1 ? " · gestrichelt: Prognose" : ""}</figcaption>
    </figure>
  );
}
