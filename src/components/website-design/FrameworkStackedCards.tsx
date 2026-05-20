import { TriangleBullet } from "./TriangleBullet";

type Step = { title: string; description: string };

type Props = {
  steps: Step[];
  activeIndex: number;
};

// Z-index offsets per "depth" so the front card always sits on top.
const STACK_DEPTHS = [
  { translateY: 0, scale: 1, opacity: 1, blur: 0, z: 40 },
  { translateY: -22, scale: 0.94, opacity: 0.55, blur: 1, z: 30 },
  { translateY: -42, scale: 0.88, opacity: 0.25, blur: 2, z: 20 },
] as const;

export function FrameworkStackedCards({ steps, activeIndex }: Props) {
  const total = steps.length;

  return (
    <div className="relative w-full" style={{ minHeight: "22rem" }}>
      {steps.map((step, i) => {
        // How far this card is behind the active one (modulo length).
        const depth = (i - activeIndex + total) % total;
        const visible = depth < STACK_DEPTHS.length;
        const cfg = visible ? STACK_DEPTHS[depth] : null;
        const isActive = depth === 0;

        return (
          <article
            key={step.title}
            aria-hidden={!isActive}
            className="absolute inset-x-0 top-0 rounded-2xl border border-white/15 bg-[#0b0b0e] p-7 shadow-[0_30px_80px_-30px_rgba(123,57,252,0.45),0_0_0_1px_rgba(255,255,255,0.04)_inset] transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
            style={{
              transform: cfg
                ? `translateY(${cfg.translateY}px) scale(${cfg.scale})`
                : "translateY(-80px) scale(0.82)",
              opacity: cfg?.opacity ?? 0,
              filter: cfg && cfg.blur > 0 ? `blur(${cfg.blur}px)` : undefined,
              zIndex: cfg?.z ?? 0,
              pointerEvents: isActive ? "auto" : "none",
              visibility: visible ? undefined : "hidden",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="inline-flex items-center gap-3 text-[1.4rem] font-bold tracking-tight text-white sm:text-[1.5rem]">
                <TriangleBullet className="h-3 w-3 shrink-0 text-violet-400" />
                {step.title}
              </h3>
              <span className="font-mono text-[12px] tracking-wider text-white/40">
                {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-5 text-[0.98rem] leading-[1.5] text-white/65">
              {step.description}
            </p>
          </article>
        );
      })}
    </div>
  );
}
