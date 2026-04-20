"use client";

import { useEffect, useRef } from "react";

type VideoLike = HTMLVideoElement;

export function useInViewVideo<T extends VideoLike>(threshold = 0.35) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold },
    );

    observer.observe(el);

    const handleVisibility = () => {
      if (document.hidden) el.pause();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [threshold]);

  return ref;
}
