import Link from "next/link";
import { BOOKING_URL } from "@/lib/links";
import { GlowingButton } from "../ui/GlowingButton";

export function AutomationsCta() {
  return (
    <section
      id="strategy-call"
      className="relative z-10 px-6 pb-28 sm:px-10 sm:pb-36"
    >
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.02] px-8 py-14 text-center backdrop-blur-sm sm:px-12 sm:py-16">
        <h2 className="text-balance text-3xl font-medium tracking-tight text-white sm:text-4xl">
          Ready to put your busywork on autopilot?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60">
          Book a free strategy call and we&rsquo;ll map the automations that
          would save you the most time and capture the most revenue, then show
          you exactly how we&rsquo;d build them.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <GlowingButton href={BOOKING_URL} target="_blank" rel="noreferrer">
            Book a strategy call
          </GlowingButton>
          <Link
            href="/pricing"
            className="rounded-2xl border border-white/15 bg-white/[0.03] px-7 py-4 text-[0.88rem] font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.06]"
          >
            See automation pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
