"use client";

import { useEffect, useState } from "react";
import { FrameworkDiagram } from "./FrameworkDiagram";
import { FrameworkStackedCards } from "./FrameworkStackedCards";

const STEPS = [
  {
    title: "Plan",
    description:
      "We start by discussing your goals and objectives, target audience, and any specific challenges or opportunities you are facing. Based on this information, we develop a plan for the project that outlines the scope of work, timeline, budget, and deliverables.",
  },
  {
    title: "Analyze",
    description:
      "Next, we conduct a thorough analysis of your current digital presence. This can include your current website (content, technical SEO and performance), your Google Business Profile, your social media and paid advertisements. Our goal is to identify any issues or opportunities for improvement.",
  },
  {
    title: "Design",
    description:
      "Based on the plan and analysis, we begin designing the new website. This may involve creating wireframes, mockups, and prototypes, as well as working with you to refine the overall look and feel of the site. Your input is incredibly valuable at this stage.",
  },
  {
    title: "Develop",
    description:
      "Once the design is approved, we begin building the website. Depending on your service of choice, the website will be custom-coded or built using a CMS platform. Both processes involve writing or editing content, implementing technical SEO best practices, and integrating any necessary functionality or features.",
  },
  {
    title: "Launch",
    description:
      "Once the website is complete, we run multiple thorough tests to ensure it is functioning correctly and effectively meeting your goals. Then, we launch the website and monitor its performance to ensure it is meeting the desired outcomes.",
  },
  {
    title: "Educate",
    description:
      "This is where we separate from most of the other agencies. After the website is launched, we also take some time to educate you on how to effectively manage and maintain your new site. This may involve providing training on how to update content, make changes to the design, or use any special features or tools.",
  },
];

const AUTO_ROTATE_MS = 5000;

export function FrameworkSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  // Bumped on every manual select to reset the auto-rotate interval.
  const [tickKey, setTickKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % STEPS.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [tickKey]);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    setTickKey((k) => k + 1);
  };

  return (
    <section className="relative z-10 px-6 pb-24 sm:px-10 sm:pb-32">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
            Process
          </p>
          <h2 className="mt-4 text-balance text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-[2.75rem] md:text-5xl">
            Our Framework for Website Design
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[0.95rem] leading-[1.5] text-white/55">
            Six steps, end to end, from kickoff to launch. Plus the training
            that keeps you in control after we&rsquo;re done.
          </p>
        </header>

        <div className="mt-20 grid items-center gap-x-16 gap-y-14 lg:grid-cols-2">
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[26rem]">
              <FrameworkDiagram
                activeIndex={activeIndex}
                onSelect={handleSelect}
              />
            </div>
          </div>
          <div className="flex w-full justify-center lg:justify-start">
            <div className="w-full max-w-[26rem]">
              <FrameworkStackedCards
                steps={STEPS}
                activeIndex={activeIndex}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
