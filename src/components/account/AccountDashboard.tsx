"use client";

import { useState } from "react";
import { AccountSettings } from "./AccountSettings";
import { SubscriptionSection } from "./SubscriptionSection";
import { ContactSupport } from "./ContactSupport";
import { ContentRequests } from "./ContentRequests";
import type { PlanSummary } from "@/lib/stripe-customer";

type Tab = "content" | "account" | "subscription" | "support";

interface AccountDashboardProps {
  subscriptions: PlanSummary[];
  hasSubscriptions: boolean;
}

export function AccountDashboard({ subscriptions, hasSubscriptions }: AccountDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("content");

  const tabs = [
    { id: "content", label: "Site updates", icon: "✨" },
    { id: "account", label: "Account Settings", icon: "⚙️" },
    { id: "subscription", label: "Subscription & Billing", icon: "💳" },
    { id: "support", label: "Support", icon: "📧" },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="border-b border-white/10">
        <div className="flex gap-2 sm:gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-500 text-white"
                  : "border-transparent text-white/60 hover:text-white/80"
              }`}
            >
              <span className="hidden sm:inline">{tab.icon} </span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "content" && <ContentRequests />}
        {activeTab === "account" && <AccountSettings />}
        {activeTab === "subscription" && (
          <SubscriptionSection subscriptions={subscriptions} hasSubscriptions={hasSubscriptions} />
        )}
        {activeTab === "support" && <ContactSupport />}
      </div>
    </div>
  );
}
