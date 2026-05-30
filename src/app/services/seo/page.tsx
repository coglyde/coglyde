import type { Metadata } from "next";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/Header";
import { PageAmbientBackground } from "@/components/PageAmbientBackground";
import { SeoCapabilities } from "@/components/seo/SeoCapabilities";
import { SeoCta } from "@/components/seo/SeoCta";
import { SeoFaq } from "@/components/seo/SeoFaq";
import { SeoHero } from "@/components/seo/SeoHero";
import { SeoHeroVideo } from "@/components/seo/SeoHeroVideo";
import { SeoProcess } from "@/components/seo/SeoProcess";
import { SeoReasons } from "@/components/seo/SeoReasons";
import { SeoResults } from "@/components/seo/SeoResults";

export const metadata: Metadata = {
  title: "SEO & GEO Services | Coglyde",
  description:
    "Ethical, white-hat SEO built for the AI era. We rank you on Google and get you cited in AI answers like ChatGPT, Perplexity and Google's AI Overviews.",
};

export default function SeoServicePage() {
  return (
    <>
      <PageAmbientBackground />
      <Header />
      <main className="relative z-10">
        <SeoHero />
        <SeoHeroVideo />
        <SeoReasons />
        <SeoCapabilities />
        <SeoProcess />
        <SeoResults />
        <SeoFaq />
        <SeoCta />
      </main>
      <Footer />
    </>
  );
}
