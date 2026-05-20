import Image from "next/image";
import type { ReactNode } from "react";
import { TriangleBullet } from "./TriangleBullet";

type FeatureCardProps = {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  visual?: ReactNode;
  span?: "wide" | "narrow";
};

export function FeatureCard({
  title,
  description,
  imageSrc,
  imageAlt,
  imageClassName,
  visual,
}: FeatureCardProps) {
  return (
    // h-full + flex-col + a flex-1 image area lets the image grow to consume
    // any vertical slack the grid hands us, so two cards in a row end up the
    // same height instead of leaving the narrower one with empty space below
    // its text.
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-white/20 bg-white/[0.02] backdrop-blur-[3px] transition-colors hover:border-white/30">
      <div className="relative aspect-[16/9] w-full overflow-hidden lg:aspect-auto lg:min-h-[20rem] lg:flex-1">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            sizes="(min-width: 1024px) 45vw, 95vw"
            className={`object-cover ${imageClassName ?? ""}`}
          />
        ) : (
          visual
        )}
      </div>
      <div className="px-6 pb-6">
        <h3 className="my-2 inline-flex items-center gap-3 text-[1.5rem] font-bold leading-tight tracking-tight text-white sm:text-[1.6rem]">
          <TriangleBullet className="h-3 w-3 shrink-0 text-white/85" />
          {title}
        </h3>
        <p className="text-[0.98rem] font-normal leading-[1.4] text-white/55">
          {description}
        </p>
      </div>
    </article>
  );
}
