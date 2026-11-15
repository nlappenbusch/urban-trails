/**
 * Link zu Booking.com mit Ort, Datum, Personen und Preisspanne pro Nacht (CHF).
 * Ohne Partnerzugang können wir die Verfügbarkeit nicht selbst abfragen – Booking zeigt sie mit diesen Filtern sofort.
 */
export function bookingLink(o: { ss: string; checkin?: string; checkout?: string; adults?: number; min?: number; max?: number }) {
  const q = new URLSearchParams({ ss: o.ss, group_adults: String(o.adults ?? 2), no_rooms: "1", group_children: "0", selected_currency: "CHF" });
  if (o.checkin && o.checkout) {
    q.set("checkin", o.checkin);
    q.set("checkout", o.checkout);
  }
  if (o.min !== undefined || o.max !== undefined) q.set("nflt", `price=CHF-${o.min ?? 0}-${o.max ?? "max"}-1`);
  const aid = process.env.NEXT_PUBLIC_BOOKING_AID;
  if (aid) q.set("aid", aid);
  return `https://www.booking.com/searchresults.de.html?${q.toString()}`;
}
