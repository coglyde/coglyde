import type { Metadata } from "next";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/Header";
import { PageAmbientBackground } from "@/components/PageAmbientBackground";
import { Aurora } from "@/components/ui/Aurora";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactInfoPanel } from "@/components/contact/ContactInfoPanel";
import { ContactNextSteps } from "@/components/contact/ContactNextSteps";

export const metadata: Metadata = {
  title: "Contact · Coglyde",
  description:
    "Tell us about your project. A real person reads every message and replies within a day. Web design, SEO, and automations from a Vancouver studio.",
};

export default function ContactPage() {
  return (
    <>
      <PageAmbientBackground />

      {/* Aurora ribbons across the top, faded into the ambient backdrop. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[75vh] opacity-60"
        style={{
          maskImage: "linear-gradient(180deg, #000 0%, #000 45%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 45%, transparent 100%)",
        }}
      >
        <Aurora colorStops={["#6366f1", "#a855f7", "#3b82f6"]} amplitude={1.1} blend={0.55} />
      </div>

      <Header />

      <main className="relative z-10">
        <ContactHero />

        <section className="px-6 pb-24 sm:px-10 sm:pb-28">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
            <ContactForm />
            <ContactInfoPanel />
          </div>
        </section>

        <ContactNextSteps />
      </main>

      <Footer />
    </>
  );
}
