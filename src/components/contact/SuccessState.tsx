"use client";

import { useEffect, useRef } from "react";

type SuccessStateProps = {
  onReset: () => void;
};

// transitions.dev "Success check": the mark fades in, rotates upright, bobs,
// and draws its stroke once the message sends. The dash length is measured
// from the live path so the draw is clean regardless of the icon geometry.
export function SuccessState({ onReset }: SuccessStateProps) {
  const checkRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrapper = checkRef.current;
    if (!wrapper) return;
    const path = wrapper.querySelector("path");
    if (path) {
      const len = Math.ceil(path.getTotalLength()) + 1;
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
    }
    wrapper.setAttribute("data-state", "out");
    void wrapper.offsetWidth; // reflow so the keyframes restart from 0
    wrapper.setAttribute("data-state", "in");
  }, []);

  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span
        ref={checkRef}
        data-state="out"
        aria-hidden
        className="t-success-check mb-7 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/40 bg-violet-400/10 text-violet-200 shadow-[0_0_40px_-8px_rgba(139,92,246,0.6)]"
      >
        <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8">
          <path
            d="M14 25 L21 32 L34 16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <h3 className="text-2xl font-medium tracking-tight text-white">
        Message on its way
      </h3>
      <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-white/60">
        Thanks for reaching out. We&rsquo;ve got your note and a real person will
        come back to you shortly.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-8 rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-3 text-[0.85rem] font-medium text-white/80 transition-colors duration-200 hover:border-white/25 hover:text-white"
      >
        Send another message
      </button>
    </div>
  );
}
