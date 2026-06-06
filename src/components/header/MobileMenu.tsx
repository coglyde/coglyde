"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { BOOKING_URL } from "@/lib/links";

const MENU = [
  { label: "Web design", href: "/services/website-design" },
  { label: "SEO & GEO", href: "/services/seo" },
  { label: "Automations", href: "/services/automations" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// Hamburger menu shown below the `lg` breakpoint, where the desktop nav and CTA
// are hidden. Opens a compact panel with the nav links, auth and the CTA.
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const close = () => setOpen(false);

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center text-white/85 transition-colors hover:text-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          className="h-6 w-6"
          aria-hidden
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open ? (
        <>
          <button
            aria-hidden
            tabIndex={-1}
            onClick={close}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 top-full z-50 mt-3 w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]/95 p-2 shadow-2xl backdrop-blur-xl">
            {MENU.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={close}
                className="block rounded-xl px-4 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {item.label}
              </Link>
            ))}

            <div className="my-2 h-px bg-white/10" />

            <Link
              href={isSignedIn ? "/account" : "/sign-in"}
              onClick={close}
              className="block rounded-xl px-4 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              {isSignedIn ? "Account" : "Sign in"}
            </Link>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noreferrer"
              onClick={close}
              className="mt-1 block rounded-xl bg-white px-4 py-2.5 text-center text-sm font-medium text-black transition-colors hover:bg-white/90"
            >
              Strategy Call →
            </a>
          </div>
        </>
      ) : null}
    </div>
  );
}
