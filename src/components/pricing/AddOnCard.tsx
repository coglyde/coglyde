import type { AddOn } from "@/lib/pricing";
import { CheckoutButton } from "./CheckoutButton";

export function AddOnCard({ addOn }: { addOn: AddOn }) {
  return (
    <article className="group relative flex h-full flex-col rounded-[1.25rem] border border-white/15 bg-white/[0.02] p-6 backdrop-blur-[3px] transition-colors hover:border-white/25">
      <h3 className="text-base font-semibold tracking-tight text-white">
        {addOn.name}
      </h3>

      <div className="mt-4 flex items-baseline gap-1.5">
        {addOn.variablePricing ? (
          <span className="text-sm text-white/50">from</span>
        ) : null}
        <span className="text-3xl font-semibold tracking-tight text-white">
          ${addOn.price.toLocaleString()}
        </span>
        <span className="text-sm text-white/50">/mo</span>
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">
        {addOn.blurb}
      </p>
      {addOn.note ? (
        <p className="mt-3 text-xs leading-relaxed text-white/40">
          {addOn.note}
        </p>
      ) : null}

      <CheckoutButton planKey={addOn.key} period="monthly">
        Subscribe
      </CheckoutButton>
    </article>
  );
}
