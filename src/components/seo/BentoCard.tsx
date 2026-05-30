import type { ReactNode } from "react";

type Glow = "none" | "violet" | "blue";

const GLOWS: Record<Glow, string> = {
  none: "",
  violet:
    "radial-gradient(70% 90% at 85% 0%, rgba(139,92,246,0.30), transparent 62%)",
  blue: "radial-gradient(60% 120% at 100% 50%, rgba(59,130,246,0.26), transparent 62%)",
};

// Flexible card for the capabilities bento. Supports an optional gradient glow
// and a horizontal (icon-beside-text) layout for wide cells, so the grid reads
// as varied shapes rather than identical tiles.
export function BentoCard({
  icon,
  title,
  description,
  glow = "none",
  horizontal = false,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  glow?: Glow;
  horizontal?: boolean;
}) {
  return (
    <article
      className={`group relative flex h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-sm transition-colors hover:border-white/20 sm:p-8 ${
        horizontal ? "flex-col sm:flex-row sm:items-center sm:gap-8" : "flex-col"
      }`}
    >
      {glow !== "none" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
          style={{ backgroundImage: GLOWS[glow] }}
        />
      ) : null}

      <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/25 to-blue-500/10 text-violet-200">
        {icon}
      </span>
      <div className={`relative ${horizontal ? "mt-6 sm:mt-0" : "mt-6"}`}>
        <h3 className="text-lg font-medium tracking-tight text-white sm:text-xl">
          {title}
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">
          {description}
        </p>
      </div>
    </article>
  );
}
