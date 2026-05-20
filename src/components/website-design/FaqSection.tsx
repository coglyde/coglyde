import { FaqItem } from "./FaqItem";

const faqs = [
  {
    question: "What types of web design services do you offer?",
    answer:
      "At Coglyde, we offer a wide range of web design services, including custom website design, responsive design, e-commerce solutions, and SEO-optimized websites. We tailor our services to meet your specific business needs and goals.",
  },
  {
    question: "How long does it take to complete a web design project?",
    answer:
      "The timeline for a web design project varies based on complexity and requirements. Typically, projects can take anywhere from a few weeks to several months. During our initial consultation, we will provide a detailed timeline based on your specific needs.",
  },
  {
    question: "Do you provide ongoing support after the website launch?",
    answer:
      "Yes! At Coglyde, we believe in building lasting relationships with our clients. We offer ongoing support and maintenance packages to ensure your website remains up-to-date and continues to perform optimally.",
  },
  {
    question: "Can you help with website content and SEO?",
    answer:
      "Absolutely! Our team not only designs your website but can also assist with content creation and SEO strategies. We focus on delivering a website that is not only visually appealing but also ranks well in search engines.",
  },
  {
    question: "Will my website be mobile-friendly?",
    answer:
      "Yes, we specialize in responsive design, ensuring that your website looks great and functions seamlessly on all devices, including smartphones and tablets. A mobile-friendly website is essential in today's digital landscape.",
  },
];

export function FaqSection() {
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
              Everything you need to know about working with our team. Still
              curious? We&rsquo;d love to hear from you.
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
