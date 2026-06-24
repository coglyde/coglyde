"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { BOOKING_URL } from "@/lib/links";
import { LiquidGlass } from "../ui/LiquidGlass";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";

const MENU = [
  { label: "Web design", href: "/services/website-design" },
  { label: "SEO & GEO", href: "/services/seo" },
  { label: "Automations", href: "/services/automations" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
};

// The mobile navbar IS the menu: a single liquid-glass bar that grows to fit
// its content. Collapsed it's just logo + hamburger; opening reveals the links
// below by animating the panel's height, so the bar literally morphs into the
// menu (one element — never a separate overlay).
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [settled, setSettled] = useState(false);
  const { isSignedIn } = useAuth();

  useLockBodyScroll(open);

  const close = () => {
    setSettled(false);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="w-full lg:hidden">
      {/* Dim the page behind the open menu. */}
      <AnimatePresence>
        {open ? (
          <motion.button
            aria-hidden
            tabIndex={-1}
            onClick={close}
            className="pointer-events-auto fixed inset-0 z-40 cursor-default bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        ) : null}
      </AnimatePresence>

      <LiquidGlass
        radius={12}
        blur={24}
        saturation={90}
        displace={settled ? 8 : 0}
        tint="#0b0d12"
        tintOpacity={70}
        lightColor="#ffffff"
        shadowColor="#000000"
        lightReflex={0.5}
        shadowReflex={1.8}
        shadow="0 30px 70px -20px rgba(0,0,0,0.85)"
        className="pointer-events-auto relative z-50 w-full overflow-hidden"
      >
        {/* Top row — always present; this is the collapsed bar. */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <Link
            href="/"
            onClick={close}
            aria-label="Coglyde home"
            className="flex items-center"
          >
            <Image
              src="/coglyde-logo.png"
              alt="Coglyde"
              width={430}
              height={125}
              priority
              className="h-9 w-auto"
            />
          </Link>
          <button
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white"
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
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {/* Menu — grows the bar to fit its content (never forced to full height). */}
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.42, ease: EASE }}
              onAnimationComplete={() => {
                // Refraction on only once settled, so the grow stays smooth.
                if (open) setSettled(true);
              }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3">
                <motion.nav
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  className="no-scrollbar flex max-h-[52vh] flex-col overflow-y-auto"
                >
                  {MENU.map((item) => (
                    <motion.div key={item.label} variants={itemVariants}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className="group/row flex items-center justify-between border-b border-white/[0.07] py-3 text-lg font-light text-white/85 transition-colors hover:text-white"
                      >
                        {item.label}
                        <svg
                          viewBox="0 0 16 16"
                          aria-hidden
                          className="h-4 w-4 text-white/25 transition-all duration-200 group-hover/row:translate-x-0.5 group-hover/row:text-white"
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
                      </Link>
                    </motion.div>
                  ))}
                </motion.nav>

                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  className="mt-4 flex flex-col gap-2"
                >
                  <motion.div variants={itemVariants}>
                    <Link
                      href={isSignedIn ? "/account" : "/sign-in"}
                      onClick={close}
                      className="flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] py-3 text-base font-medium text-white transition-colors hover:bg-white/[0.14]"
                    >
                      {isSignedIn ? "Account" : "Sign in"}
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noreferrer"
                      onClick={close}
                      className="flex items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-base font-medium text-black transition-colors hover:bg-white/90"
                    >
                      Strategy Call
                      <span aria-hidden>→</span>
                    </a>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </LiquidGlass>
    </div>
  );
}
