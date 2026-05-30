import { WebsiteDesignPanel } from "@/components/pricing/panels/WebsiteDesignPanel";

// Pricing block for the /services/website-design page. Reuses the exact Website
// design stepper from /pricing (build, hosting/maintenance, add-ons) so the two
// pages never drift.
export function WebsiteDesignPricing() {
  return (
    <section className="relative z-10 px-6 py-20 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
            Pricing
          </p>
          <h2 className="mt-4 text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl">
            Website design pricing
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/55">
            A custom build quoted to scope, plus simple hosting and maintenance
            after launch. Add any automation, anytime.
          </p>
        </header>

        <div className="mt-14">
          <WebsiteDesignPanel />
        </div>
      </div>
    </section>
  );
}
