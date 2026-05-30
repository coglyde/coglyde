import Link from "next/link";
import type { BuildTier } from "@/lib/pricing";
import { FeatureItem } from "./FeatureItem";
import { PopularBadge } from "./PopularBadge";

export function BuildTierCard({ tier }: { tier: BuildTier }) {
  return (
    <article
      className={`group relative flex h-full flex-col rounded-[1.25rem] border bg-white/[0.02] p-7 backdrop-blur-[3px] transition-colors ${
        tier.popular
          ? "border-violet-400/40 hover:border-violet-400/60"
          : "border-white/15 hover:border-white/25"
      }`}
    >
      {tier.popular ? <PopularBadge /> : null}

      <h3 className="text-xl font-semibold tracking-tight text-white">
        {tier.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{tier.blurb}</p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-sm text-white/50">from</span>
        <span className="text-4xl font-semibold tracking-tight text-white">
          ${tier.startingAt.toLocaleString()}
        </span>
      </div>
      <p className="mt-1 text-xs text-white/45">one-time, or split over 4 months</p>

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {tier.features.map((feature) => (
          <FeatureItem key={feature}>{feature}</FeatureItem>
        ))}
      </ul>

      <Link
        href="/#strategy-call"
        className="mt-6 block w-full rounded-2xl border border-white/15 bg-white/[0.03] px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.06]"
      >
        Book a strategy call
      </Link>
    </article>
  );
}
