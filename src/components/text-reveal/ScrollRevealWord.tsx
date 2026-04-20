"use client";

import { motion, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

type ScrollRevealWordProps = {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

export function ScrollRevealWord({
  word,
  index,
  total,
  progress,
}: ScrollRevealWordProps) {
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const y = useTransform(progress, [start, end], [8, 0]);

  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {word}
    </motion.span>
  );
}
