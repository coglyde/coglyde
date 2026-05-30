import type { BillingPeriod, SubscriptionPlan } from "@/lib/pricing";
import { PlanCard } from "./PlanCard";

// Plans in a left-aligned 3-column grid that fills the content width, so every
// section (build, hosting, retainers, bundles) shares the same card width and
// the same left edge as the header and stepper. Groups with fewer than three
// plans (e.g. hosting) simply leave the trailing column empty.
export function PlanGrid({
  plans,
  period,
}: {
  plans: SubscriptionPlan[];
  period: BillingPeriod;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard key={plan.key} plan={plan} period={period} />
      ))}
    </div>
  );
}
