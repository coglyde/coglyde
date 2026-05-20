import Image from "next/image";
import type { ReactNode } from "react";
import { TriangleBullet } from "./TriangleBullet";

type ValuePropCardProps = {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  visual?: ReactNode;
  /** When true, the visual area is taller — used for the full-width row. */
  wide?: boolean;
};

export function ValuePropCard({
  title,
  description,
  imageSrc,
  imageAlt,
  visual,
  wide = false,
}: ValuePropCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-colors hover:border-white/15">
      <div
        className={`relative w-full overflow-hidden bg-black ${wide ? "aspect-[24/9]" : "aspect-[4/3]"}`}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            sizes={
              wide
                ? "(min-width: 1024px) 80vw, 95vw"
                : "(min-width: 1024px) 40vw, 95vw"
            }
            className="object-cover"
          />
        ) : (
          visual
        )}
      </div>
      <div className="px-8 pt-7 pb-8 sm:px-10 sm:pt-8 sm:pb-9">
        <h3 className="flex items-center gap-2.5 text-xl font-medium tracking-tight text-white sm:text-[22px]">
          <TriangleBullet className="h-2.5 w-2.5 text-white/80" />
          {title}
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/55 sm:text-[15px]">
          {description}
        </p>
      </div>
    </article>
  );
}
