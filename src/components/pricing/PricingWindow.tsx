import type { ReactNode } from "react";

// Frames the pricing dashboard in a gradient-bordered panel with a soft light
// slowly flowing around the border (a rotating conic gradient peeking through a
// thin ring). Respects prefers-reduced-motion.
export function PricingWindow({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto max-w-[90rem]">
      {/* soft ambient glow behind the panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(139,92,246,0.18),transparent_70%)] blur-2xl"
      />

      {/* gradient border ring: static base + slowly rotating bright arc */}
      <div className="relative rounded-[1.75rem] bg-gradient-to-b from-white/15 to-white/[0.04] p-[1.5px] shadow-[0_30px_120px_-40px_rgba(99,102,241,0.45)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.75rem]">
          <div
            style={{ animationDuration: "24s" }}
            className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 animate-spin bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,#8b5cf6_50deg,#6366f1_100deg,transparent_160deg,transparent_200deg,#a855f7_260deg,transparent_320deg,transparent_360deg)] motion-reduce:hidden"
          />
        </div>

        <div className="relative overflow-hidden rounded-[calc(1.75rem-1.5px)] bg-[#08080b] p-6 sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
