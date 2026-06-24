import Image from "next/image";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/links";
import { LiquidGlass } from "./ui/LiquidGlass";
import { AuthMenu } from "./header/AuthMenu";
import { MobileNav } from "./header/MobileNav";
import { ServicesDropdown } from "./header/ServicesDropdown";

const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6 sm:px-6 lg:px-10">
      {/* Desktop bar */}
      <LiquidGlass
        radius={16}
        blur={14}
        saturation={85}
        displace={8}
        tint="#bbbbbc"
        tintOpacity={10}
        lightColor="#ffffff"
        shadowColor="#000000"
        lightReflex={0.45}
        shadowReflex={2}
        className="pointer-events-auto hidden w-full max-w-7xl items-center gap-4 px-8 py-3.5 lg:grid lg:grid-cols-[1fr_auto_1fr]"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center justify-self-start"
          aria-label="Coglyde home"
        >
          <Image
            src="/coglyde-logo.png"
            alt="Coglyde"
            width={430}
            height={125}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <nav className="flex items-center gap-8 justify-self-center text-[0.84rem] font-light tracking-[0.03em] text-white/70">
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

        <div className="flex items-center gap-6 justify-self-end">
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
      </LiquidGlass>

      {/* Mobile morphing nav */}
      <MobileNav />
    </header>
  );
}
