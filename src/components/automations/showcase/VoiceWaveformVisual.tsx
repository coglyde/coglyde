// Siri-style voice waveform for the AI Receptionist tab. Bars animate via the
// shared `.eq-bar` keyframe; each gets its own min-height and delay so the row
// ripples instead of pulsing in unison.
const BARS = [
  0.35, 0.6, 0.45, 0.8, 0.55, 1, 0.7, 0.4, 0.85, 0.5, 0.65, 0.3, 0.75, 0.5,
  0.4,
];

export function VoiceWaveformVisual() {
  return (
    <div className="relative flex h-full min-h-[18rem] flex-col items-center justify-center gap-7 p-8">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 50% 35%, rgba(139,92,246,0.22), transparent 70%)",
        }}
      />
      <span className="relative grid h-16 w-16 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white shadow-[0_0_40px_-8px_rgba(139,92,246,0.7)]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M6 11a6 6 0 0 0 12 0M12 17v4" />
        </svg>
      </span>

      <div className="relative flex h-16 items-center gap-1.5">
        {BARS.map((min, i) => (
          <span
            key={i}
            className="eq-bar w-1.5 rounded-full bg-gradient-to-t from-violet-500 to-blue-400"
            style={{
              height: "100%",
              ["--eq-min" as string]: String(min),
              animationDelay: `${i * 90}ms`,
            }}
          />
        ))}
      </div>
      <p className="relative text-xs uppercase tracking-[0.3em] text-white/45">
        On a call
      </p>
    </div>
  );
}
