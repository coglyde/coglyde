import { BOOKING_URL } from "@/lib/links";
import { GlowingButton } from "../ui/GlowingButton";

export function AutomationsHero() {
  return (
    <section className="relative z-10 px-6 pt-32 pb-16 sm:px-10 sm:pt-40 sm:pb-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
          Automations
        </p>
        <h1 className="mt-4 max-w-[60rem] text-balance text-[2.1rem] font-medium leading-[1.12] tracking-tight text-white sm:text-[3.2rem] sm:leading-[1.1] md:text-[3.6rem] lg:text-[4rem]">
          Automations that handle the busywork so you can run the business
        </h1>
        <p className="mt-5 max-w-[48rem] text-pretty text-[0.95rem] leading-[1.5] text-white/60 sm:text-base">
          We plug AI into the work that eats your day &mdash; answering calls and
          chats, chasing leads, requesting reviews, drafting content and
          reporting on results &mdash; so it runs itself, around the clock,
          without another hire.
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
