import { CreativeServicesCard } from "./CreativeServicesCard";
import { MarketingServicesCard } from "./MarketingServicesCard";

export function ServicesShowcase() {
  return (
    <section className="relative z-10 px-6 pt-24 sm:pt-32">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <CreativeServicesCard />
        <MarketingServicesCard />
      </div>
    </section>
  );
}
