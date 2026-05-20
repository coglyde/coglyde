import { CursorCanvasVisual } from "./CursorCanvasVisual";
import { ValuePropCard } from "./ValuePropCard";

const topRow = [
  {
    title: "Innovative Solutions",
    description:
      "At Coglyde, we embrace the latest design trends and technologies to craft unique websites. Our team is dedicated to staying ahead of the curve, ensuring your website remains competitive and relevant.",
    imageSrc: "/images/website-design/innovative-solutions.png",
    imageAlt: "Latest design trends chart with editor properties panel",
  },
  {
    title: "Holistic User Experience",
    description:
      "We prioritize the user experience in every project. From intuitive navigation to compelling visuals, our designs are crafted to keep your audience engaged and encourage them to take action.",
    imageSrc: "/images/website-design/holistic-user-experience.png",
    imageAlt: "Project tracker with 98 score gauge and assigned teams",
  },
];

const wideCard = {
  title: "Collaborative Partnership",
  description:
    "We view our clients as partners in the design process. We foster open communication and collaboration, ensuring that your vision is realized at every stage of development.",
  visual: <CursorCanvasVisual />,
  wide: true as const,
};

export function TrustedPartnerSection() {
  return (
    <section className="relative z-10 px-6 pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
            Solution
          </p>
          <h2 className="mt-4 text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl md:text-6xl">
            Your Trusted Web Design Partner
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/55">
            When it comes to web design, choosing the right partner can make all
            the difference. Here&rsquo;s why Coglyde stands out as your ideal
            choice:
          </p>
        </header>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {topRow.map((prop) => (
            <ValuePropCard key={prop.title} {...prop} />
          ))}
        </div>

        <div className="mt-6">
          <ValuePropCard {...wideCard} />
        </div>
      </div>
    </section>
  );
}
