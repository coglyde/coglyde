import Image from "next/image";
import type { PaddleStep } from "./paddle-data";

// Scattered neon social marks for the Educate card.
const SOCIAL_POS = [
  "left-[6%] bottom-[42%] w-[36%] rotate-[-6deg]",
  "right-[8%] bottom-[48%] w-[30%] rotate-[8deg]",
  "left-[28%] bottom-[8%] w-[34%] rotate-[3deg]",
  "right-[6%] bottom-[10%] w-[30%] rotate-[-5deg]",
  "left-[3%] bottom-[14%] w-[24%] rotate-[10deg]",
];

function SocialScatter({ socials }: { socials: string[] }) {
  return (
    <>
      {socials.map((src, i) => (
        <span
          key={src}
          className={`absolute aspect-square ${SOCIAL_POS[i % SOCIAL_POS.length]}`}
        >
          <Image src={src} alt="" fill sizes="7rem" className="object-contain" />
        </span>
      ))}
    </>
  );
}

// A tall framework card: colored icon + copy up top, a hero illustration that
// bleeds into the lower half, all over an accent-tinted gradient.
export function PaddleCard({ step }: { step: PaddleStep }) {
  const accent = (alpha: number) => `rgba(${step.accent}, ${alpha})`;

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 transition-colors duration-300 hover:border-white/20"
      style={{
        backgroundImage: `linear-gradient(162deg, ${accent(0.5)} 0%, ${accent(0.2)} 30%, rgba(8,8,12,0.96) 78%)`,
      }}
    >
      {/* Soft accent glow seated behind the illustration. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-3/5"
        style={{
          backgroundImage: `radial-gradient(80% 70% at 50% 100%, ${accent(0.4)} 0%, transparent 72%)`,
        }}
      />

      {/* Lower hero illustration, bleeding to the card edges. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[62%] transition-transform duration-500 group-hover:scale-[1.04]">
        {step.art ? (
          <Image
            src={step.art}
            alt=""
            fill
            sizes="22rem"
            className="object-contain object-bottom px-3 pt-2"
          />
        ) : step.socials ? (
          <SocialScatter socials={step.socials} />
        ) : null}
      </div>

      {/* Copy. */}
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] p-2 backdrop-blur-sm">
            <Image
              src={step.icon}
              alt=""
              width={30}
              height={30}
              className="h-7 w-7 object-contain"
            />
          </span>
          <h3 className="text-[1.4rem] font-medium tracking-tight text-white">{step.title}</h3>
        </div>

        <p className="mt-5 text-[0.92rem] leading-relaxed text-white/75">{step.body}</p>

        <div className="mt-6 h-px w-full bg-gradient-to-r from-white/20 to-transparent" />
      </div>
    </article>
  );
}
