// Dark, violet-accented look for Clerk's hosted components so sign-in, sign-up
// and the user button match the site. This Clerk build reads the *new* color
// variable names (colorForeground, colorMutedForeground, colorInput, ...) while
// still accepting the legacy names (colorText, colorInputBackground, ...), so we
// set light values under BOTH schemes to be robust regardless of which the
// runtime resolves. Left untyped so it is structurally validated where it is
// passed to <ClerkProvider appearance={...}>.
export const clerkAppearance = {
  variables: {
    colorPrimary: "#8b5cf6",

    // Current Clerk variable names
    colorForeground: "#ffffff",
    colorMutedForeground: "rgba(255,255,255,0.65)",
    colorBackground: "#0b0b0f",
    colorInput: "rgba(255,255,255,0.06)",
    colorInputForeground: "#ffffff",
    colorRing: "#8b5cf6",
    colorNeutral: "#ffffff",

    // Legacy aliases (older clerk-js)
    colorText: "#ffffff",
    colorTextSecondary: "rgba(255,255,255,0.65)",
    colorInputText: "#ffffff",
    colorInputBackground: "rgba(255,255,255,0.06)",

    borderRadius: "0.9rem",
    fontFamily: "var(--font-geist-sans)",
  },
  elements: {
    card: "bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl",
    formButtonPrimary:
      "bg-violet-500 hover:bg-violet-400 text-white normal-case font-medium",
    footerActionLink: "text-violet-300 hover:text-violet-200",
  },
};
