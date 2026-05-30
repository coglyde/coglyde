import type { BillingPeriod } from "@/lib/pricing";

type BillingToggleProps = {
  value: BillingPeriod;
  onChange: (period: BillingPeriod) => void;
};

const OPTIONS: { id: BillingPeriod; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annual" },
];

export function BillingToggle({ value, onChange }: BillingToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.03] p-1 backdrop-blur-sm">
      {OPTIONS.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              active ? "bg-white text-black" : "text-white/60 hover:text-white"
            }`}
          >
            {option.label}
            {option.id === "annual" ? (
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] ${
                  active
                    ? "bg-black/10 text-black/70"
                    : "bg-violet-500/15 text-violet-300"
                }`}
              >
                2 months free
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
