import Image from "next/image";
import { ServiceCardShell } from "./ServiceCardShell";
import { PencilIcon } from "./icons";

export function CreativeServicesCard() {
  return (
    <ServiceCardShell
      icon={<PencilIcon className="h-5 w-5" />}
      title="Creative Services"
      description="Elevate your brand with innovative web design, stunning graphics, compelling copywriting, and dynamic video production tailored to make an impact."
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/40">
        <Image
          src="/images/creative-design-services-coglyde.png"
          alt="Creative tools honeycomb: Spline, Figma, Adobe Creative Cloud, Blender, Squarespace, Webflow, Midjourney"
          width={1320}
          height={920}
          className="h-auto w-full"
          sizes="(min-width: 1024px) 40vw, 90vw"
        />
      </div>
    </ServiceCardShell>
  );
}
