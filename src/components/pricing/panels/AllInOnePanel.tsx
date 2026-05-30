"use client";

import { useState } from "react";
import { bundles, type BillingPeriod } from "@/lib/pricing";
import { BillingToggle } from "../BillingToggle";
import { PlanGrid } from "../PlanGrid";
import { SteppedPanel } from "../SteppedPanel";
import { AddOnsSection } from "./AddOnsSection";

// All-in-one as a stepper: the bundles first, add-ons second.
export function AllInOnePanel() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  return (
    <SteppedPanel
      steps={[
        {
          key: "bundles",
          label: "Bundles",
          render: () => (
            <div>
              <div className="mb-10 flex justify-start">
                <BillingToggle value={period} onChange={setPeriod} />
              </div>
              <PlanGrid plans={bundles} period={period} />
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
