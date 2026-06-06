import Image from "next/image";
import type { ReactNode } from "react";

type LinkItem = { label: string; href: string; external?: boolean; icon?: ReactNode };

const socialIcons: Record<string, ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.65 4.76 6.1V21h-4v-5.4c0-1.3-.02-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21H9V9Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.5 3h3l-6.6 7.5L21.7 21h-6l-4.3-5.6L6.5 21H3.4l7-8L2.8 3h6.1l3.9 5.1L17.5 3Zm-1 16h1.6L7.6 4.7H5.9L16.5 19Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.8" cy="7.2" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  ),
};

const columns: { title: string; links: LinkItem[] }[] = [
  {
    title: "Services",
    links: [
      { label: "Web Design", href: "/services/website-design" },
      { label: "SEO & GEO", href: "/services/seo" },
      { label: "Automations", href: "/services/automations" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/coglyde",
        external: true,
        icon: socialIcons.linkedin,
      },
      { label: "Twitter / X", href: "https://x.com", external: true, icon: socialIcons.x },
      {
        label: "Instagram",
        href: "https://www.instagram.com/coglyde/",
        external: true,
        icon: socialIcons.instagram,
      },
      { label: "Email", href: "mailto:info@coglyde.com", icon: socialIcons.email },
    ],
  },
];

export function FooterNav() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-16">
      <div className="flex flex-col gap-6">
        <Image
          src="/coglyde-logo.png"
          alt="Coglyde"
          width={430}
          height={125}
          className="h-9 w-auto self-start"
        />
        <p className="max-w-xs text-[0.92rem] leading-[1.55] text-white/55">
          A Vancouver-based web design and digital marketing studio building
          sites that glide past the competition.
        </p>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[0.72rem] font-medium tracking-wide text-white/55">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
          Available for new projects
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:contents">
        {columns.map((column) => (
          <div key={column.title}>
          <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/40">
            {column.title}
          </h3>
          <ul className="mt-5 space-y-3">
            {column.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="group inline-flex items-center gap-2 text-[0.95rem] text-white/65 transition-colors hover:text-white"
                >
                  {link.icon && (
                    <span className="flex h-4 w-4 items-center justify-center text-white/45 transition-colors group-hover:text-white">
                      {link.icon}
                    </span>
                  )}
                  {link.label}
                  {link.external && (
                    <svg
                      viewBox="0 0 12 12"
                      aria-hidden
                      className="h-3 w-3 -translate-y-px opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-60"
                    >
                      <path
                        d="M3 9 L9 3 M5 3 H9 V7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
      </div>
    </div>
  );
}
