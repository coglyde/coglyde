import { NEXT_STEPS } from "./contact-data";

export function ContactNextSteps() {
  return (
    <section className="relative z-10 px-6 pb-28 sm:px-10 sm:pb-36">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/40">
          What happens next
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {NEXT_STEPS.map((step, index) => (
            <div
              key={step.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-7 backdrop-blur-sm transition-colors duration-200 hover:border-white/20"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[0.85rem] font-semibold text-violet-200">
                {index + 1}
              </span>
              <h3 className="mt-5 text-[1.05rem] font-medium text-white">{step.title}</h3>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-white/55">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
