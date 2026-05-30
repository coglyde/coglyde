import Image from "next/image";
import Link from "next/link";
import { AuthMenu } from "./header/AuthMenu";
import { ServicesDropdown } from "./header/ServicesDropdown";

const navLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-8 py-3.5 backdrop-blur-xl shadow-2xl">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Coglyde home">
          <Image
            src="/coglyde-logo.png"
            alt="Coglyde"
            width={430}
            height={125}
            priority
            className="h-7 w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-12 text-[0.92rem] font-light tracking-[0.03em] text-white/70 md:flex">
          <ServicesDropdown />
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-all duration-200 hover:text-white hover:tracking-[0.05em]"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <AuthMenu />
          <a
            href="#strategy-call"
            className="group relative inline-flex items-center gap-2.5 rounded-full bg-white/95 px-6 py-2.5 text-[0.87rem] font-medium text-black shadow-lg transition duration-200 hover:bg-white hover:shadow-xl"
          >
            Strategy Call
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
