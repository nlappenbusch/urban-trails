import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Urban Trails", short_name: "Urban Trails", start_url: "/unterwegs", display: "standalone", background_color: "#faf8f2", theme_color: "#ff5500", lang: "de", icons: [{ src: "/app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }] };
}
