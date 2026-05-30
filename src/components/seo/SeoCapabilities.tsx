import { BentoCard } from "./BentoCard";
import {
  ChartIcon,
  DocIcon,
  GaugeIcon,
  LinkIcon,
  SearchIcon,
  SparkIcon,
} from "./icons";

export function SeoCapabilities() {
  return (
    <section className="relative z-10 px-6 pb-16 sm:px-10 sm:pb-24">
      <div className="mx-auto max-w-[90rem]">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
            What we do
          </p>
          <h2 className="mt-4 text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl">
            A complete SEO &amp; GEO engine
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55">
            Every lever that moves the needle on modern search, run by our team
            end to end.
          </p>
        </header>

        {/* Bento: a featured GEO tile, a paired research tile, a row of three,
            and a wide horizontal reporting tile — varied shapes, not a uniform
            grid. */}
        <div className="mt-14 grid gap-6 lg:auto-rows-fr lg:grid-cols-6">
          <div className="lg:col-span-3">
            <BentoCard
              glow="violet"
              icon={<SparkIcon />}
              title="GEO / AI answer optimization"
              description="We structure your content, schema and entities so generative engines understand and cite you: answer-ready passages, llms.txt and brand presence across ChatGPT, Perplexity, Gemini and AI Overviews."
            />
          </div>
          <div className="lg:col-span-3">
            <BentoCard
              icon={<SearchIcon />}
              title="Keyword & entity research"
              description="We map the keywords, entities and questions your buyers actually search, across Google and AI engines, and turn them into a prioritized plan."
            />
          </div>

          <div className="lg:col-span-2">
            <BentoCard
              icon={<GaugeIcon />}
              title="On-page & technical SEO"
              description="Architecture, Core Web Vitals, schema, internal linking and crawlability: the foundation that lets every page rank."
            />
          </div>
          <div className="lg:col-span-2">
            <BentoCard
              icon={<DocIcon />}
              title="Content & topical authority"
              description="Genuinely useful, expertly written content that builds authority and earns rankings and citations."
            />
          </div>
          <div className="lg:col-span-2">
            <BentoCard
              icon={<LinkIcon />}
              title="Link building & digital PR"
              description="White-hat backlinks and digital PR from sites that matter, building authority search and AI models trust."
            />
          </div>

          <div className="lg:col-span-6">
            <BentoCard
              glow="blue"
              horizontal
              icon={<ChartIcon />}
              title="Reporting & analytics"
              description="Transparent monthly reporting on rankings, organic traffic, conversions and AI citations, so you always see exactly what your investment is doing and where it's heading next."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
