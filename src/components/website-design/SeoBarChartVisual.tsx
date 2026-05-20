const BAR_COUNT = 48;

function barHeight(i: number) {
  const t = i / (BAR_COUNT - 1);
  // Performance climbs from ~30% on the left to ~95% on the right.
  // `(1 - cos(...)) / 2` is a smooth ease curve from 0 → 1 across the range.
  const ease = (1 - Math.cos(t * Math.PI * 0.85)) / 2;
  const value = 0.32 + 0.62 * ease;
  const wobble = 0.06 * Math.sin(i * 1.7 + 1.2);
  return Math.max(0.18, Math.min(0.98, value + wobble));
}

export function SeoBarChartVisual() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-end bg-black">
      <div className="absolute inset-x-0 top-10 text-center">
        <div className="font-mono text-[0.65rem] tracking-[0.28em] text-white/35 uppercase">
          Performance
        </div>
        <div className="mt-3 flex items-baseline justify-center gap-2 font-medium">
          <span className="text-5xl text-blue-300 sm:text-6xl">98</span>
          <span className="text-xl text-white/25 sm:text-2xl">/ 100</span>
        </div>
      </div>

      <div className="relative h-[52%] w-[86%] pb-2">
        <div className="flex h-full items-end justify-between gap-[3px]">
          {Array.from({ length: BAR_COUNT }).map((_, i) => {
            const h = barHeight(i);
            return (
              <div
                key={i}
                className="flex-1 rounded-[2px] bg-gradient-to-t from-blue-900/70 via-blue-600/80 to-blue-300/95"
                style={{ height: `${h * 100}%` }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
