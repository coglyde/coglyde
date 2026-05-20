const legalLinks = [
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
];

export function FooterCopyright() {
  const year = new Date().getFullYear();
  return (
    <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-[0.82rem] text-white/45 sm:flex-row sm:items-center sm:justify-between">
      <p>© {year} Coglyde. All rights reserved.</p>
      <div className="flex items-center gap-6">
        <span className="inline-flex items-center gap-1.5">
          <svg
            viewBox="0 0 16 16"
            aria-hidden
            className="h-3.5 w-3.5 text-white/40"
          >
            <path
              d="M8 14s5-4.5 5-8.5A5 5 0 0 0 3 5.5C3 9.5 8 14 8 14Z"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
              strokeLinejoin="round"
            />
            <circle
              cx="8"
              cy="5.5"
              r="1.5"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
            />
          </svg>
          Made in Vancouver, BC
        </span>
        <div className="hidden h-3 w-px bg-white/10 sm:block" />
        <nav className="flex items-center gap-5">
          {legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
