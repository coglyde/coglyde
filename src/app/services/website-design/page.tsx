import type { Metadata } from "next";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/Header";
import { PageAmbientBackground } from "@/components/PageAmbientBackground";
import { FaqSection } from "@/components/website-design/FaqSection";
import { FeatureGrid } from "@/components/website-design/FeatureGrid";
import { FrameworkSection } from "@/components/website-design/FrameworkSection";
import { TrustedPartnerSection } from "@/components/website-design/TrustedPartnerSection";
import { WebsiteDesignHero } from "@/components/website-design/WebsiteDesignHero";
import { WebsiteDesignPricing } from "@/components/website-design/WebsiteDesignPricing";

export const metadata: Metadata = {
  title: "Website Design that Stands Out | Coglyde",
  description:
    "Coglyde crafts stunning, user-friendly websites that drive results. Custom design, responsive development, integrations, and SEO, all in one team.",
};

export default function WebsiteDesignPage() {
  return (
    <>
      <PageAmbientBackground />
      <Header />
      <main className="relative z-10">
        <WebsiteDesignHero />
        <FeatureGrid />
        <FrameworkSection />
        <TrustedPartnerSection />
        <FaqSection />
        <WebsiteDesignPricing />
      </main>
      <Footer />
    </>
  );
}
