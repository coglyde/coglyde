import { Footer } from "@/components/footer/Footer";
import { FullStackShowcase } from "@/components/FullStackShowcase";
import { Hero } from "@/components/Hero";
import { HowWeHelpSection } from "@/components/how-we-help/HowWeHelpSection";
import { SecondaryServicesGrid } from "@/components/services/SecondaryServicesGrid";
import { ServicesShowcase } from "@/components/services/ServicesShowcase";
import { TextGradientEffect } from "@/components/TextGradientEffect";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <ServicesShowcase />
        <SecondaryServicesGrid />
        <HowWeHelpSection />
        <TextGradientEffect />
        <FullStackShowcase />
      </main>
      <Footer />
    </>
  );
}
