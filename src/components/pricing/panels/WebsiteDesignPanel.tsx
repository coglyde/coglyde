"use client";

import { useState } from "react";
import { buildTiers, websitePlans, type BillingPeriod } from "@/lib/pricing";
import { BillingToggle } from "../BillingToggle";
import { BuildTierCard } from "../BuildTierCard";
import { PlanGrid } from "../PlanGrid";
import { SteppedPanel } from "../SteppedPanel";
import { AddOnsSection } from "./AddOnsSection";

// Website design as a stepper: pick the one-time build, then ongoing hosting /
// maintenance, then any add-ons — one section at a time. The billing toggle
// only appears on the recurring (hosting) step where it's relevant.
export function WebsiteDesignPanel() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  return (
    <SteppedPanel
      steps={[
        {
          key: "build",
          label: "Initial build",
          render: () => (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {buildTiers.map((tier) => (
                <BuildTierCard key={tier.name} tier={tier} />
              ))}
            </div>
          ),
        },
        {
          key: "care",
          label: "Hosting & maintenance",
          render: () => (
            <div>
              <div className="mb-10 flex justify-start">
                <BillingToggle value={period} onChange={setPeriod} />
              </div>
              <PlanGrid plans={websitePlans} period={period} />
            </div>
          ),
        },
        {
          key: "addons",
          label: "Add-ons",
          render: () => <AddOnsSection />,
        },
      ]}
    />
  );
}
