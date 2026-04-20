import { MarketingMockup } from "./MarketingMockup";
import { ServiceCardShell } from "./ServiceCardShell";
import { TrendingUpIcon } from "./icons";

export function MarketingServicesCard() {
  return (
    <ServiceCardShell
      icon={<TrendingUpIcon className="h-5 w-5" />}
      title="Marketing Services"
      description="Expand your presence with tailored paid marketing & search engine optimization strategies that connect you with the right audience and convert."
    >
      <MarketingMockup />
    </ServiceCardShell>
  );
}
