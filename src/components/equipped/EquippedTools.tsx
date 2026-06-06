import type { ReactNode } from "react";
import { LogoColumn } from "./LogoColumn";

const COLUMNS: { names: string[]; direction: "up" | "down"; durationSec: number }[] = [
  { names: ["Blender", "Figma", "Webflow", "Claude"], direction: "down", durationSec: 30 },
  {
    names: ["Spline", "Shopify", "Adobe CC", "JavaScript", "Final Cut Pro"],
    direction: "up",
    durationSec: 28,
  },
  { names: ["Next.js", "React", "Illustrator", "LottieFiles"], direction: "down", durationSec: 34 },
];

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const FEATURES: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "CMS Platforms",
    body: "Expert in Webflow, Squarespace, Shopify, and WordPress, from static pages to complex integrations.",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 4v5" />
      </svg>
    ),
  },
  {
    title: "Graphic Design",
    body: "Tools like Blender, Spline, and LottieFiles let us craft stunning visuals, illustrations, and animations.",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.6" />
        <path d="m4 18 5-5 4 4 3-3 4 4" />
      </svg>
    ),
  },
  {
    title: "AI & Automation Tools",
    body: "We wire AI into the work that eats your day: chat, calls, content, and reporting that run themselves.",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <rect x="6" y="6" width="12" height="12" rx="3" />
        <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
      </svg>
    ),
  },
];

export function EquippedTools() {
  return (
    <section className="relative z-10 px-6 py-20 sm:px-10 sm:py-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/10">
        {/* Background: glass wash + violet/blue corner glows so the section
            reads as a contained panel instead of floating on pure black. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(70% 80% at 100% 0%, rgba(139, 92, 246, 0.18), transparent 60%),
              radial-gradient(60% 80% at 0% 100%, rgba(59, 130, 246, 0.16), transparent 58%),
              linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.01) 100%)
            `,
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        <div className="relative grid items-center gap-12 px-6 py-14 sm:px-12 sm:py-16 lg:grid-cols-2 lg:gap-16">
          {/* Logo columns: outer scroll down, middle scrolls up. */}
          <div
            className="relative h-[26rem] overflow-hidden sm:h-[30rem]"
            style={{
              maskImage:
                "linear-gradient(180deg, transparent, #000 14%, #000 86%, transparent)",
              WebkitMaskImage:
                "linear-gradient(180deg, transparent, #000 14%, #000 86%, transparent)",
            }}
          >
            <div className="absolute inset-0 flex justify-center gap-4 sm:gap-6">
              {COLUMNS.map((column, index) => (
                <div key={index} className={index === 1 ? "translate-y-10" : ""} aria-hidden>
                  <LogoColumn {...column} />
                </div>
              ))}
            </div>
          </div>

          {/* Copy + capabilities. */}
          <div className="lg:pl-4">
            <h2 className="text-[2rem] font-medium tracking-tight text-white sm:text-[2.4rem]">
              Equipped with all the right tools
            </h2>
            <p className="mt-3 text-[0.95rem] text-white/55 sm:text-base">
              We skate where the puck is going to be.
            </p>

            <div className="mt-10 flex flex-col">
              {FEATURES.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`flex gap-4 py-6 ${index > 0 ? "border-t border-white/10" : ""}`}
                >
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-violet-300">
                    <span className="block h-5 w-5">{feature.icon}</span>
                  </span>
                  <div>
                    <h3 className="text-[1.05rem] font-medium text-violet-300">{feature.title}</h3>
                    <p className="mt-1.5 text-[0.9rem] leading-relaxed text-white/55">
                      {feature.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
