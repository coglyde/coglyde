import type { SubscriptionPlan } from "./types";

// Ongoing subscriptions for the Website design tab. Two plans: bare Hosting,
// and Hosting + Maintenance (a baseline retainer with direct access to the
// team). The maintenance tooltip sets expectations: there is a monthly
// minimum, it scales with what you ask for, and net-new builds are quoted
// separately.
export const websitePlans: SubscriptionPlan[] = [
  {
    key: "hosting",
    name: "Hosting",
    blurb: "Fast, secure, fully managed hosting for your custom-built site.",
    monthly: 39.99,
    features: [
      "Managed cloud hosting and global CDN",
      "SSL, daily backups and security patches",
      "Uptime and performance monitoring",
      "99.9% uptime, edge-cached worldwide",
      "Email support",
    ],
  },
  {
    key: "hosting-maintenance",
    name: "Hosting + Maintenance",
    blurb:
      "Everything in Hosting, plus a direct line to our team for fixes, edits and upkeep.",
    monthly: 139.99,
    popular: true,
    tooltip:
      "Maintenance is a baseline retainer: it covers hosting plus direct access to our team for issues, fixes and small content or design edits. It carries a monthly minimum and scales with what you request. Net-new pages or features are scoped and quoted separately.",
    features: [
      "Everything in Hosting",
      "Direct access to our team for issues and fixes",
      "Content and small design edits",
      "Dependency and framework upgrades",
      "Performance and Core Web Vitals monitoring",
      "Priority support, next business day",
      "New pages and features quoted separately",
    ],
  },
];
