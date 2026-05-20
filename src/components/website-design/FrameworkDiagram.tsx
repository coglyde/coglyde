"use client";

const steps = ["Plan", "Analyze", "Design", "Develop", "Launch", "Educate"];

// Position 6 nodes evenly around a circle, starting at the top (12 o'clock).
function nodePosition(index: number) {
  const angle = (index / steps.length) * Math.PI * 2 - Math.PI / 2;
  const radius = 42;
  const cx = 50 + Math.cos(angle) * radius;
  const cy = 50 + Math.sin(angle) * radius;
  return { left: `${cx}%`, top: `${cy}%` };
}

type Props = {
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function FrameworkDiagram({ activeIndex, onSelect }: Props) {
  const activeStep = steps[activeIndex];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(167,139,250,0.6)" />
            <stop offset="50%" stopColor="rgba(99,102,241,0.4)" />
            <stop offset="100%" stopColor="rgba(167,139,250,0.6)" />
          </linearGradient>
          <radialGradient id="active-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(167,139,250,0.4)" />
            <stop offset="100%" stopColor="rgba(167,139,250,0)" />
          </radialGradient>
        </defs>
        <circle
          cx="100"
          cy="100"
          r="84"
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth="1.2"
          strokeDasharray="2 5"
        />
        <circle
          cx="100"
          cy="100"
          r="50"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      </svg>

      <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-center shadow-[0_30px_80px_-30px_rgba(123,57,252,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:h-36 sm:w-36">
        <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">
          Currently
        </span>
        <span
          key={activeStep}
          className="mt-1 animate-[fade-up_320ms_ease-out] text-lg font-semibold text-white sm:text-xl"
        >
          {activeStep}
        </span>
        <span className="mt-1 font-mono text-[10px] tracking-wider text-white/35">
          {String(activeIndex + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
        </span>
      </div>

      {steps.map((step, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={step}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={nodePosition(i)}
          >
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Show step ${i + 1}: ${step}`}
              aria-current={isActive ? "step" : undefined}
              className="group flex flex-col items-center focus:outline-none"
            >
              <span
                className={[
                  "grid h-14 w-14 place-items-center rounded-full border text-sm font-semibold backdrop-blur-xl transition-all duration-300 sm:h-16 sm:w-16",
                  isActive
                    ? "border-violet-300/60 bg-violet-500/30 text-white scale-110 shadow-[0_0_40px_-2px_rgba(167,139,250,0.85),inset_0_1px_0_rgba(255,255,255,0.18)]"
                    : "border-white/15 bg-white/[0.06] text-white/80 shadow-[0_0_30px_-8px_rgba(139,92,246,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] group-hover:border-white/30 group-hover:text-white",
                ].join(" ")}
              >
                {i + 1}
              </span>
              <span
                className={[
                  "mt-2 text-xs font-medium tracking-wide transition-colors sm:text-sm",
                  isActive ? "text-white" : "text-white/65 group-hover:text-white/90",
                ].join(" ")}
              >
                {step}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
