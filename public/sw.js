/* Only explicitly completed tour downloads are available offline. No map tiles or APIs are bulk-cached. */
const READY = "/__ut_offline_ready__";
self.addEventListener("install", event => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || request.headers.has("RSC")) return;
  if (!(url.pathname === "/unterwegs" || url.pathname.startsWith("/unterwegs/") || url.pathname.startsWith("/_next/static/") || url.pathname === "/api/audio" || url.pathname === "/frankenthal" || url.pathname.startsWith("/audio/frankenthal/"))) return;
  event.respondWith((async () => {
    const names = (await caches.keys()).filter(n => n.startsWith("ut-tour-")).reverse();
    let cached;
    for (const name of names) {
      const cache = await caches.open(name);
      if (!await cache.match(READY)) continue;
      cached = await cache.match(request.url);
      if (cached) break;
    }
    if (url.pathname === "/frankenthal" || url.pathname === "/unterwegs" || url.pathname.startsWith("/unterwegs/")) {
      try { return await fetch(request); } catch { return cached || new Response("Diese Tour wurde noch nicht offline gespeichert.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }); }
    }
    if (!cached) return fetch(request);
    const range = request.headers.get("Range");
    if (range && (url.pathname === "/api/audio" || url.pathname.startsWith("/audio/frankenthal/"))) {
      const bytes = await cached.arrayBuffer(), m = /^bytes=(\d*)-(\d*)$/.exec(range);
      const invalid = () => new Response(null, { status: 416, headers: { "Content-Range": `bytes */${bytes.byteLength}` } });
      if (!m || (!m[1] && !m[2])) return invalid();
      const start = m[1] ? Number(m[1]) : Math.max(0, bytes.byteLength-Number(m[2]));
      const end = m[1] && m[2] ? Math.min(Number(m[2]), bytes.byteLength-1) : bytes.byteLength-1;
      if (start > end || start >= bytes.byteLength) return invalid();
      return new Response(bytes.slice(start,end+1), { status: 206, headers: { "Content-Type": "audio/mpeg", "Accept-Ranges": "bytes", "Content-Range": `bytes ${start}-${end}/${bytes.byteLength}`, "Content-Length": String(end-start+1) } });
    }
    return cached;
  })());
});

