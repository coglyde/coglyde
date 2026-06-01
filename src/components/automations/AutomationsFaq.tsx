import { FaqItem } from "../website-design/FaqItem";

const faqs = [
  {
    question: "How much do automations cost?",
    answer:
      "Most automations run between $99 and $497/mo, depending on the piece and the volume. They're billed monthly with no lock-in, and you can stack as many as you need. The full menu with prices is on our pricing page.",
  },
  {
    question: "Will it sound like a robot to my customers?",
    answer:
      "No. We train every automation on your business and your tone, then monitor the first real conversations closely and tune them until they read as natural, on-brand and genuinely helpful. The goal is faster and more consistent, not colder.",
  },
  {
    question: "Do these work with the tools I already use?",
    answer:
      "Yes. We connect automations to your existing phone number, calendar, CRM, website and social accounts wherever possible, so they slot into how you already work instead of forcing you onto new software.",
  },
  {
    question: "How fast can they go live?",
    answer:
      "Most automations are live within a couple of weeks of our kickoff call. Simpler pieces like Missed Call Text-Back or Appointment Reminders can be running in days; larger builds like the Virtual AI Admin or Lead Generation take a little longer to scope and tune.",
  },
  {
    question: "Can I start with one and add more later?",
    answer:
      "Absolutely, and most clients do. Start with the bottleneck that's costing you the most, see the results, then layer in the next automation when you're ready. Everything is month-to-month.",
  },
];

export function AutomationsFaq() {
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
              Everything you need to know about putting our automations to work.
              Still curious? We&rsquo;d love to hear from you.
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
