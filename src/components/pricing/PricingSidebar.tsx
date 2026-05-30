"use client";

import type { PricingTab, PricingTabKey } from "@/lib/pricing";

// Left-hand category nav for the pricing dashboard. Becomes a horizontal,
// scrollable row on small screens and a sticky vertical rail on desktop.
export function PricingSidebar({
  tabs,
  active,
  onSelect,
}: {
  tabs: PricingTab[];
  active: PricingTabKey;
  onSelect: (key: PricingTabKey) => void;
}) {
  return (
    <nav className="lg:w-56 lg:shrink-0">
      <div className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelect(tab.key)}
              aria-pressed={isActive}
              className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/[0.06] text-white"
                  : "text-white/55 hover:bg-white/[0.03] hover:text-white"
              }`}
            >
              <span
                className={`h-4 w-0.5 shrink-0 rounded-full transition-colors ${
                  isActive ? "bg-violet-400" : "bg-transparent"
                }`}
              />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
