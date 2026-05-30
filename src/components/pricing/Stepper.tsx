"use client";

import { Fragment } from "react";

export type StepItem = { key: string; label: string };

// Numbered, clickable step indicator used to split a category's sections (e.g.
// build / hosting / add-ons) so only one shows at a time. Scrolls horizontally
// on small screens.
export function Stepper({
  steps,
  activeKey,
  onSelect,
}: {
  steps: StepItem[];
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  const activeIndex = steps.findIndex((s) => s.key === activeKey);

  return (
    <div className="no-scrollbar flex items-center gap-2.5 overflow-x-auto sm:gap-3">
      {steps.map((step, i) => {
        const isActive = i === activeIndex;
        const isDone = i < activeIndex;
        return (
          <Fragment key={step.key}>
            <button
              type="button"
              onClick={() => onSelect(step.key)}
              className="group flex shrink-0 items-center gap-2.5"
            >
              <span
                className={`grid h-7 w-7 place-items-center rounded-full text-[0.8rem] font-semibold transition-colors ${
                  isActive
                    ? "bg-violet-500 text-white"
                    : isDone
                      ? "bg-violet-500/20 text-violet-200"
                      : "bg-white/[0.08] text-white/50 group-hover:text-white/80"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`whitespace-nowrap text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-white/50 group-hover:text-white/80"
                }`}
              >
                {step.label}
              </span>
            </button>
            {i < steps.length - 1 ? (
              <span className="h-px w-6 shrink-0 bg-white/15 sm:w-10" />
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
