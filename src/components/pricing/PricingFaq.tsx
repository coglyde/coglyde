import { FaqItem } from "@/components/website-design/FaqItem";

const faqs = [
  {
    question: "How does the one-time build relate to the monthly plans?",
    answer:
      "The build is a single project, quoted to the scope and complexity of your site. Once it launches, the monthly plans are optional and keep your site maintained, ranking and automated. You can start a plan at launch or any time after.",
  },
  {
    question: "What is the difference between Hosting and Hosting + Maintenance?",
    answer:
      "Hosting keeps your site online, fast and secure: managed hosting, SSL, backups, updates and monitoring. Hosting + Maintenance adds a direct line to our team for issues, fixes and small content or design edits. It is a baseline retainer with a monthly minimum that scales with what you ask for; net-new pages or features are scoped and quoted separately.",
  },
  {
    question: "Do I need an account to subscribe?",
    answer:
      "Yes. You create a quick account at checkout so your plan, billing and invoices live in one place. From your account you can manage or cancel anytime through the secure Stripe billing portal.",
  },
  {
    question: "Can I cancel a monthly plan whenever I want?",
    answer:
      "Yes. Every plan is month-to-month with no lock-in. You can upgrade, downgrade or cancel at any time from your account, and changes take effect on your next billing date.",
  },
  {
    question: "What is the difference between SEO/GEO plans and the SEO automations?",
    answer:
      "The SEO/GEO plans are hands-on retainers: our team runs the keyword research, competitor analysis, content and outreach for you, across both Google and AI answer engines. The automations are self-running tools you can add on their own, like scheduled audits and keyword tracking. Many clients pair both.",
  },
  {
    question: "Are usage costs like texts and AI minutes included?",
    answer:
      "Each automation includes a generous monthly allotment. If you go beyond it, overage is billed at cost with no markup games, and we always tell you the rate up front so there are no surprises.",
  },
  {
    question: "Do you offer annual billing?",
    answer:
      "Yes. Switch any membership to annual and you get roughly two months free compared to paying monthly.",
  },
];

export function PricingFaq() {
  return (
    <section className="relative z-10 px-6 pb-24 sm:pb-32">
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
            Questions
          </p>
          <h2 className="mt-4 text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl">
            Good to know
          </h2>
        </header>
        <div className="mt-12 flex flex-col gap-3">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
