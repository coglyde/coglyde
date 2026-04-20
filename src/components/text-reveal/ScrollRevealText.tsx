"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { ScrollRevealWord } from "./ScrollRevealWord";

type ScrollRevealTextProps = {
  text: string;
  className?: string;
};

export function ScrollRevealText({ text, className }: ScrollRevealTextProps) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "start 20%"],
  });

  const words = text.split(/\s+/);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <ScrollRevealWord
            word={word}
            index={i}
            total={words.length}
            progress={scrollYProgress}
          />{" "}
        </span>
      ))}
    </p>
  );
}
