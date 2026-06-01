"use client";

import { type ReactNode, useState } from "react";
import { ChatWidgetVisual } from "./showcase/ChatWidgetVisual";
import { LeadPipelineVisual } from "./showcase/LeadPipelineVisual";
import { ReviewVisual } from "./showcase/ReviewVisual";
import { VoiceWaveformVisual } from "./showcase/VoiceWaveformVisual";

type Flagship = {
  key: string;
  tab: string;
  icon: ReactNode;
  title: string;
  description: string;
  points: string[];
  visual: ReactNode;
};

const flagships: Flagship[] = [
  {
    key: "receptionist",
    tab: "AI Receptionist",
    icon: <PhoneIcon />,
    title: "An AI receptionist that never misses a call",
    description:
      "Hand your phones to an AI voice assistant that greets every caller, answers questions from your own materials, books jobs straight into your calendar, and transfers to a person the moment a human touch is needed.",
    points: [
      "Answers 24/7, even after hours and at peak times",
      "Books and reschedules without back-and-forth",
      "Trained on your services, pricing, and FAQs",
    ],
    visual: <VoiceWaveformVisual />,
  },
  {
    key: "chatbot",
    tab: "AI Chatbot",
    icon: <ChatIcon />,
    title: "A site chatbot that turns visitors into booked jobs",
    description:
      "A chat widget trained on your business answers questions instantly, qualifies the people worth your time, and books them in, so visitors get help in seconds instead of bouncing.",
    points: [
      "Replies instantly on every page of your site",
      "Qualifies and captures leads while you sleep",
      "Hands off to your team with full context",
    ],
    visual: <ChatWidgetVisual />,
  },
  {
    key: "leadgen",
    tab: "Lead Generation",
    icon: <FunnelIcon />,
    title: "A pipeline that fills itself",
    description:
      "We find prospects that match your ideal customer and run personalized outreach on autopilot, so a steady stream of qualified opportunities lands in front of you without manual prospecting.",
    points: [
      "Sources prospects matched to your market",
      "Personalized outreach that runs on its own",
      "Hot leads flagged and ready to close",
    ],
    visual: <LeadPipelineVisual />,
  },
  {
    key: "reputation",
    tab: "Reputation",
    icon: <StarIcon />,
    title: "A five-star reputation on autopilot",
    description:
      "Every finished job triggers a review request at the perfect moment, unhappy customers get caught before they post in public, and replies are drafted for you, so your rating climbs on its own.",
    points: [
      "Auto-requests reviews right after each job",
      "Flags unhappy customers before they post",
      "Drafts on-brand replies for you to approve",
    ],
    visual: <ReviewVisual />,
  },
];

export function AutomationsShowcase() {
  const [active, setActive] = useState(0);
  const current = flagships[active];

  return (
    <section className="relative z-10 px-6 pb-16 sm:px-10 sm:pb-24">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
            The flagships
          </p>
          <h2 className="mt-4 text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl">
            Your busiest jobs, fully handled
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55">
            The automations that move the needle most for service businesses,
            built and managed by our team.
          </p>
        </header>

        {/* Tabs */}
        <div className="mt-12 flex justify-center">
          <div
            role="tablist"
            aria-label="Flagship automations"
            className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] p-1.5"
          >
            {flagships.map((f, i) => {
              const selected = i === active;
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(i)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    selected
                      ? "bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                      : "text-white/55 hover:text-white"
                  }`}
                >
                  <span className={selected ? "text-violet-300" : "text-white/40"}>
                    {f.icon}
                  </span>
                  {f.tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel */}
        <div className="mt-10 grid gap-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-sm lg:grid-cols-2 lg:gap-0">
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <h3 className="text-balance text-2xl font-medium tracking-tight text-white sm:text-3xl">
              {current.title}
            </h3>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-white/60">
              {current.description}
            </p>
            <ul className="mt-7 flex flex-col gap-3">
              {current.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm text-white/70"
                >
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-violet-400/30 bg-violet-500/10 text-violet-300">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                    >
                      <path d="M5 13l4 4 10-11" />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative border-t border-white/[0.07] bg-gradient-to-br from-white/[0.03] to-transparent lg:border-l lg:border-t-0">
            {current.visual}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4Z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function FunnelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M12 4.5l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4L7.5 18l.9-5L4.8 9.8l5-.7L12 4.5Z" />
    </svg>
  );
}
