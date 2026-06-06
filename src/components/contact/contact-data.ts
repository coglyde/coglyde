// Static content for the contact page. Kept out of the components so copy edits
// don't touch markup.

export const SERVICE_OPTIONS = [
  "Web design",
  "SEO & GEO",
  "Automations",
  "Not sure yet",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

export type ContactChannel = {
  label: string;
  value: string;
  href: string;
  external?: boolean;
  hint: string;
};

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    label: "Email us",
    value: "info@coglyde.com",
    href: "mailto:info@coglyde.com",
    hint: "We usually reply within a few hours.",
  },
  {
    label: "Book a strategy call",
    value: "30 min, no pitch",
    href: "https://calendar.app.google/6MhjdL3dQTB1Nbbb9",
    external: true,
    hint: "Pick a slot that suits you.",
  },
  {
    label: "Studio",
    value: "Vancouver, BC",
    href: "https://maps.google.com/?q=Vancouver,BC",
    external: true,
    hint: "Working with clients worldwide.",
  },
];

export const NEXT_STEPS = [
  {
    title: "We read every word",
    body: "Your message lands straight in our inbox, not a queue. A real person reads it.",
  },
  {
    title: "A tailored reply",
    body: "Within a day we'll come back with thoughts, questions, and a clear next step.",
  },
  {
    title: "We map the plan",
    body: "If it's a fit, we'll scope the work together and set you up to glide.",
  },
] as const;
