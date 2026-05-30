import type { Metadata } from "next";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/Header";
import { PageAmbientBackground } from "@/components/PageAmbientBackground";
import { PricingDashboard } from "@/components/pricing/PricingDashboard";
import { PricingFaq } from "@/components/pricing/PricingFaq";
import { PricingHero } from "@/components/pricing/PricingHero";
import { PricingWindow } from "@/components/pricing/PricingWindow";

export const metadata: Metadata = {
  title: "Pricing | Coglyde",
  description:
    "All-in-one bundles, custom website builds with hosting and maintenance, hands-on SEO retainers, and a menu of automations. Pick a service tab to see its plans and add-ons.",
};

export default function PricingPage() {
  return (
    <>
      <PageAmbientBackground />
      <Header />
      <main className="relative z-10">
        <PricingHero />
        <section className="relative z-10 px-6 pb-24 pt-16 sm:px-10 sm:pt-24">
          <PricingWindow>
            <PricingDashboard />
          </PricingWindow>
        </section>
        <PricingFaq />
      </main>
      <Footer />
    </>
  );
}
