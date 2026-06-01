import { GradientCard } from "../seo/GradientCard";

const reasons = [
  {
    glow: "violet" as const,
    title: "Never miss a lead",
    description:
      "Every missed call, form fill and DM gets an instant, on-brand response. The work that used to slip through the cracks at 8pm now gets handled in seconds.",
  },
  {
    glow: "amber" as const,
    title: "Hours back every week",
    description:
      "Booking, follow-ups, review requests, reporting and content drafting run on their own. You stop doing the repetitive work and get the time back to grow.",
  },
  {
    glow: "blue" as const,
    title: "Runs while you sleep",
    description:
      "Automations don't take breaks. They answer, qualify, nurture and report 24/7, so your business keeps moving even when you and your team have logged off.",
  },
];

export function AutomationsReasons() {
  return (
    <section className="relative z-10 px-6 pb-16 sm:px-10 sm:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <h2 className="text-balance text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl">
            Why automate?
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-white/55 lg:pt-3">
            Most small businesses lose revenue not to competitors but to
            bottlenecks &mdash; calls that go unanswered, leads that never get
            followed up, reviews that never get asked for. Automation closes
            those gaps without adding headcount.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {reasons.map((reason) => (
            <GradientCard key={reason.title} {...reason} />
          ))}
        </div>
      </div>
    </section>
  );
}
