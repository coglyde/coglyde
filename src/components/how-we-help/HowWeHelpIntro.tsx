import { StrategyCallButton } from "./StrategyCallButton";

export function HowWeHelpIntro() {
  return (
    <div className="flex h-full flex-col justify-between gap-10">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          How do we help you win?
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
          We drive your business growth by creating a standout online presence,
          automating workflows, and delivering measurable results. With custom
          designs, advanced development, AI integrations, and targeted
          marketing, we tailor solutions to save you time, reduce costs, and
          unlock new opportunities. Your success is our success, and we&rsquo;re
          here to help you win.
        </p>
      </div>
      <StrategyCallButton />
    </div>
  );
}
