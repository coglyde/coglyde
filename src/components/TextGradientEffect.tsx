import { ScrollRevealText } from "./text-reveal/ScrollRevealText";

const COPY =
  "What truly sets us apart is that we don’t just focus on industry standards. As a team, we are constantly learning, adapting and investing into tools of the future. Our team at Coglyde finds this journey of continuous learning fulfilling. That’s why we keep our team compact and with specialized domains.";

export function TextGradientEffect() {
  return (
    <section className="relative z-10">
      <ScrollRevealText
        text={COPY}
        className="text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl md:text-6xl"
      />
    </section>
  );
}
