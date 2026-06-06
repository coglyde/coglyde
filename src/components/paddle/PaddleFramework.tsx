"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PaddleCard } from "./PaddleCard";
import { PADDLE_STEPS } from "./paddle-data";

export function PaddleFramework() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft >= track.scrollWidth - track.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      track.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section className="relative z-10 px-6 pt-24 pb-24 sm:px-10 sm:pt-28 sm:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <h2 className="text-balance text-[2.2rem] font-medium leading-[1.08] tracking-tight text-white sm:text-[2.8rem]">
            Framework for sustained growth
          </h2>
          <p className="text-pretty text-[0.95rem] leading-relaxed text-white/55 sm:text-base">
            Our P.A.D.D.L.E. framework is a structured process that removes
            guesswork, fosters collaboration, and drives measurable growth. By
            following these six steps, we make every initiative both efficient
            and impactful.
          </p>
        </div>
      </div>

      {/* Full-bleed track so cards can scroll past the container edge. */}
      <div
        ref={trackRef}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 sm:px-10"
        style={{
          scrollPaddingLeft: "1.5rem",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
          paddingLeft: "max(1.5rem, calc(50vw - 38rem))",
          paddingRight: "max(1.5rem, calc(50vw - 38rem))",
        }}
      >
        {PADDLE_STEPS.map((step, index) => (
          <div
            key={`${step.title}-${index}`}
            className="h-[30rem] w-[80vw] shrink-0 sm:h-[34rem] sm:w-[19.5rem] lg:w-[20rem]"
          >
            <PaddleCard step={step} />
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl items-center gap-3 px-6 sm:px-10">
        <ArrowButton direction="prev" disabled={atStart} onClick={() => scrollByCard(-1)} />
        <ArrowButton direction="next" disabled={atEnd} onClick={() => scrollByCard(1)} />
      </div>
    </section>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous steps" : "Next steps"}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition-[transform,background-color,border-color,opacity] duration-200 hover:-translate-y-px hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path
          d={direction === "prev" ? "M14 7l-5 5 5 5" : "M10 7l5 5-5 5"}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
