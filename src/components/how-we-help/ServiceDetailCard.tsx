type ServiceDetailCardProps = {
  title: string;
  description: string;
};

export function ServiceDetailCard({
  title,
  description,
}: ServiceDetailCardProps) {
  return (
    <article className="rounded-3xl border border-white/15 bg-white/[0.06] px-8 py-7 text-center shadow-[0_20px_60px_-30px_rgba(123,57,252,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
      <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h3>
      <div className="my-5 h-px w-full bg-white/15" />
      <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/80 sm:text-[15px]">
        {description}
      </p>
    </article>
  );
}
