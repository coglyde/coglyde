type Glow = "violet" | "amber" | "blue";

// Layered radial gradients give each card its own coloured "nebula" glow.
const GLOWS: Record<Glow, string> = {
  violet:
    "radial-gradient(60% 60% at 80% 6%, rgba(167,139,250,0.45), transparent 60%), radial-gradient(55% 55% at 95% 35%, rgba(99,102,241,0.30), transparent 60%)",
  amber:
    "radial-gradient(65% 65% at 78% 100%, rgba(251,146,60,0.38), transparent 62%), radial-gradient(50% 50% at 95% 80%, rgba(244,114,182,0.22), transparent 60%)",
  blue: "radial-gradient(60% 60% at 16% 4%, rgba(59,130,246,0.40), transparent 60%), radial-gradient(55% 55% at 0% 35%, rgba(56,189,248,0.26), transparent 60%)",
};

// Tall card with a coloured gradient wash behind the copy — used for the
// "why SEO" trio. Title sits up top, description below.
export function GradientCard({
  title,
  description,
  glow,
}: {
  title: string;
  description: string;
  glow: Glow;
}) {
  return (
    <article className="group relative flex min-h-[17rem] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm transition-colors hover:border-white/20 sm:p-9">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundImage: GLOWS[glow] }}
      />
      <div className="relative">
        <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {title}
        </h3>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-white/65 sm:text-[15px]">
          {description}
        </p>
      </div>
    </article>
  );
}
