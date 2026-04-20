import Image from "next/image";

const columns = [
  {
    title: "Services",
    links: [
      { label: "Web Design", href: "#web-design" },
      { label: "SEO", href: "#seo" },
      { label: "Automations", href: "#automations" },
    ],
  },
  {
    title: "Agency",
    links: [
      { label: "Blog", href: "#blog" },
      { label: "Strategy Call", href: "#strategy-call" },
    ],
  },
];

export function FooterNav() {
  return (
    <div className="grid gap-10 sm:grid-cols-[auto_1fr] sm:gap-20">
      <div className="flex items-start">
        <Image
          src="/coglyde-logo.png"
          alt="Coglyde"
          width={430}
          height={125}
          className="h-10 w-auto"
        />
      </div>
      <div className="grid grid-cols-2 gap-10 sm:justify-end sm:text-right">
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold tracking-wide text-white">
              {column.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
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
