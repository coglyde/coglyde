import { BOOKING_URL } from "@/lib/links";
import { GlowingButton } from "../ui/GlowingButton";

export function SeoHero() {
  return (
    <section className="relative z-10 px-6 pt-32 pb-16 sm:px-10 sm:pt-40 sm:pb-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
          SEO &amp; GEO
        </p>
        <h1 className="mt-4 max-w-[60rem] text-balance text-[2.1rem] font-medium leading-[1.12] tracking-tight text-white sm:text-[3.2rem] sm:leading-[1.1] md:text-[3.6rem] lg:text-[4rem]">
          SEO that ranks you on Google and gets you cited in AI answers
        </h1>
        <p className="mt-5 max-w-[48rem] text-pretty text-[0.95rem] leading-[1.5] text-white/60 sm:text-base">
          Ethical, white-hat SEO built for the new era of search. We help you
          climb Google and show up in ChatGPT, Perplexity and Google&rsquo;s AI
          Overviews &mdash; driving qualified, compounding traffic that
          doesn&rsquo;t switch off the moment you stop paying.
        </p>
        <GlowingButton
          href={BOOKING_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-10"
        >
          Book a strategy call
        </GlowingButton>
      </div>
    </section>
  );
}
