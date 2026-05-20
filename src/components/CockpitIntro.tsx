"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef } from "react";

type CockpitIntroProps = {
  children: ReactNode;
};

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const lerp = (
  p: number,
  startP: number,
  endP: number,
  startV: number,
  endV: number,
) => {
  const t = clamp((p - startP) / (endP - startP), 0, 1);
  return startV + t * (endV - startV);
};

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
      const p = clamp(-rect.top / scrollDistance, 0, 1);

      const shipScale = lerp(p, 0, 0.3, 1, 11);
      const shipOpacity = lerp(p, 0.22, 0.35, 1, 0);
      const shipY = lerp(p, 0, 0.18, 0, -6);
      ship.style.transform = `translateY(${shipY}%) scale(${shipScale})`;
      ship.style.opacity = String(shipOpacity);

      const heroScale = lerp(p, 0.25, 0.35, 0.04, 1);
      const heroOpacity = lerp(p, 0.27, 0.35, 0, 1);
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
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[170vh]"
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
            transformOrigin: "50% 55%",
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
            className="object-cover"
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
              transform: "scale(0.04)",
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
