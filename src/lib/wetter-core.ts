/** WMO-Wettercodes → kurzes Wort + Symbol-Art (für Client und Server). */
export type WeatherKind = "sonne" | "wolken" | "nebel" | "regen" | "schnee" | "gewitter";

export function weatherKind(code: number): WeatherKind {
  if (code <= 1) return "sonne";
  if (code <= 3) return "wolken";
  if (code <= 48) return "nebel";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "schnee";
  if (code >= 95) return "gewitter";
  return "regen";
}

export const WEATHER_LABEL: Record<WeatherKind, string> = {
  sonne: "sonnig",
  wolken: "bewölkt",
  nebel: "Nebel",
  regen: "Regen",
  schnee: "Schnee",
  gewitter: "Gewitter",
};

export interface DayWeatherLite {
  date: string;
  code: number;
  tmax: number;
  tmin: number;
  rainProb: number;
  rainMm: number;
  hourly?: number[];
  hourlyTemp?: number[];
  hourlyCode?: number[];
  sunset?: string;
}

export const rainyDay = (w: Pick<DayWeatherLite, "rainProb" | "rainMm">) => w.rainProb >= 60 && w.rainMm >= 2;
