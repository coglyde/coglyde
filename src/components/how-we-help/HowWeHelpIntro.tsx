import { StrategyCallButton } from "./StrategyCallButton";

export function HowWeHelpIntro() {
  return (
    <div className="flex flex-col justify-between gap-12 lg:sticky lg:top-24 lg:self-start">
      <div>
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">
          What we do
        </span>
        <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
          How do we help you win?
        </h2>
        <p className="mt-7 max-w-md text-[15px] leading-relaxed text-white/70">
          We drive business growth through standout online presence, automated
          workflows, and measurable results. Custom design, advanced
          development, AI integrations, and targeted marketing, all tailored to
          save time, reduce costs, and unlock new opportunities.
        </p>
      </div>
      <StrategyCallButton />
    </div>
  );
}
