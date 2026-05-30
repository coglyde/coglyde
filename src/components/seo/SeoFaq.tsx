import { FaqItem } from "../website-design/FaqItem";

const faqs = [
  {
    question: "How much does SEO cost?",
    answer:
      "Our SEO and GEO retainers start at $499/mo for the Foundation tier, with Growth and Authority plans for more competitive markets. You can see the full breakdown, and add automations, on our pricing page.",
  },
  {
    question: "How long until I see results?",
    answer:
      "SEO compounds, so it's a build rather than a switch. Most clients see meaningful movement within 3 to 6 months and stronger, compounding results between 6 and 12, depending on your starting point and how competitive your market is.",
  },
  {
    question: "What is GEO, and why does it matter?",
    answer:
      "GEO is Generative Engine Optimization: making your brand visible and cited inside AI answers like ChatGPT, Perplexity, Gemini and Google's AI Overviews. As more searches end in an AI-generated answer, being the source it cites is the new page one, and we optimize for both.",
  },
  {
    question: "Do you guarantee rankings?",
    answer:
      "No ethical agency can guarantee a specific position, and anyone who does is a red flag. What we guarantee is transparent, white-hat work and clear monthly reporting on real progress across rankings, traffic, conversions and AI citations.",
  },
  {
    question: "Is there a long contract?",
    answer:
      "Plans are month-to-month with no long lock-in. Because SEO takes time to pay off, we recommend giving it at least 3 to 6 months, but you're free to adjust or cancel anytime.",
  },
];

export function SeoFaq() {
  return (
    <section className="relative z-10 px-6 pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <header className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
              Support
            </p>
            <h2 className="mt-4 text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl md:text-6xl">
              Frequently asked questions
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/55">
              Everything you need to know about working with our SEO and GEO
              team. Still curious? We&rsquo;d love to hear from you.
            </p>
          </header>

          <div className="flex flex-col gap-3 lg:col-span-7">
            {faqs.map((faq) => (
              <FaqItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
