import Image from "next/image";

const steps = [
  {
    n: "01",
    title: "Audit & research",
    description:
      "We dig into your site, competitors and market to find where you're losing rankings, traffic and AI visibility, then build a prioritized roadmap.",
  },
  {
    n: "02",
    title: "Technical foundation",
    description:
      "We fix crawlability, speed, schema and site structure so search engines and AI models can read and trust every page you publish.",
  },
  {
    n: "03",
    title: "Content & authority",
    description:
      "We publish content that answers real questions and earns links and citations, building the topical authority that rankings depend on.",
  },
  {
    n: "04",
    title: "GEO / AI optimization",
    description:
      "We make your brand the answer in AI search, structuring entities, schema and passages so generative engines understand and cite you.",
  },
  {
    n: "05",
    title: "Measure & iterate",
    description:
      "We report on rankings, traffic, conversions and AI citations every month, then double down on what's working and cut what isn't.",
  },
];

export function SeoProcess() {
  return (
    <section className="relative z-10 px-6 pb-20 sm:px-10 sm:pb-28">
      <div className="mx-auto max-w-[90rem]">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
            Process
          </p>
          <h2 className="mt-4 text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl">
            How we get you ranking
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/55">
            A clear, repeatable system, from first audit to compounding results.
          </p>
        </header>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-black">
            <Image
              src="/images/seo/our-seo-process.png"
              alt="The Coglyde SEO process"
              fill
              sizes="(min-width: 1024px) 45vw, 95vw"
              className="object-contain"
            />
          </div>

          <ol className="flex flex-col">
            {steps.map((step, i) => (
              <li
                key={step.n}
                className={`flex gap-6 py-6 sm:gap-8 ${
                  i > 0 ? "border-t border-white/[0.08]" : ""
                }`}
              >
                <span className="text-2xl font-semibold tabular-nums text-violet-300/80 sm:text-3xl">
                  {step.n}
                </span>
                <div>
                  <h3 className="text-lg font-medium tracking-tight text-white sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55 sm:text-[15px]">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
