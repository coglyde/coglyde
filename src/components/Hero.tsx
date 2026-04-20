"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Header } from "./Header";
import { StarfieldBackground } from "./StarfieldBackground";
import { ScrollIndicator } from "./ScrollIndicator";
import { ShinyButton } from "./ui/ShinyButton";

const PORTHOLE_Y = 59;
const SHIP_SCALE_END = 7.5;

export function Hero() {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end start"],
  });

  const shipScale = useTransform(
    scrollYProgress,
    [0, 0.4],
    [1, SHIP_SCALE_END],
  );
  const shipY = useTransform(
    scrollYProgress,
    [0, 0.4],
    ["0vh", `${50 - PORTHOLE_Y}vh`],
  );
  const shipOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.55],
    [1, 1, 0],
  );

  // Entire hero (logo + text) scales together like a distant star growing closer.
  const heroScale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.3, 0.45, 1],
    [0.005, 0.012, 0.04, 0.2, 1, 1],
  );
  const heroY = useTransform(
    scrollYProgress,
    [0, 0.45, 0.75, 0.95],
    [`${PORTHOLE_Y - 50}vh`, "0vh", "0vh", "-90vh"],
  );
  // Hero block stays visible the whole time, then warps away at the very end.
  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.78, 0.92],
    [1, 1, 0],
  );

  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  return (
    <>
      <StarfieldBackground />
      <Header />

      <div
        ref={sceneRef}
        aria-hidden
        className="relative z-0 h-[260vh] w-full"
      />

      <motion.div
        style={{
          scale: shipScale,
          y: shipY,
          opacity: shipOpacity,
          transformOrigin: `50% ${PORTHOLE_Y}%`,
        }}
        className="pointer-events-none fixed inset-0 z-10 overflow-hidden will-change-transform"
      >
        <Image
          src="/spaceship.png"
          alt="View from inside a spaceship cockpit"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <motion.section
        style={{ scale: heroScale, y: heroY, opacity: heroOpacity }}
        className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center px-6 text-center will-change-transform"
      >
        <div className="flex max-w-2xl flex-col items-center">
          <Image
            src="/images/coglyde-logo-gradient.png"
            alt="Coglyde"
            width={500}
            height={500}
            priority
            className="h-28 w-28 sm:h-32 sm:w-32"
          />
          <h1 className="mt-8 text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
            Glide over your competition
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base text-white/70 sm:text-lg">
            Coglyde is a Vancouver based website design and digital marketing
            agency, specializing in custom website design, SEO, and social
            media marketing.
          </p>
          <ShinyButton href="#strategy-call" className="pointer-events-auto mt-10">
            Book a strategy call
          </ShinyButton>
        </div>
      </motion.section>

      <motion.div
        style={{ opacity: indicatorOpacity }}
        className="pointer-events-none fixed inset-x-0 bottom-8 z-30"
      >
        <ScrollIndicator />
      </motion.div>
    </>
  );
}
