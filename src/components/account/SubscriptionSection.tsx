import Link from "next/link";
import { PlanSummaryCard } from "./PlanSummaryCard";
import { ManageBillingButton } from "../billing/ManageBillingButton";
import { AccountEmptyState } from "./AccountEmptyState";

interface SubscriptionSectionProps {
  subscriptions: any[];
  hasSubscriptions: boolean;
}

export function SubscriptionSection({ subscriptions, hasSubscriptions }: SubscriptionSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Subscriptions & Billing</h2>
        <p className="text-white/60">Manage your plans, billing information, and invoices</p>
      </div>

      {hasSubscriptions ? (
        <>
          <div className="space-y-4">
            {subscriptions.map((plan) => (
              <PlanSummaryCard key={plan.id} plan={plan} />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <ManageBillingButton variant="primary" />
            <Link
              href="/pricing"
              className="rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.06] text-center"
            >
              View all plans
            </Link>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6">
            <h3 className="font-semibold text-white mb-2">Need help?</h3>
            <p className="text-sm text-white/70 mb-4">
              Visit the Support tab if you have any questions about your subscription or billing.
            </p>
            <Link
              href="#support"
              className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Contact support →
            </Link>
          </div>
        </>
      ) : (
        <>
          <AccountEmptyState />
          <div className="pt-4">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm font-medium text-white transition-colors"
            >
              Explore our plans
              <span>→</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
