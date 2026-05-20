"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type ScrollRevealTextProps = {
  text: string;
  className?: string;
};

const GRADIENT = `linear-gradient(to bottom,
  rgba(0, 0, 0, 0) 0%,
  rgba(0, 0, 0, 0) 17%,
  rgba(186, 230, 253, 0.9) 20%,
  rgba(96, 165, 250, 1) 27%,
  rgba(99, 102, 241, 1) 35%,
  rgba(139, 92, 246, 1) 43%,
  rgba(217, 70, 239, 1) 50%,
  rgba(139, 92, 246, 1) 57%,
  rgba(99, 102, 241, 1) 65%,
  rgba(96, 165, 250, 1) 73%,
  rgba(186, 230, 253, 0.9) 80%,
  rgba(0, 0, 0, 0) 83%,
  rgba(0, 0, 0, 0) 100%
)`;

export function ScrollRevealText({ text, className }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const backgroundPositionY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "100%"],
  );

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-6">
          <motion.p
            className={className}
            style={{
              backgroundImage: GRADIENT,
              backgroundSize: "100% 600%",
              backgroundRepeat: "no-repeat",
              backgroundPositionY,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {text}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
