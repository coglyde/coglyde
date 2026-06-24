import { useEffect } from "react";

/**
 * Freezes background scroll while `locked` is true (e.g. a full-screen menu or
 * modal is open) and restores the previous value on unlock/unmount.
 */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
