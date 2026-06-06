import Image from "next/image";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/links";
import { AuthMenu } from "./header/AuthMenu";
import { MobileMenu } from "./header/MobileMenu";
import { ServicesDropdown } from "./header/ServicesDropdown";

const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6 sm:px-6 lg:px-10">
      <div className="pointer-events-auto flex w-full max-w-7xl items-center justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-4 py-2.5 shadow-2xl backdrop-blur-xl sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-8 lg:py-3.5">
        <Link
          href="/"
          className="flex shrink-0 items-center lg:justify-self-start"
          aria-label="Coglyde home"
        >
          <Image
            src="/coglyde-logo.png"
            alt="Coglyde"
            width={430}
            height={125}
            priority
            className="h-7 w-auto sm:h-8"
          />
        </Link>

        <nav className="hidden items-center gap-8 justify-self-center text-[0.84rem] font-light tracking-[0.03em] text-white/70 lg:flex">
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

        <div className="hidden items-center gap-6 justify-self-end lg:flex">
          <AuthMenu />
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
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

        <MobileMenu />
      </div>
    </header>
  );
}
