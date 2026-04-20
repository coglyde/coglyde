import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

const GRADIENT =
  "linear-gradient(135deg, #0a0a0b 0%, #141316 28%, #2a2529 50%, #4d4449 72%, #8a7a80 92%, #c9bdb8 108%)";

export function ShinyButton({ href, children, className }: Props) {
  return (
    <a
      href={href}
      className={[
        "group relative inline-flex items-center gap-3 overflow-hidden rounded-full",
        "border border-white/15 px-8 py-4 text-white sm:px-10 sm:py-5",
        "shadow-[0_25px_60px_-20px_rgba(0,0,0,0.7)]",
        "transition-transform duration-500 ease-out hover:scale-[1.02]",
        className ?? "",
      ].join(" ")}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: GRADIENT,
          backgroundSize: "240% 240%",
          backgroundPosition: "0% 0%",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
        style={{
          backgroundImage: GRADIENT,
          backgroundSize: "240% 240%",
          backgroundPosition: "100% 100%",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
      <span className="relative text-xl font-semibold tracking-tight sm:text-2xl">
        {children}
      </span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="relative h-5 w-5 transition-transform duration-500 group-hover:translate-x-1 sm:h-6 sm:w-6"
      >
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </svg>
    </a>
  );
}
