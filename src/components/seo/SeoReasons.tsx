import { GradientCard } from "./GradientCard";

const reasons = [
  {
    glow: "violet" as const,
    title: "Sustainable growth",
    description:
      "Organic search compounds. Unlike paid ads that vanish the moment you stop spending, the rankings and authority we build keep sending you traffic month after month.",
  },
  {
    glow: "amber" as const,
    title: "Essentially costless",
    description:
      "SEO and GEO put you in front of people already searching for what you offer. That intent converts at a fraction of the cost-per-lead of paid channels, and it keeps improving.",
  },
  {
    glow: "blue" as const,
    title: "Visible in AI answers",
    description:
      "Search is shifting to AI. We optimize your site so ChatGPT, Perplexity, Gemini and Google's AI Overviews cite you as the answer, not just rank you on page one.",
  },
];

export function SeoReasons() {
  return (
    <section className="relative z-10 px-6 pb-16 sm:px-10 sm:pb-24">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <h2 className="text-balance text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl">
            Why would you need SEO?
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-white/55 lg:pt-3">
            SEO is the most cost-effective way to grow revenue and build a brand
            online. With most buyers turning to search &mdash; and increasingly
            to AI answers &mdash; to find what they need, ranking high is no
            longer optional.
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
