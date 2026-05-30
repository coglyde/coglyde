import Link from "next/link";
import type { ReactNode } from "react";

type Service = {
  title: string;
  tagline: string;
  href: string;
  icon: ReactNode;
  available: boolean;
};

const SERVICES: Service[] = [
  {
    title: "Web Design & Development",
    tagline: "Express your brand",
    href: "/services/website-design",
    available: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 17.5 14.5 7l3 3L7 20.5H4v-3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="m13 8.5 3 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M16.5 5 19 7.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Search Engine Optimization",
    tagline: "Become visible",
    href: "/services/seo",
    available: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle
          cx="11"
          cy="11"
          r="6"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="m20 20-4.2-4.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Automations",
    tagline: "Grow smarter",
    href: "#",
    available: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
];

function ServiceRowInner({ service }: { service: Service }) {
  return (
    <>
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-white/85 transition-colors duration-200 group-hover/item:border-white/20 group-hover/item:text-white">
        {/* Soft accent glow that swells on hover. */}
        <span
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/item:opacity-100"
          style={{
            backgroundImage:
              "radial-gradient(60% 60% at 50% 50%, rgba(112,124,255,0.35) 0%, rgba(112,124,255,0) 100%)",
          }}
        />
        <span className="relative block h-5 w-5">{service.icon}</span>
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.95rem] font-medium leading-tight text-white">
          {service.title}
        </span>
        <span className="mt-1 block text-[0.8rem] leading-tight text-white/55">
          {service.tagline}
        </span>
      </span>

      {service.available ? (
        <svg
          viewBox="0 0 16 16"
          aria-hidden
          className="h-4 w-4 shrink-0 self-center text-white/30 transition-all duration-200 group-hover/item:translate-x-0.5 group-hover/item:text-white"
        >
          <path
            d="m6 4 4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span className="shrink-0 self-center rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-white/55">
          Soon
        </span>
      )}
    </>
  );
}

export function ServicesDropdown() {
  return (
    <div className="group relative">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-[0.95rem] font-normal tracking-[0.04em] text-white/70 transition-colors hover:text-white focus:outline-none focus-visible:text-white"
        aria-haspopup="menu"
        aria-expanded="false"
      >
        Services
        <svg
          viewBox="0 0 12 12"
          aria-hidden
          className="h-3 w-3 text-white/60 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
        >
          <path
            d="m3 5 3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Hover bridge: pt-4 keeps the panel open while moving cursor from
          trigger to panel body. */}
      <div
        role="menu"
        className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-4 opacity-0 transition-[opacity,transform,visibility] duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
      >
        <div className="relative w-[24rem] rounded-2xl bg-[#0a0a0c] p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)_inset]">
          {/* Subtle gradient outer ring (sharper than a plain border). */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              padding: 1,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0) 60%)",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          {/* Faint purple wash at the top to echo the hero button. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-32 rounded-t-2xl opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(120% 100% at 50% 0%, rgba(112,124,255,0.10) 0%, rgba(0,0,0,0) 70%)",
            }}
          />

          {/* Top edge highlight — the "chique" detail. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />

          <div className="relative flex flex-col gap-0.5">
            {SERVICES.map((service) => {
              const baseClass =
                "group/item flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors";

              return service.available ? (
                <Link
                  key={service.title}
                  href={service.href}
                  role="menuitem"
                  className={`${baseClass} hover:bg-white/[0.06]`}
                >
                  <ServiceRowInner service={service} />
                </Link>
              ) : (
                <div
                  key={service.title}
                  role="menuitem"
                  aria-disabled="true"
                  className={`${baseClass} cursor-not-allowed`}
                >
                  <ServiceRowInner service={service} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
