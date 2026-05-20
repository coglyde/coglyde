type ServiceDetailCardProps = {
  title: string;
  description: string;
  index: number;
};

export function ServiceDetailCard({
  title,
  description,
  index,
}: ServiceDetailCardProps) {
  const label = String(index).padStart(2, "0");

  return (
    <article className="group relative pt-7">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent"
      />
      <div
        aria-hidden
        className="absolute left-0 top-0 h-px w-12 bg-white/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-xl font-semibold tracking-tight text-white">
          {title}
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
          {label}
        </span>
      </div>
      <p className="mt-4 text-[13.5px] leading-relaxed text-white/65">
        {description}
      </p>
    </article>
  );
}
