import type Stripe from "stripe";

// Maps a Stripe subscription status to a friendly label and colour.
const TONES = {
  green: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  amber: "border-amber-400/40 bg-amber-500/10 text-amber-200",
  gray: "border-white/20 bg-white/5 text-white/60",
} as const;

const STATUS: Record<string, { label: string; tone: keyof typeof TONES }> = {
  active: { label: "Active", tone: "green" },
  trialing: { label: "Trial", tone: "green" },
  past_due: { label: "Past due", tone: "amber" },
  unpaid: { label: "Unpaid", tone: "amber" },
  incomplete: { label: "Incomplete", tone: "amber" },
  paused: { label: "Paused", tone: "gray" },
  canceled: { label: "Canceled", tone: "gray" },
};

export function PlanStatusBadge({
  status,
}: {
  status: Stripe.Subscription.Status;
}) {
  const entry = STATUS[status] ?? { label: status, tone: "gray" as const };
  return (
    <span
      className={`rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] ${TONES[entry.tone]}`}
    >
      {entry.label}
    </span>
  );
}
