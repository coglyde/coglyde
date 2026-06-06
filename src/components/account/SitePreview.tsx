"use client";

import { useEffect, useRef, useState } from "react";

// A live, non-interactive thumbnail of the client's site: render the real site
// at a desktop width in an iframe, then scale it down to fill the container. A
// ResizeObserver keeps the scale correct as the container resizes.
// (Requires the site to allow framing, which client sites we build do.)

const BASE_W = 1280;
const BASE_H = 800; // 16:10, matches the container aspect so the scale fills it.

export function SitePreview({ url, name }: { url: string; name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(BASE_H / BASE_W); // sane default before measure

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      if (width) setScale(width / BASE_W);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative aspect-[16/10] overflow-hidden bg-black">
      <div
        className="pointer-events-none absolute left-0 top-0 origin-top-left"
        style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}
      >
        <iframe
          src={url}
          title={name}
          width={BASE_W}
          height={BASE_H}
          loading="lazy"
          className="border-0"
        />
      </div>
    </div>
  );
}
