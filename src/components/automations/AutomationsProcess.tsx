const steps = [
  {
    n: "01",
    title: "Map your bottlenecks",
    description:
      "On a quick call we find where time and leads leak out of your business, then pick the automations that pay back fastest.",
  },
  {
    n: "02",
    title: "Build & connect",
    description:
      "We build each automation and wire it into the tools you already use, your phone, calendar, CRM, site and socials, with your brand voice baked in.",
  },
  {
    n: "03",
    title: "Launch & monitor",
    description:
      "We go live, watch the first conversations and runs closely, and tune the responses and timing until everything feels human and on-brand.",
  },
  {
    n: "04",
    title: "Optimize & expand",
    description:
      "We report on what each automation is saving and earning, then refine and layer in new ones as you grow.",
  },
];

export function AutomationsProcess() {
  return (
    <section className="relative z-10 px-6 pb-20 sm:px-10 sm:pb-28">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
            Process
          </p>
          <h2 className="mt-4 text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl">
            Live in weeks, not quarters
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/55">
            A simple path from first call to automations doing real work, fully
            managed by us.
          </p>
        </header>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <article
              key={step.n}
              className="flex h-full flex-col rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-sm transition-colors hover:border-white/20 sm:p-8"
            >
              <span className="text-2xl font-semibold tabular-nums text-violet-300/80 sm:text-3xl">
                {step.n}
              </span>
              <h3 className="mt-5 text-lg font-medium tracking-tight text-white sm:text-xl">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-[15px]">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
