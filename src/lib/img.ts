import type { StopImage } from "@/lib/types";

/** srcset/sizes/Masse für ein <img> (src selbst setzen); `sizes` = angezeigte Breite. */
export function imgAttrs(img: StopImage, sizes = "(min-width: 768px) 800px, 100vw") {
  return { srcSet: `${img.small} 480w, ${img.url} ${img.width}w`, sizes, width: img.width, height: img.height, alt: img.alt };
}
