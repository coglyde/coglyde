import {
  annualPerMonth,
  annualTotal,
  formatPrice,
  type BillingPeriod,
  type SubscriptionPlan,
} from "@/lib/pricing";
import { CheckoutButton } from "./CheckoutButton";
import { FeatureItem } from "./FeatureItem";
import { PlanTooltip } from "./PlanTooltip";
import { PopularBadge } from "./PopularBadge";

type PlanCardProps = {
  plan: SubscriptionPlan;
  period: BillingPeriod;
};

export function PlanCard({ plan, period }: PlanCardProps) {
  const perMonth =
    period === "annual" ? annualPerMonth(plan.monthly) : plan.monthly;

  return (
    <article
      className={`group relative flex h-full flex-col rounded-[1.25rem] border bg-white/[0.02] p-7 backdrop-blur-[3px] transition-colors ${
        plan.popular
          ? "border-violet-400/40 hover:border-violet-400/60"
          : "border-white/15 hover:border-white/25"
      }`}
    >
      {plan.popular ? <PopularBadge /> : null}

      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold tracking-tight text-white">
          {plan.name}
        </h3>
        {plan.tooltip ? <PlanTooltip text={plan.tooltip} /> : null}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{plan.blurb}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="text-sm text-white/50">from</span>
        <span className="text-4xl font-semibold tracking-tight text-white">
          ${formatPrice(perMonth)}
        </span>
        <span className="text-sm text-white/50">/mo</span>
      </div>
      <p className="mt-1 h-4 text-xs text-white/45">
        {period === "annual"
          ? `$${formatPrice(annualTotal(plan.monthly))} billed yearly`
          : "billed monthly"}
      </p>

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {plan.features.map((feature) => (
          <FeatureItem key={feature}>{feature}</FeatureItem>
        ))}
      </ul>

      <CheckoutButton
        planKey={plan.key}
        period={period}
        variant={plan.popular ? "primary" : "outline"}
      >
        Get started
      </CheckoutButton>
    </article>
  );
}
