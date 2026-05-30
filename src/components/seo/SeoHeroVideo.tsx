"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const VIDEO_URL =
  "https://coglyde-website.s3.us-east-2.amazonaws.com/coglyde-seo-services-hero-video.mov";

// Hero video that grows from slightly small to full size as it scrolls into the
// center of the viewport, then holds — a subtle scroll-scale flourish.
export function SeoHeroVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <section className="relative z-10 px-6 pb-20 sm:px-10 sm:pb-28">
      <motion.div
        ref={ref}
        style={{ scale }}
        className="relative mx-auto aspect-video w-full max-w-7xl overflow-hidden rounded-[1.75rem] border border-white/10 shadow-[0_40px_120px_-40px_rgba(99,102,241,0.45)]"
      >
        <video
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      </motion.div>
    </section>
  );
}
