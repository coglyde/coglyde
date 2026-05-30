import { FeatureCard } from "./FeatureCard";
import { SeoBarChartVisual } from "./SeoBarChartVisual";

const features = [
  {
    title: "Custom graphic & web design",
    description:
      "Stand out with a custom-designed website that reflects your brand's identity and vision. Our designers work closely with you to create a website that resonates with your audience and drives engagement.",
    imageSrc: "/images/website-design/custom-graphic-web-design.png",
    imageAlt: "Orbiting design-tool logos: Webflow, Figma, Squarespace, Spline",
    span: "wide" as const,
  },
  {
    title: "Fully responsive design",
    description:
      "With the larger number of users accessing websites from mobile devices, we ensure your site is fully responsive, and developed mobile-first.",
    imageSrc: "/images/website-design/fully-responsive-design.png",
    imageAlt: "Mobile phone with iMessage conversation about responsive design",
    span: "narrow" as const,
  },
  {
    title: "Advanced integrations",
    description:
      "Looking to collect payments, schedule appointments, sell products, integrate crypto? We are builders by heart. We got you!",
    imageSrc: "/images/website-design/advanced-integrations.png",
    imageAlt: "Lead Funnel automation card on a gradient backdrop",
    imageClassName: "brightness-[0.78] saturate-[0.7]",
    span: "narrow" as const,
  },
  {
    title: "SEO-optimized, speaks to humans",
    description:
      "Our web designs incorporate best SEO practices to improve your website's visibility in search engines. We focus on keyword optimization, fast loading speeds, and mobile responsiveness to enhance your site's ranking. That's how we ensure you stand out, rank higher, and make a lasting impact online.",
    visual: <SeoBarChartVisual />,
    span: "wide" as const,
  },
];

export function FeatureGrid() {
  return (
    <section className="relative z-10 px-6 pb-16 sm:px-10 sm:pb-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className={
              feature.span === "wide"
                ? "lg:col-span-2"
                : "lg:col-span-1"
            }
          >
            <FeatureCard {...feature} />
          </div>
        ))}
      </div>
    </section>
  );
}
