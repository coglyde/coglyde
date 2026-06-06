import type { Metadata } from "next";
import { ogMetadata } from "@/lib/og";
import { AutomationsContentTimeline } from "@/components/automations/content/AutomationsContentTimeline";
import { AutomationsCta } from "@/components/automations/AutomationsCta";
import { AutomationsFaq } from "@/components/automations/AutomationsFaq";
import { AutomationsHero } from "@/components/automations/AutomationsHero";
import { AutomationsMenu } from "@/components/automations/AutomationsMenu";
import { AutomationsProcess } from "@/components/automations/AutomationsProcess";
import { AutomationsReasons } from "@/components/automations/AutomationsReasons";
import { AutomationsShowcase } from "@/components/automations/AutomationsShowcase";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/Header";
import { PageAmbientBackground } from "@/components/PageAmbientBackground";

export const metadata: Metadata = {
  title: "Business Automations | Coglyde",
  description:
    "AI automations that handle your busywork: an AI receptionist, missed-call text-back, chatbot, lead generation, review requests, content and reporting, all built and managed for you.",
  ...ogMetadata({
    eyebrow: "Automations",
    title: "Automations that handle your busywork",
    subtitle:
      "An AI receptionist, missed-call text-back, lead gen, reviews, content and reporting, built and managed for you.",
  }),
};

export default function AutomationsServicePage() {
  return (
    <>
      <PageAmbientBackground />
      <Header />
      <main className="relative z-10">
        <AutomationsHero />
        <AutomationsReasons />
        <AutomationsShowcase />
        <AutomationsContentTimeline />
        <AutomationsMenu />
        <AutomationsProcess />
        <AutomationsFaq />
        <AutomationsCta />
      </main>
      <Footer />
    </>
  );
}
