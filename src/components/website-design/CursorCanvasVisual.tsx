"use client";

// Multiplayer-style live cursor canvas — a stylized placeholder for the
// Collaborative Partnership card. Each cursor drifts on its own subtle path
// via CSS, and when the user hovers the canvas every cursor smoothly rotates
// to point at the mouse.

import { useEffect, useRef } from "react";

type Cursor = {
  name: string;
  // Percent position within the canvas
  x: number;
  y: number;
  tagBg: string;
  tagText: string;
  cursorColor: string;
  // Resting rotation when the mouse isn't hovering
  rotate: number;
};

const CURSORS: Cursor[] = [
  { name: "Joe", x: 38, y: 28, tagBg: "bg-fuchsia-500/90", tagText: "text-white", cursorColor: "text-fuchsia-400", rotate: -10 },
  { name: "Evil", x: 56, y: 22, tagBg: "bg-rose-500/90", tagText: "text-white", cursorColor: "text-rose-400", rotate: 12 },
  { name: "Genny", x: 26, y: 42, tagBg: "bg-sky-500/90", tagText: "text-white", cursorColor: "text-sky-400", rotate: -22 },
  { name: "Valerie", x: 70, y: 44, tagBg: "bg-emerald-500/90", tagText: "text-white", cursorColor: "text-emerald-400", rotate: 18 },
  { name: "Rauno", x: 78, y: 58, tagBg: "bg-blue-500/90", tagText: "text-white", cursorColor: "text-blue-400", rotate: -4 },
  { name: "Christopher", x: 22, y: 72, tagBg: "bg-pink-500/90", tagText: "text-white", cursorColor: "text-pink-400", rotate: 20 },
  { name: "Meg", x: 74, y: 78, tagBg: "bg-amber-500/90", tagText: "text-white", cursorColor: "text-amber-400", rotate: -8 },
  { name: "Sam", x: 50, y: 86, tagBg: "bg-violet-500/90", tagText: "text-white", cursorColor: "text-violet-400", rotate: 6 },
];

// CSS `transform: rotate()` pivots around the SVG box centre (12, 12). The
// arrow's tip is at (20, 12) — straight right of the pivot — so the natural
// pointing direction is 0°. Rotation transforms can therefore be applied
// directly as `atan2(my-cy, mx-cx)`.
const NATURAL_ANGLE_DEG = 0;

export function CursorCanvasVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const arrowRefs = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Imperatively update each arrow's rotation on mousemove — avoids a
    // setState (and React re-render) per pointer event.
    const applyRotation = (angleFor: (i: number) => number) => {
      CURSORS.forEach((_, i) => {
        const arrow = arrowRefs.current[i];
        if (arrow) arrow.style.transform = `rotate(${angleFor(i)}deg)`;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Use each arrow's live bounding rect so the angle is correct even
      // while the wrapper is mid-drift. The rect's centre is stable across
      // rotations because CSS rotates around the centre by default.
      CURSORS.forEach((_, i) => {
        const arrow = arrowRefs.current[i];
        if (!arrow) return;
        const r = arrow.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const angle =
          (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
        arrow.style.transform = `rotate(${angle - NATURAL_ANGLE_DEG}deg)`;
      });
    };

    const handleMouseLeave = () => {
      applyRotation((i) => CURSORS[i].rotate);
    };

    // Set initial rotations to the resting angles.
    handleMouseLeave();

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[#0a0a0c]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "44px 44px, 44px 44px",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_85%)]"
      />

      {CURSORS.map((c, i) => (
        <div
          key={c.name}
          className="absolute will-change-transform"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            // Per-cursor desync: each gets a slightly different speed and a
            // negative delay so they start at random points along the loop.
            animation: `cursor-drift ${7 + (i % 4) * 1.3}s ease-in-out ${-(i * 1.7)}s infinite`,
          }}
        >
          <svg
            ref={(el) => {
              arrowRefs.current[i] = el;
            }}
            viewBox="0 0 24 24"
            aria-hidden
            className={`h-7 w-7 drop-shadow-[0_3px_8px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-out ${c.cursorColor}`}
          >
            <path
              d="M5 3 L20 12 L12 13.5 L8.5 20 Z"
              fill="currentColor"
              stroke="rgba(0,0,0,0.55)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className={`absolute left-5 top-5 inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-medium leading-none shadow-[0_4px_12px_rgba(0,0,0,0.5)] ${c.tagBg} ${c.tagText}`}
          >
            {c.name}
          </span>
        </div>
      ))}
    </div>
  );
}
