"use client";

import { useEffect } from "react";

// On mount, read a single URL search param and, if its value is one of the
// allowed keys, apply it as the initial selection. This is what lets a link
// like /pricing?category=website-design&step=hosting open the dashboard directly
// on a given category/step instead of always starting at the first one.
//
// Runs client-side only (in an effect, after hydration) so we never touch
// `window` during SSR and never cause a hydration mismatch. It fires once on
// mount only, so a deep link seeds the starting view but then leaves the user
// free to click around without the URL fighting their navigation.
export function useDeepLinkSelection(
  param: string,
  allowed: readonly string[],
  apply: (value: string) => void,
) {
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get(param);
    if (requested && allowed.includes(requested)) {
      apply(requested);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
