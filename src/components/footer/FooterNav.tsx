import Image from "next/image";

type LinkItem = { label: string; href: string; external?: boolean };

const columns: { title: string; links: LinkItem[] }[] = [
  {
    title: "Services",
    links: [
      { label: "Web Design", href: "/services/website-design" },
      { label: "SEO", href: "#seo" },
      { label: "Automations", href: "#automations" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Blog", href: "#blog" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "LinkedIn", href: "https://linkedin.com", external: true },
      { label: "Twitter / X", href: "https://x.com", external: true },
      { label: "Instagram", href: "https://instagram.com", external: true },
      { label: "Email", href: "mailto:hello@coglyde.com" },
    ],
  },
];

export function FooterNav() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-16">
      <div className="flex flex-col gap-6">
        <Image
          src="/coglyde-logo.png"
          alt="Coglyde"
          width={430}
          height={125}
          className="h-9 w-auto"
        />
        <p className="max-w-xs text-[0.92rem] leading-[1.55] text-white/55">
          A Vancouver-based web design and digital marketing studio building
          sites that glide past the competition.
        </p>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[0.72rem] font-medium tracking-wide text-white/55">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          Available for new projects
        </div>
      </div>

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
                  className="group inline-flex items-center gap-1.5 text-[0.95rem] text-white/65 transition-colors hover:text-white"
                >
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
  );
}
