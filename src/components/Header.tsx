import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full border border-white/10 bg-black/40 px-5 py-2.5 backdrop-blur-md">
        <Link href="/" className="flex items-center" aria-label="Coglyde home">
          <Image
            src="/coglyde-logo.png"
            alt="Coglyde"
            width={430}
            height={125}
            priority
            className="h-8 w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-white/80 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#strategy-call"
          className="group inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-black transition hover:bg-white"
        >
          Strategy Call
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </a>
      </div>
    </header>
  );
}
