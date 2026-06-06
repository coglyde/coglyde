export type PaddleStep = {
  title: string;
  body: string;
  /** Accent hue "r,g,b" used for the card gradient and glow. */
  accent: string;
  /** Colored app-style icon shown beside the title. */
  icon: string;
  /** Hero illustration that bleeds into the lower half of the card. */
  art?: string;
  /** Educate composes scattered neon social marks instead of one image. */
  socials?: string[];
};

// The P.A.D.D.L.E. framework: six steps from kickoff to handover. Icons and
// illustrations are the real Coglyde assets, served from /public/images/paddle.
export const PADDLE_STEPS: PaddleStep[] = [
  {
    title: "Plan",
    body: "Clarify your goals, define your audience, and map out the opportunities and obstacles ahead.",
    accent: "139, 92, 246",
    icon: "/images/paddle/icon-plan.png",
    art: "/images/paddle/art-plan.png",
  },
  {
    title: "Analyze",
    body: "Conduct a thorough analysis of your current presence, tooling, and infrastructure.",
    accent: "96, 116, 214",
    icon: "/images/paddle/icon-analyze.png",
    art: "/images/paddle/art-analyze.png",
  },
  {
    title: "Design",
    body: "Brainstorm ideas and generate custom illustrations, graphics, animations, and 3D models.",
    accent: "126, 140, 178",
    icon: "/images/paddle/icon-design.png",
    art: "/images/paddle/art-design.png",
  },
  {
    title: "Develop",
    body: "Get to building. Optimize for performance, efficiency, and conversion, and develop tooling.",
    accent: "45, 98, 226",
    icon: "/images/paddle/icon-develop.png",
    art: "/images/paddle/art-develop.webp",
  },
  {
    title: "Launch",
    body: "Deploy and launch. Constantly analyze performance and take benchmarks against your goals.",
    accent: "40, 170, 94",
    icon: "/images/paddle/icon-launch.png",
    art: "/images/paddle/art-launch.png",
  },
  {
    title: "Educate",
    body: "Educate your audience about your brand, and your team about your new and advanced tooling.",
    accent: "206, 70, 210",
    icon: "/images/paddle/icon-educate.png",
    socials: [
      "/images/paddle/social-instagram.png",
      "/images/paddle/social-x.png",
      "/images/paddle/social-facebook.png",
      "/images/paddle/social-linkedin.png",
      "/images/paddle/social-youtube.png",
    ],
  },
];
