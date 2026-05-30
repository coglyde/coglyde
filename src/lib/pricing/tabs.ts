import type { PricingTabKey } from "./types";

// Tab metadata for the pricing dashboard. Each tab carries its own header copy
// and a `hasAnnual` flag — automations are monthly-only, so they hide the
// billing toggle. Order here is the order shown in the sidebar; the first entry
// is the default selection. "All-in-one" sits last as the upsell.
export type PricingTab = {
  key: PricingTabKey;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  hasAnnual: boolean;
};

export const pricingTabs: PricingTab[] = [
  {
    key: "website-design",
    label: "Website design",
    eyebrow: "Website design",
    title: "Build it, then keep it sharp",
    description:
      "A custom build quoted to scope, plus simple hosting and maintenance so your site stays fast, secure and cared for after launch.",
    hasAnnual: true,
  },
  {
    key: "seo",
    label: "SEO/GEO",
    eyebrow: "SEO and GEO",
    title: "Get found on Google and in AI answers",
    description:
      "Hands-on retainers where our team runs the keyword research, content, technical SEO and outreach for you.",
    hasAnnual: true,
  },
  {
    key: "automations",
    label: "Automations",
    eyebrow: "Automations",
    title: "Add-ons that run on autopilot",
    description:
      "Bolt these onto any plan or run them on their own. Billed monthly, cancel anytime.",
    hasAnnual: false,
  },
  {
    key: "all-in-one",
    label: "All-in-one",
    eyebrow: "All-in-one",
    title: "Everything, handled",
    description:
      "Hosting, upkeep, SEO and automations in a single plan, priced below buying each on its own. Pick a bundle and we run the whole stack.",
    hasAnnual: true,
  },
];
