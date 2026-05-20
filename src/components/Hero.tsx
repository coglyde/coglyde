import Image from "next/image";
import { CockpitIntro } from "./CockpitIntro";
import { Header } from "./Header";
import { StarfieldBackground } from "./StarfieldBackground";

const features = [
  "Blog Automation",
  "Unlimited UGC Adds",
  "Automated Lead Generation",
  "Premium 3D Models",
  "Custom Web Design",
];

export function Hero() {
  return (
    <>
      <StarfieldBackground />
      <Header />

      <CockpitIntro>
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(120, 145, 240, 0.55) 0%, rgba(160, 100, 240, 0.35) 45%, transparent 75%)",
            }}
          />
          <Image
            src="/images/coglyde-logo-gradient.png"
            alt="Coglyde"
            width={500}
            height={500}
            priority
            className="relative h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36"
          />
        </div>

        <h1 className="mt-8 max-w-[60rem] text-balance text-[3rem] font-medium leading-[1.05] tracking-tight text-white sm:text-[3.6rem] md:text-[4.6rem]">
          Glide over your competition with web design &amp; SEO
        </h1>

        <p className="mt-6 max-w-[44rem] text-pretty text-base leading-[1.55] text-white/65 sm:text-lg">
          Future-proof your business and get ahead of the competition with AI
          powered digital marketing solutions. From website design to advanced
          automations, sales funnels and creatives, we are your one stop shop.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#contact"
            className="rounded-2xl border border-white/15 bg-black/60 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:border-white/25 hover:bg-black/70"
            style={{ boxShadow: "0 0 24px rgba(120, 130, 255, 0.18)" }}
          >
            Contact us
          </a>
          <a
            href="#strategy-call"
            className="rounded-2xl bg-white/15 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            Glyde
          </a>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-white/70">
          {features.map((feature) => (
            <span key={feature} className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-white/50"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {feature}
            </span>
          ))}
        </div>
      </CockpitIntro>
    </>
  );
}
