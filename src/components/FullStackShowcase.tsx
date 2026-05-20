"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInViewVideo } from "./useInViewVideo";

export function FullStackShowcase() {
  const videoRef = useInViewVideo<HTMLVideoElement>();
  const frameRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);

  return (
    <section className="relative z-10 px-6 pt-24 pb-24 sm:pt-32 sm:pb-32">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Full-stack custom solutions
          </h2>
          <p className="mt-3 text-base text-white/60 sm:text-lg">
            We are coders, designers, and builders at heart.
          </p>
        </header>

        <motion.div
          ref={frameRef}
          style={{ scale }}
          className="relative mt-14 origin-center"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full sm:-top-32 sm:-left-32 sm:h-[36rem] sm:w-[36rem]"
            style={{
              background:
                "radial-gradient(closest-side, rgba(150, 170, 235, 0.16), rgba(120, 130, 220, 0.06) 50%, transparent 78%)",
              filter: "blur(70px)",
            }}
          />

          <div className="relative rounded-[2rem] border border-white/12 bg-white/[0.05] p-1.5 shadow-[0_40px_80px_-30px_rgba(59,130,246,0.35),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl sm:p-2">
            <div className="relative overflow-hidden rounded-[1.6rem]">
              <video
                ref={videoRef}
                src="https://coglyde-website.s3.us-east-2.amazonaws.com/coglyde-fullstack-development.mp4"
                loop
                muted
                playsInline
                preload="metadata"
                className="block h-auto w-full"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_0%_0%,rgba(96,165,250,0.22),transparent_70%)] mix-blend-screen"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
