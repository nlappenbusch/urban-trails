import { Cloud, CloudFog, CloudLightning, CloudRain, Snowflake, Sun } from "lucide-react";
import { WEATHER_LABEL, weatherKind } from "@/lib/wetter-core";

const ICON = { sonne: Sun, wolken: Cloud, nebel: CloudFog, regen: CloudRain, schnee: Snowflake, gewitter: CloudLightning };

export default function WeatherIcon({ code, size = 18, className = "" }: { code: number; size?: number; className?: string }) {
  const k = weatherKind(code);
  const Icon = ICON[k];
  return <Icon size={size} className={className} aria-label={WEATHER_LABEL[k]} role="img" />;
}
