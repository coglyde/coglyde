import Link from "next/link";
import { GlowingButton } from "../ui/GlowingButton";

export function SeoCta() {
  return (
    <section
      id="strategy-call"
      className="relative z-10 px-6 pb-28 sm:px-10 sm:pb-36"
    >
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.02] px-8 py-14 text-center backdrop-blur-sm sm:px-12 sm:py-16">
        <h2 className="text-balance text-3xl font-medium tracking-tight text-white sm:text-4xl">
          Ready to own your search results?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60">
          Book a free strategy call and we&rsquo;ll show you exactly where
          you&rsquo;re leaving rankings, traffic and AI visibility on the table,
          and how we&rsquo;d win them back.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <GlowingButton href="#strategy-call">
            Book a strategy call
          </GlowingButton>
          <Link
            href="/pricing"
            className="rounded-2xl border border-white/15 bg-white/[0.03] px-7 py-4 text-[0.88rem] font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.06]"
          >
            See SEO/GEO pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
