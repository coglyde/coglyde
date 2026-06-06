import { PlanSummaryCard } from "./PlanSummaryCard";
import { ManageBillingButton } from "../billing/ManageBillingButton";
import { GlowingButton } from "@/components/ui/GlowingButton";
import { BOOKING_URL } from "@/lib/links";
import type { PlanSummary } from "@/lib/stripe-customer";

type Props = {
  subscriptions: PlanSummary[];
  hasSubscriptions: boolean;
};

export function SubscriptionSection({ subscriptions, hasSubscriptions }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-semibold text-white">Subscriptions &amp; Billing</h2>
        <p className="text-white/60">Manage your plans, billing, and invoices.</p>
      </div>

      {hasSubscriptions ? (
        <>
          <div className="space-y-4">
            {subscriptions.map((plan) => (
              <PlanSummaryCard key={plan.id} plan={plan} />
            ))}
          </div>
          {/* Subscribed: a single primary CTA to the Stripe portal. */}
          <ManageBillingButton variant="primary" />
        </>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center sm:p-10">
          <h3 className="text-xl font-semibold tracking-tight text-white">No active plans yet</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/55">
            Pick a plan to keep your site cared for, climbing in search, and running
            on autopilot. Change or cancel anytime.
          </p>
          {/* No plan: two CTAs, browse plans or talk to us. */}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <GlowingButton href="/pricing">Browse plans</GlowingButton>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.06]"
            >
              Book a strategy call
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
