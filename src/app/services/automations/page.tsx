import type { Metadata } from "next";
import { AutomationsCapabilities } from "@/components/automations/AutomationsCapabilities";
import { AutomationsCta } from "@/components/automations/AutomationsCta";
import { AutomationsFaq } from "@/components/automations/AutomationsFaq";
import { AutomationsHero } from "@/components/automations/AutomationsHero";
import { AutomationsMenu } from "@/components/automations/AutomationsMenu";
import { AutomationsProcess } from "@/components/automations/AutomationsProcess";
import { AutomationsReasons } from "@/components/automations/AutomationsReasons";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/Header";
import { PageAmbientBackground } from "@/components/PageAmbientBackground";

export const metadata: Metadata = {
  title: "Business Automations | Coglyde",
  description:
    "AI automations that handle your busywork: missed-call text-back, AI chatbot and receptionist, lead generation, review requests, content and reporting, all built and managed for you.",
};

export default function AutomationsServicePage() {
  return (
    <>
      <PageAmbientBackground />
      <Header />
      <main className="relative z-10">
        <AutomationsHero />
        <AutomationsReasons />
        <AutomationsCapabilities />
        <AutomationsProcess />
        <AutomationsMenu />
        <AutomationsFaq />
        <AutomationsCta />
      </main>
      <Footer />
    </>
  );
}
