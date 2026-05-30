"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef } from "react";

type CockpitIntroProps = {
  children: ReactNode;
};

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

// Linear 0..1 sub-progress of `p` within the window [start, end].
const range = (p: number, start: number, end: number) =>
  clamp((p - start) / (end - start), 0, 1);

// How far the ship zooms. Geometric scaling (below) makes this feel like a
// constant-velocity fly-through rather than a lurch.
const SHIP_MAX_SCALE = 9;
// Hero starts as a far-away point at the ship's vanishing center, then grows to 1.
const HERO_START_SCALE = 0.06;
// Fraction of the pinned scroll spent flying in. Once the fly-in finishes the
// hero holds, fully settled and centered, for the remaining scroll before the
// pin releases — so it lingers a beat instead of scrolling away immediately.
const SETTLE = 0.7;

export function CockpitIntro({ children }: CockpitIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const container = containerRef.current;
      const hero = heroRef.current;
      const ship = shipRef.current;
      if (!container || !hero || !ship) return;

      const rect = container.getBoundingClientRect();
      const scrollDistance = rect.height - window.innerHeight;
      if (scrollDistance <= 0) return;

      // p maps 1:1 to scroll position across the pinned region.
      const p = clamp(-rect.top / scrollDistance, 0, 1);
      // a is the fly-in progress: it reaches 1 at p = SETTLE, then stays at 1
      // so the hero holds, settled and centered, for the rest of the pin before
      // it scrolls away.
      const a = clamp(p / SETTLE, 0, 1);

      // Ship: geometric (exponential) scale so each scroll tick changes the
      // apparent zoom by the same ratio — the motion reads as a steady,
      // wheel-paced fly-through instead of a fast lurch.
      const shipScale = SHIP_MAX_SCALE ** range(a, 0, 0.82);
      const shipOpacity = 1 - range(a, 0.55, 0.78);
      ship.style.transform = `scale(${shipScale})`;
      ship.style.opacity = String(shipOpacity);

      // Hero: emerges from the vanishing point as the ship passes and lands
      // fully centered at p = SETTLE, then holds until the pin releases.
      const heroScale =
        HERO_START_SCALE * (1 / HERO_START_SCALE) ** range(a, 0.5, 1);
      const heroOpacity = range(a, 0.6, 0.92);
      hero.style.transform = `scale(${heroScale})`;
      hero.style.opacity = String(heroOpacity);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[240vh]"
      style={{ position: "relative", zIndex: 40, isolation: "isolate" }}
    >
      <div
        className="h-screen w-full overflow-hidden"
        style={{ position: "sticky", top: 0 }}
      >
        <div
          ref={shipRef}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 1,
            transformOrigin: "50% 50%",
            transform: "scale(1)",
            opacity: 1,
            willChange: "transform, opacity",
          }}
        >
          <Image
            src="/spaceship.png"
            alt=""
            fill
            priority
            sizes="100vw"
            // Vertically place the porthole at the viewport center so the
            // centered zoom flies straight into it (tune the 62% if it sits
            // slightly high/low).
            className="object-cover object-[50%_62%]"
          />
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 10 }}
        >
          <div
            ref={heroRef}
            className="flex max-w-[64rem] flex-col items-center px-6 text-center"
            style={{
              transform: `scale(${HERO_START_SCALE})`,
              opacity: 0,
              willChange: "transform, opacity",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
