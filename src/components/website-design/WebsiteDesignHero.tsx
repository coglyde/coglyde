import { GlowingButton } from "../ui/GlowingButton";

export function WebsiteDesignHero() {
  return (
    <section className="relative z-10 px-6 pt-32 pb-16 sm:px-10 sm:pt-40 sm:pb-24">
      <div className="mx-auto flex max-w-[90rem] flex-col items-center text-center">
        {/* Matches the live `.hero-heading.is-website_design`: 4rem / 500 /
            max-width 60rem, scaling down per the live mobile overrides. */}
        <h1 className="max-w-[60rem] text-balance text-[3rem] font-medium leading-[1.1] tracking-tight text-white sm:text-[3.2rem] md:text-[3.6rem] lg:text-[4rem]">
          Website Design that Stands Out
        </h1>

        <p className="mt-4 max-w-[48rem] text-pretty text-[0.95rem] leading-[1.5] text-white/60">
          At Coglyde, we craft stunning, user-friendly websites that drive
          results. Our team of skilled web designers and developers is dedicated
          to elevating your online presence and helping your business thrive.
        </p>

        <GlowingButton href="#strategy-call" className="mt-10">
          Book a strategy call
        </GlowingButton>
      </div>
    </section>
  );
}
