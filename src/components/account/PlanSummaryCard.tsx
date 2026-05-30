import type { PlanSummary } from "@/lib/stripe-customer";
import { PlanStatusBadge } from "./PlanStatusBadge";

function formatDate(epochSeconds: number | null): string | null {
  if (!epochSeconds) return null;
  return new Date(epochSeconds * 1000).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// One active (or past) subscription, shown on /account.
export function PlanSummaryCard({ plan }: { plan: PlanSummary }) {
  const renewal = formatDate(plan.currentPeriodEnd);
  const renewalLabel = plan.cancelAtPeriodEnd ? "Ends" : "Renews";

  return (
    <article className="rounded-[1.25rem] border border-white/15 bg-white/[0.02] p-6 backdrop-blur-[3px] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            {plan.name}
          </h2>
          {plan.priceLabel ? (
            <p className="mt-1 text-sm text-white/55">
              {plan.priceLabel}
              {plan.intervalLabel ? ` · ${plan.intervalLabel}` : ""}
            </p>
          ) : null}
        </div>
        <PlanStatusBadge status={plan.status} />
      </div>

      {renewal ? (
        <p className="mt-4 text-sm text-white/50">
          {renewalLabel} {renewal}
        </p>
      ) : null}
    </article>
  );
}
