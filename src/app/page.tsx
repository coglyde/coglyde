import { EquippedTools } from "@/components/equipped/EquippedTools";
import { Footer } from "@/components/footer/Footer";
import { FullStackShowcase } from "@/components/FullStackShowcase";
import { Hero } from "@/components/Hero";
import { HowWeHelpSection } from "@/components/how-we-help/HowWeHelpSection";
import { PaddleFramework } from "@/components/paddle/PaddleFramework";
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
        <PaddleFramework />
        <EquippedTools />
      </main>
      <Footer />
    </>
  );
}
