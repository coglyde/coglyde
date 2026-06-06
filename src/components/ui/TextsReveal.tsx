"use client";

import { useEffect, useRef, type ReactNode } from "react";

type TextsRevealProps = {
  children: ReactNode;
  className?: string;
  /** Fraction of the block visible before the reveal fires. */
  threshold?: number;
};

// transitions.dev "Texts reveal": wraps stacked lines that should rise into
// view with a staggered blur. Children opt in with
// `t-stagger-line t-stagger-line--N`. Reduced-motion users get the resting
// state immediately.
export function TextsReveal({
  children,
  className = "",
  threshold = 0.25,
}: TextsRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-shown");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-shown");
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={`t-stagger ${className}`}>
      {children}
    </div>
  );
}
