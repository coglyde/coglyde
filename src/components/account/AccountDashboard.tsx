"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Sparkles,
  BarChart3,
  CreditCard,
  Settings as SettingsIcon,
  LifeBuoy,
} from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DashboardSidebar, type NavItem, type SectionId } from "./DashboardSidebar";
import { OverviewSection } from "./OverviewSection";
import { ContentRequests } from "./ContentRequests";
import { AnalyticsPlaceholder } from "./AnalyticsPlaceholder";
import { SubscriptionSection } from "./SubscriptionSection";
import { AccountSettings } from "./AccountSettings";
import { ContactSupport } from "./ContactSupport";
import type { PlanSummary } from "@/lib/stripe-customer";
import type { Capabilities } from "@/lib/capabilities";

type Props = {
  subscriptions: PlanSummary[];
  hasSubscriptions: boolean;
  capabilities: Capabilities;
  userName: string;
  userEmail: string;
};

export function AccountDashboard({
  subscriptions,
  hasSubscriptions,
  capabilities,
  userName,
  userEmail,
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
  const current = items.find((item) => item.id === active) ?? items[0];

  return (
    <SidebarProvider>
      <DashboardSidebar
        items={items}
        active={active}
        onSelect={setActive}
        userName={userName}
        userEmail={userEmail}
      />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <h1 className="text-sm font-medium text-foreground">{current.label}</h1>
        </header>
        <div className="flex-1 p-4 sm:p-6">
          {active === "overview" && (
            <OverviewSection
              userName={userName}
              capabilities={capabilities}
              hasSubscriptions={hasSubscriptions}
            />
          )}
          {active === "content" && <ContentRequests />}
          {active === "analytics" && <AnalyticsPlaceholder />}
          {active === "billing" && (
            <SubscriptionSection subscriptions={subscriptions} hasSubscriptions={hasSubscriptions} />
          )}
          {active === "settings" && <AccountSettings />}
          {active === "support" && <ContactSupport />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
