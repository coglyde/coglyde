"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Globe,
  SquarePen,
  Sparkles,
  BarChart3,
  CreditCard,
  Settings as SettingsIcon,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OverviewSection } from "./OverviewSection";
import { AdminSites } from "./AdminSites";
import { ContentEditor } from "./ContentEditor";
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
  | "sites"
  | "edit"
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
  isAdmin: boolean;
  impersonating?: { id: string; name: string } | null;
};

export function AccountDashboard({
  subscriptions,
  hasSubscriptions,
  capabilities,
  userName,
  site,
  isAdmin,
  impersonating,
}: Props) {
  // When an admin is viewing as a client, the content + request sections act on
  // that client's site.
  const clientId = impersonating?.id;
  const canEdit = capabilities.editableContent.length > 0;
  const allItems: NavItem[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "sites", label: "All sites", icon: Globe },
    { id: "edit", label: "Site updates", icon: SquarePen },
    { id: "content", label: "Request changes", icon: Sparkles },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "settings", label: "Settings", icon: SettingsIcon },
    { id: "support", label: "Support", icon: LifeBuoy },
  ];
  // Gate the admin view, direct editors, and the AI request flow on access.
  const items = allItems.filter((item) => {
    if (item.id === "sites") return isAdmin;
    if (item.id === "edit") return canEdit;
    if (item.id === "content") return capabilities.siteUpdates;
    return true;
  });
  const [active, setActive] = useState<SectionId>(
    isAdmin ? "sites" : canEdit ? "edit" : capabilities.siteUpdates ? "content" : "overview",
  );

  return (
    <div>
      {impersonating && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3">
          <p className="text-sm text-white">
            <span className="text-white/60">Viewing as</span>{" "}
            <span className="font-semibold">{impersonating.name}</span>{" "}
            <span className="text-white/40">· admin</span>
          </p>
          <a
            href="/account"
            className="rounded-md border border-white/15 px-3 py-1.5 text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white"
          >
            Exit
          </a>
        </div>
      )}

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
        {active === "sites" && <AdminSites />}
        {active === "edit" && <ContentEditor clientId={clientId} />}
        {active === "content" && <ContentRequests clientId={clientId} />}
        {active === "analytics" && <AnalyticsPlaceholder />}
        {active === "billing" && (
          <SubscriptionSection subscriptions={subscriptions} hasSubscriptions={hasSubscriptions} />
        )}
        {active === "settings" && <AccountSettings />}
        {active === "support" && <ContactSupport />}
        </section>
      </div>
    </div>
  );
}
