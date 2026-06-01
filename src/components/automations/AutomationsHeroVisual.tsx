// A glassy chatbot-entry composer for the hero, echoing the original site: a
// message box with an attached file and a send action. Horizontal light streaks
// bleed out either side. Decorative, so it's aria-hidden.
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
        {/* Message field */}
        <p className="text-[0.95rem] leading-relaxed text-white/40">
          Tell us how we can help you&hellip;
        </p>

        {/* Attached file chip */}
        <div className="mt-6 flex">
          <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 text-white/45"
            >
              <path d="M18 8.5 9.7 16.8a2.5 2.5 0 0 1-3.5-3.5l8-8a4 4 0 0 1 5.7 5.7l-8.2 8.2a6 6 0 0 1-8.5-8.5l7.4-7.4" />
            </svg>
            1 file attached &middot; marketing-strategy.pdf
          </span>
        </div>

        <div className="mt-5 border-t border-white/[0.07]" />

        {/* Action row */}
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm text-white/50">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M4 5h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z" />
              <path d="M4 11h4l1.5 2.5h5L16 11h4" />
            </svg>
            Inbox
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-[0_10px_30px_-10px_rgba(112,124,255,0.9)]">
            Capture
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.9}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
