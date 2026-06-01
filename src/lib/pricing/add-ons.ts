import type { AddOn } from "./types";

// The automation menu. The full list is shown everywhere add-ons appear (every
// pricing category, the website-design page, and the automations service page).
// Add-ons are billed monthly only. `group` buckets them on the service page;
// `variablePricing` flips the card to "from $X" for usage- or tier-based ones.
export const addOns: AddOn[] = [
  // --- Front desk: answer, qualify, book ---
  {
    key: "addon-missed-call",
    name: "Missed Call Text-Back",
    price: 149,
    group: "front-desk",
    variablePricing: true,
    blurb:
      "Fires an instant, on-brand text the moment a call goes unanswered, so a missed call never means a lost lead.",
    note: "Includes ~500 texts per month; overage billed at cost.",
  },
  {
    key: "addon-ai-chatbot",
    name: "AI Chatbot",
    price: 249,
    group: "front-desk",
    blurb:
      "Puts a chat widget trained on your business on your site to answer questions, qualify visitors, and book appointments around the clock.",
  },
  {
    key: "addon-ai-admin",
    name: "Virtual AI Admin",
    price: 497,
    group: "front-desk",
    variablePricing: true,
    blurb:
      "Hands your phone and inbox to an AI receptionist that greets callers, answers FAQs, books jobs, and routes anything that needs a human.",
    note: "Core tier. High-volume teams scale to a custom plan.",
  },
  {
    key: "addon-appointment-reminders",
    name: "Appointment Reminders",
    price: 99,
    group: "front-desk",
    blurb:
      "Sends automated confirmations and reminders over text and email that cut no-shows and keep your calendar full.",
  },
  // --- Lead generation & retention ---
  {
    key: "addon-lead-gen",
    name: "Lead Generation",
    price: 399,
    group: "lead-retention",
    variablePricing: true,
    blurb:
      "Finds qualified prospects and runs personalized outreach on autopilot to keep a steady flow of opportunities in your pipeline.",
    note: "Targeting and volume scoped to your market on a setup call.",
  },
  {
    key: "addon-nurture",
    name: "Email & SMS Nurture",
    price: 199,
    group: "lead-retention",
    blurb:
      "Runs automated drip sequences that warm every new lead and bring past customers back, completely hands-free.",
  },
  {
    key: "addon-reputation",
    name: "Reputation & Reviews",
    price: 149,
    group: "lead-retention",
    blurb:
      "Requests a review after every job, catches unhappy customers before they post, and drafts your replies for you.",
  },
  // --- Content & social ---
  {
    key: "addon-blog",
    name: "Blog Automation",
    price: 249,
    group: "content",
    blurb:
      "Researches, drafts, and publishes 4 to 8 SEO blog posts to your site every month in your brand voice.",
  },
  {
    key: "addon-carousel",
    name: "Carousel Generation",
    price: 149,
    group: "content",
    variablePricing: true,
    blurb:
      "Designs and delivers scroll-stopping carousels and slideshows for TikTok and Instagram on a steady schedule.",
    note: "Starts at 4 per month; scales with volume.",
  },
  // --- Research & reporting intelligence ---
  {
    key: "addon-keyword-research",
    name: "Keyword Research",
    price: 199,
    group: "intelligence",
    blurb:
      "Tracks your rankings and surfaces the keywords and questions worth targeting next, delivered to a live SEO dashboard.",
  },
  {
    key: "addon-research",
    name: "Research Automation",
    price: 199,
    group: "intelligence",
    blurb:
      "Monitors your market, competitors, and trends on a schedule and compiles the findings into a brief you can act on.",
  },
  {
    key: "addon-reporting",
    name: "Ads & Analytics Reporting",
    price: 149,
    group: "intelligence",
    blurb:
      "Pulls your ads, analytics, and conversions into one always-current dashboard so you never assemble a report by hand again.",
  },
];
