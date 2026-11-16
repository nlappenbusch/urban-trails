"use client";
/** Merkliste im Browser (localStorage) – ohne Konto, bleibt auf dem Gerät. */
import { useEffect, useState } from "react";

export interface Merk {
  id: string;
  r: string;
  name: string;
  ort?: string;
  kt: string;
  lat: number;
  lng: number;
  web?: string;
  /** Link zur Seite mit dem Eintrag */
  href: string;
  t: number;
}

const KEY = "ut-merkliste";
const EVT = "ut-merkliste";

export function loadMerk(): Merk[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function save(list: Merk[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* privater Modus: dann eben nur für diese Seite */
  }
  window.dispatchEvent(new Event(EVT));
}
export const merkKey = (r: string, id: string) => `${r}:${id}`;
export function toggleMerk(m: Omit<Merk, "t">) {
  const list = loadMerk();
  const k = merkKey(m.r, m.id);
  save(list.some((x) => merkKey(x.r, x.id) === k) ? list.filter((x) => merkKey(x.r, x.id) !== k) : [...list, { ...m, t: Date.now() }]);
}
export function removeMerk(r: string, id: string) {
  save(loadMerk().filter((x) => merkKey(x.r, x.id) !== merkKey(r, id)));
}
export function clearMerk() {
  save([]);
}

/** Aktuelle Merkliste, aktualisiert sich bei Änderungen (auch aus anderen Tabs). */
export function useMerkliste() {
  const [list, setList] = useState<Merk[]>([]);
  useEffect(() => {
    const up = () => setList(loadMerk());
    up();
    window.addEventListener(EVT, up);
    window.addEventListener("storage", up);
    return () => {
      window.removeEventListener(EVT, up);
      window.removeEventListener("storage", up);
    };
  }, []);
  return list;
}
