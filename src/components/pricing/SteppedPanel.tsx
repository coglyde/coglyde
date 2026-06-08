"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Stepper } from "./Stepper";
import { useDeepLinkSelection } from "./useDeepLinkSelection";

type Step = { key: string; label: string; render: () => ReactNode };

// Wraps a category's sections in a stepper: shows one section at a time with a
// "Continue" affordance to advance, so plans, hosting and add-ons aren't all
// dumped on screen at once.
export function SteppedPanel({ steps }: { steps: Step[] }) {
  const [activeKey, setActiveKey] = useState(steps[0]?.key ?? "");

  // Allow linking straight to a step, e.g. /pricing?step=hosting.
  useDeepLinkSelection(
    "step",
    steps.map((s) => s.key),
    setActiveKey,
  );

  const index = Math.max(
    0,
    steps.findIndex((s) => s.key === activeKey),
  );
  const active = steps[index];
  const next = steps[index + 1];

  return (
    <div>
      <div className="border-b border-white/10 pb-6">
        <Stepper steps={steps} activeKey={active.key} onSelect={setActiveKey} />
      </div>

      <div className="mt-12">{active.render()}</div>

      {next ? (
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={() => setActiveKey(next.key)}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.06]"
          >
            Continue to {next.label}
            <span aria-hidden>→</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
