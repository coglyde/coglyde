"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Sparkles,
  BarChart3,
  CreditCard,
  Settings as SettingsIcon,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OverviewSection } from "./OverviewSection";
import { ContentRequests } from "./ContentRequests";
import { AnalyticsPlaceholder } from "./AnalyticsPlaceholder";
import { SubscriptionSection } from "./SubscriptionSection";
import { AccountSettings } from "./AccountSettings";
import { ContactSupport } from "./ContactSupport";
import type { PlanSummary } from "@/lib/stripe-customer";
import type { Capabilities } from "@/lib/capabilities";
import type { ClientSite } from "@/lib/client-site";

export type SectionId =
  | "overview"
  | "content"
  | "analytics"
  | "billing"
  | "settings"
  | "support";
type NavItem = { id: SectionId; label: string; icon: LucideIcon };

type Props = {
  subscriptions: PlanSummary[];
  hasSubscriptions: boolean;
  capabilities: Capabilities;
  userName: string;
  site: ClientSite;
};

export function AccountDashboard({
  subscriptions,
  hasSubscriptions,
  capabilities,
  userName,
  site,
}: Props) {
  const allItems: NavItem[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "content", label: "Site updates", icon: Sparkles },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "settings", label: "Settings", icon: SettingsIcon },
    { id: "support", label: "Support", icon: LifeBuoy },
  ];
  // Gate Site updates on having a linked site repo.
  const items = allItems.filter((item) => item.id !== "content" || capabilities.siteUpdates);
  const [active, setActive] = useState<SectionId>(
    capabilities.siteUpdates ? "content" : "overview",
  );

  return (
    <div className="flex flex-col gap-8 md:flex-row md:gap-10">
      {/* Side nav: horizontal scroll on mobile, a column on desktop. */}
      <aside className="shrink-0 md:w-52 lg:w-56">
        <nav className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 md:mx-0 md:flex-col md:overflow-visible md:px-0">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                className={cn(
                  "flex items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/55 hover:bg-white/[0.06] hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="min-w-0 flex-1">
        {active === "overview" && (
          <OverviewSection
            userName={userName}
            site={site}
            capabilities={capabilities}
            hasSubscriptions={hasSubscriptions}
            onNavigate={setActive}
          />
        )}
        {active === "content" && <ContentRequests />}
        {active === "analytics" && <AnalyticsPlaceholder />}
        {active === "billing" && (
          <SubscriptionSection subscriptions={subscriptions} hasSubscriptions={hasSubscriptions} />
        )}
        {active === "settings" && <AccountSettings />}
        {active === "support" && <ContactSupport />}
      </section>
    </div>
  );
}
