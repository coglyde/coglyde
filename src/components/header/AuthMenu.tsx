"use client";

import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { SignOutButton } from "@clerk/nextjs";

export function AuthMenu() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoaded) {
    // Skeleton matching the signed-in pill's footprint, so the header reserves
    // the space and doesn't blank out / shift while Clerk hydrates client-side.
    return (
      <div
        aria-hidden
        className="flex h-9 w-[120px] items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2"
      >
        <div className="h-6 w-6 animate-pulse rounded-full bg-white/10" />
        <div className="hidden h-3 w-10 animate-pulse rounded bg-white/10 sm:block" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <Link
        href="/sign-in"
        className="text-[0.92rem] font-light tracking-[0.03em] text-white/70 transition-all duration-200 hover:text-white hover:tracking-[0.05em]"
      >
        Sign in
      </Link>
    );
  }

  const initials = user?.firstName?.[0] ?? "?";

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 min-w-[120px] items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 transition-all duration-200 hover:bg-white/[0.12] hover:border-white/20"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-white/30 to-white/10 text-[0.75rem] font-semibold text-white">
          {initials}
        </div>
        <span className="hidden text-[0.92rem] font-light text-white/80 sm:inline">
          {user?.firstName}
        </span>
        <svg
          className={`h-3.5 w-3.5 text-white/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/15 bg-gradient-to-b from-white/[0.12] to-white/[0.06] backdrop-blur-xl shadow-xl animate-in fade-in duration-200">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-[0.85rem] font-medium text-white">{user?.firstName} {user?.lastName}</p>
            <p className="text-[0.75rem] text-white/60 truncate">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
          <div className="p-2 space-y-1">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-lg text-[0.90rem] text-white/80 transition-all duration-150 hover:bg-white/[0.15] hover:text-white"
            >
              Account Settings
            </Link>
            <SignOutButton redirectUrl="/">
              <button className="w-full text-left px-3 py-2 rounded-lg text-[0.90rem] text-white/80 transition-all duration-150 hover:bg-white/[0.15] hover:text-white">
                Sign out
              </button>
            </SignOutButton>
          </div>
        </div>
      )}
    </div>
  );
}
