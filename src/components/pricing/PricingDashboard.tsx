"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { pricingTabs, type PricingTabKey } from "@/lib/pricing";
import { PricingSidebar } from "./PricingSidebar";
import { AllInOnePanel } from "./panels/AllInOnePanel";
import { AutomationsPanel } from "./panels/AutomationsPanel";
import { SeoPanel } from "./panels/SeoPanel";
import { WebsiteDesignPanel } from "./panels/WebsiteDesignPanel";

// Each panel owns its own stepper and (where relevant) billing toggle, so the
// dashboard just routes the selected category to its panel.
const PANELS: Record<PricingTabKey, () => ReactNode> = {
  "all-in-one": AllInOnePanel,
  "website-design": WebsiteDesignPanel,
  seo: SeoPanel,
  automations: AutomationsPanel,
};

export function PricingDashboard() {
  const [activeKey, setActiveKey] = useState<PricingTabKey>(pricingTabs[0].key);

  const tab = pricingTabs.find((t) => t.key === activeKey) ?? pricingTabs[0];
  const Panel = PANELS[tab.key];

  return (
    <div className="mx-auto flex max-w-[82rem] flex-col gap-10 lg:flex-row lg:gap-14">
      <PricingSidebar tabs={pricingTabs} active={tab.key} onSelect={setActiveKey} />

      <div className="min-w-0 flex-1">
        <header>
          <h2 className="text-balance text-2xl font-medium tracking-tight text-white sm:text-3xl">
            {tab.title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
            {tab.description}
          </p>
        </header>

        <div className="mt-8">
          <Panel />
        </div>
      </div>
    </div>
  );
}
