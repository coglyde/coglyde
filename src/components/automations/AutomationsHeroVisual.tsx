// A glassy "automation in action" mockup for the hero: a missed call that the
// system answers and books on its own. Pure markup, with horizontal light
// streaks behind it echoing the studio look. Decorative, so it's aria-hidden.
export function AutomationsHeroVisual() {
  return (
    <div aria-hidden className="relative mt-16 w-full max-w-2xl">
      {/* Horizontal light streaks bleeding out either side of the card. */}
      <span className="pointer-events-none absolute left-[-22%] top-1/2 h-px w-[42%] -translate-y-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent blur-[1px]" />
      <span className="pointer-events-none absolute right-[-22%] top-1/2 h-px w-[42%] -translate-y-1/2 bg-gradient-to-l from-transparent via-white/70 to-transparent blur-[1px]" />
      <span
        className="pointer-events-none absolute inset-x-8 -top-10 h-40 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(60% 100% at 50% 0%, rgba(112,124,255,0.30), transparent 70%)",
        }}
      />

      <div className="relative overflow-hidden rounded-[1.6rem] border border-white/12 bg-[#0b0b0f]/80 p-5 text-left shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-md sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-violet-400/25 bg-gradient-to-br from-violet-500/30 to-blue-500/10 text-violet-200">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4Z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-medium text-white">Missed call</p>
              <p className="text-xs text-white/45">handled automatically</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-emerald-300">
            replied in 4s
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          <Bubble side="out">
            Hi, sorry we missed you! This is Coglyde. How can we help?
          </Bubble>
          <Bubble side="in">Do you have any openings Friday?</Bubble>
          <Bubble side="out">
            We do, mornings and afternoon are both open. What time works best
            for you?
          </Bubble>
        </div>
      </div>
    </div>
  );
}

function Bubble({
  side,
  children,
}: {
  side: "in" | "out";
  children: React.ReactNode;
}) {
  const out = side === "out";
  return (
    <div className={`flex ${out ? "justify-end" : "justify-start"}`}>
      <p
        className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-[0.82rem] leading-snug ${
          out
            ? "rounded-br-md bg-gradient-to-br from-violet-500/85 to-indigo-500/85 text-white"
            : "rounded-bl-md border border-white/10 bg-white/[0.05] text-white/80"
        }`}
      >
        {children}
      </p>
    </div>
  );
}
