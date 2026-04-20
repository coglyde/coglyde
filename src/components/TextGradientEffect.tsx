import { ScrollRevealText } from "./text-reveal/ScrollRevealText";

const COPY =
  "What truly sets us apart is that we don\u2019t just focus on industry standards. As a team, we are constantly learning, adapting and investing into tools of the future. Our team at Coglyde finds this journey of continuous learning fulfilling. That\u2019s why we keep our team compact and with specialized domains.";

export function TextGradientEffect() {
  return (
    <section className="relative z-10 px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <ScrollRevealText
          text={COPY}
          className="bg-gradient-to-b from-violet-300 via-violet-500 to-violet-900 bg-clip-text text-4xl font-semibold leading-[1.15] tracking-tight text-transparent sm:text-5xl md:text-6xl"
        />
      </div>
    </section>
  );
}
