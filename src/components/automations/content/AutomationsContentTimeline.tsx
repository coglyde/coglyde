import type { ReactNode } from "react";
import { IdeasMock, ProfileMock, PublishMock, TopicsMock } from "./ContentMocks";

type Step = {
  n: string;
  title: string;
  description: string;
  visual: ReactNode;
};

const steps: Step[] = [
  {
    n: "01",
    title: "Set your business profile once",
    description:
      "Tell the system who you are, what you offer, and how you sound. Set it once and tweak it whenever something changes.",
    visual: <ProfileMock />,
  },
  {
    n: "02",
    title: "Get topic ideas, on tap",
    description:
      "It studies your profile, your market, and what your customers are searching for, then proposes a month of on-brand topics.",
    visual: <IdeasMock />,
  },
  {
    n: "03",
    title: "Pick what to publish",
    description:
      "Approve the topics you like at the start of each month. You stay in control of the direction without doing the legwork.",
    visual: <TopicsMock />,
  },
  {
    n: "04",
    title: "It writes, publishes, reports",
    description:
      "Each post is drafted in your voice, optimized for search and AI answers, published to your site, and tracked, hands-free.",
    visual: <PublishMock />,
  },
];

export function AutomationsContentTimeline() {
  return (
    <section className="relative z-10 px-6 pb-16 sm:px-10 sm:pb-24">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
            Content on autopilot
          </p>
          <h2 className="mt-4 text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl">
            Content creation, made effortless
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/55">
            How Blog Automation turns your busywork into a steady stream of
            published, on-brand content.
          </p>
        </header>

        {/* Center spine on desktop. */}
        <div className="relative mt-16">
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-violet-500/40 to-transparent lg:block"
          />
          <div className="flex flex-col gap-12 lg:gap-4">
            {steps.map((step, i) => {
              const flip = i % 2 === 1;
              return (
                <div
                  key={step.n}
                  className="relative grid items-center gap-6 lg:grid-cols-2 lg:gap-16"
                >
                  {/* Spine node (desktop). */}
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 z-10 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-[#0a0a0c] text-xs font-semibold text-violet-300 lg:grid"
                  >
                    {step.n}
                  </span>

                  <div
                    aria-hidden
                    className={flip ? "lg:order-2 lg:pl-12" : "lg:pr-12"}
                  >
                    {step.visual}
                  </div>

                  <div className={flip ? "lg:order-1 lg:pr-12 lg:text-right" : "lg:pl-12"}>
                    <span className="text-sm font-semibold text-violet-300/80 lg:hidden">
                      {step.n}
                    </span>
                    <h3 className="mt-1 text-xl font-medium tracking-tight text-white sm:text-2xl">
                      {step.title}
                    </h3>
                    <p
                      className={`mt-3 text-sm leading-relaxed text-white/55 sm:text-[15px] ${
                        flip ? "lg:ml-auto" : ""
                      } max-w-md`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
