"use client";

import { useState } from "react";
import { seoPlans, type BillingPeriod } from "@/lib/pricing";
import { BillingToggle } from "../BillingToggle";
import { PlanGrid } from "../PlanGrid";
import { SteppedPanel } from "../SteppedPanel";
import { AddOnsSection } from "./AddOnsSection";

// SEO/GEO as a stepper: the retainers first, add-ons second.
export function SeoPanel() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  return (
    <SteppedPanel
      steps={[
        {
          key: "retainers",
          label: "Retainers",
          render: () => (
            <div>
              <div className="mb-10 flex justify-start">
                <BillingToggle value={period} onChange={setPeriod} />
              </div>
              <PlanGrid plans={seoPlans} period={period} />
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
