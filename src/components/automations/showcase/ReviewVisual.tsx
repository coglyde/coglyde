// A review-request + rating-climbing mockup for the Reputation & Reviews tab.
function Stars({ count = 5 }: { count?: number }) {
  return (
    <span className="flex gap-0.5 text-amber-400">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M12 4.5l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4L7.5 18l.9-5L4.8 9.8l5-.7L12 4.5Z" />
        </svg>
      ))}
    </span>
  );
}

export function ReviewVisual() {
  return (
    <div className="relative flex h-full min-h-[18rem] items-center justify-center p-8">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 75% 25%, rgba(251,146,60,0.18), transparent 70%)",
        }}
      />
      <div className="relative w-full max-w-sm space-y-3">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-white/40">
              Average rating
            </p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-semibold text-white">
              4.9
              <Stars />
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[0.65rem] font-semibold text-emerald-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
              <path d="M5 14l5-5 4 3 5-6" />
            </svg>
            +38 this month
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-violet-500/40 to-blue-500/20 text-[0.7rem] font-semibold text-white">
              J
            </span>
            <p className="text-[0.8rem] font-medium text-white">Jordan M.</p>
            <span className="ml-auto">
              <Stars />
            </span>
          </div>
          <p className="mt-2 text-[0.78rem] leading-snug text-white/60">
            &ldquo;Fast, professional, and the follow-up was seamless. Highly
            recommend.&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/[0.07] px-3.5 py-2.5 text-[0.72rem] text-violet-100">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0">
            <path d="M4 6.5l8 5 8-5" />
            <rect x="4" y="5" width="16" height="14" rx="2" />
          </svg>
          Review request sent automatically after the job
        </div>
      </div>
    </div>
  );
}
