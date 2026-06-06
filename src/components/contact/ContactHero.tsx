import { TextsReveal } from "../ui/TextsReveal";

export function ContactHero() {
  return (
    <section className="relative z-10 px-6 pt-36 pb-12 text-center sm:px-10 sm:pt-44 sm:pb-16">
      <TextsReveal className="mx-auto flex max-w-3xl flex-col items-center">
        <span className="t-stagger-line t-stagger-line--1 text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
          Contact
        </span>
        <h1 className="t-stagger-line t-stagger-line--2 mt-4 text-balance text-[2.4rem] font-medium leading-[1.1] tracking-tight text-white sm:text-[3.4rem] sm:leading-[1.06]">
          Let&rsquo;s build something
          <br className="hidden sm:block" /> worth gliding to
        </h1>
        <p className="t-stagger-line t-stagger-line--3 mt-5 max-w-xl text-pretty text-[0.98rem] leading-relaxed text-white/60 sm:text-base">
          Tell us where you want to go. Whether it&rsquo;s a new site, sharper
          visibility, or automations that run themselves, we&rsquo;ll map the
          fastest line there.
        </p>
      </TextsReveal>
    </section>
  );
}
