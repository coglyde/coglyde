import { StrategyCallButton } from "../how-we-help/StrategyCallButton";

export function FooterCTA() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs font-medium tracking-wide text-white/70 backdrop-blur-sm">
        Ready for lift-off
      </span>
      <h2 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
        Let&rsquo;s glide over the
        <br className="hidden sm:block" /> competition{" "}
        <em className="font-serif italic text-white/90">together.</em>
      </h2>
      <p className="mt-5 max-w-lg text-base text-white/65 sm:text-lg">
        Book a strategy call and see what Coglyde can do for your business.
      </p>
      <div className="mt-8">
        <StrategyCallButton />
      </div>
    </div>
  );
}
